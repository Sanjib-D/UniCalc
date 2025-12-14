// category_308.js - Period & Ovulation Tracker
window.AppCalculators.category_3 = window.AppCalculators.category_3 || {};

window.AppCalculators.category_3.ovulation_calc = {
  // 1. HTML Structure
  getHtml: function () {
    return `
      <div class="ovu-calc-wrapper">
        
        <div class="ovu-header-bar">
          <div class="ovu-info-badge">
            <i class="fas fa-heartbeat"></i> Cycle Tracker
          </div>
        </div>

        <div class="ovu-grid-layout initial-center" id="ovu-grid-container">
          
          <div class="ovu-input-card">
            <h4 class="ovu-card-title">Your Cycle Details</h4>
            
            <div class="ovu-group">
              <label>First Day of Last Period</label>
              <input type="date" id="ovu-date-lmp" class="ovu-date-input">
            </div>

            <div class="ovu-row-split">
                <div class="ovu-group">
                  <label>Cycle Length <small>(Days)</small></label>
                  <div class="cycle-stepper">
                    <button class="step-btn" id="cyc-dec"><i class="fas fa-minus"></i></button>
                    <input type="number" id="ovu-cycle-len" value="28" min="21" max="45" class="step-input">
                    <button class="step-btn" id="cyc-inc"><i class="fas fa-plus"></i></button>
                  </div>
                </div>
                <div class="ovu-group">
                  <label>Period Length <small>(Days)</small></label>
                  <div class="cycle-stepper">
                    <button class="step-btn" id="per-dec"><i class="fas fa-minus"></i></button>
                    <input type="number" id="ovu-period-len" value="5" min="2" max="10" class="step-input">
                    <button class="step-btn" id="per-inc"><i class="fas fa-plus"></i></button>
                  </div>
                </div>
            </div>

            <button id="ovu-calc-btn" class="ovu-btn-main">Track My Cycle</button>
            
            <div class="ovu-disclaimer">
               <i class="fas fa-shield-alt"></i> Estimates only. Not for contraception.
            </div>
          </div>

          <div class="ovu-result-card" id="ovu-results" style="display:none;">
            
            <div class="ovu-res-header">
              <div class="status-pill" id="status-pill">--</div>
              <h2 id="next-event-title">Next Period Starts</h2>
              <h1 id="next-event-date">--</h1>
            </div>

            <div class="ovu-calendar-box">
               <div class="cal-nav">
                 <button id="cal-prev"><i class="fas fa-chevron-left"></i></button>
                 <span id="cal-month-year">Month Year</span>
                 <button id="cal-next"><i class="fas fa-chevron-right"></i></button>
               </div>
               <div class="cal-days-header">
                 <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
               </div>
               <div class="cal-grid" id="calendar-grid">
                 </div>
               <div class="cal-legend">
                 <div class="leg-item"><span class="dot period"></span> Period</div>
                 <div class="leg-item"><span class="dot fertile"></span> Fertile</div>
                 <div class="leg-item"><span class="dot ovu"></span> Ovulation</div>
               </div>
            </div>

            <div class="cycle-summary">
               <h4>Upcoming Dates</h4>
               <div class="cycle-row">
                 <span class="lbl">Ovulation Day</span>
                 <span class="val" id="val-ovu-date">--</span>
               </div>
               <div class="cycle-row">
                 <span class="lbl">Fertile Window</span>
                 <span class="val" id="val-fertile-win">--</span>
               </div>
               <div class="cycle-row">
                 <span class="lbl">Pregnancy Test</span>
                 <span class="val" id="val-test-date">--</span>
               </div>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  // 2. Initialization
  init: function () {
    const $ = (id) => document.getElementById(id);
    const today = new Date().toISOString().split('T')[0];
    $('ovu-date-lmp').value = today;

    // Helper: Stepper Logic
    const setupStepper = (minusId, plusId, inputId) => {
        $(minusId).onclick = () => $(inputId).stepDown();
        $(plusId).onclick = () => $(inputId).stepUp();
    };
    setupStepper('cyc-dec', 'cyc-inc', 'ovu-cycle-len');
    setupStepper('per-dec', 'per-inc', 'ovu-period-len');

    // Calendar State
    let currentCalDate = new Date(); 

    // Navigation for Calendar
    $('cal-prev').onclick = () => {
        currentCalDate.setMonth(currentCalDate.getMonth() - 1);
        this.renderCalendar(currentCalDate, this.lastState);
    };
    $('cal-next').onclick = () => {
        currentCalDate.setMonth(currentCalDate.getMonth() + 1);
        this.renderCalendar(currentCalDate, this.lastState);
    };

    // Calculate
    $('ovu-calc-btn').onclick = () => {
        const lmpStr = $('ovu-date-lmp').value;
        if(!lmpStr) return alert("Please select a date.");
        
        const state = {
            lmp: new Date(lmpStr + "T12:00:00"), // Avoid timezone shift
            cycle: parseInt($('ovu-cycle-len').value) || 28,
            period: parseInt($('ovu-period-len').value) || 5
        };
        
        this.lastState = state; // Save for calendar nav
        currentCalDate = new Date(state.lmp); // Start calendar at LMP month
        
        this.calculate(state);
    };
  },

  // 3. Calculation Logic
  calculate: function(state) {
    const $ = (id) => document.getElementById(id);
    const container = $('ovu-grid-container');
    container.classList.remove('initial-center');
    $('ovu-results').style.display = 'block';

    const oneDay = 24 * 60 * 60 * 1000;

    // --- Key Dates ---
    // Ovulation is usually 14 days BEFORE the NEXT period
    // Next Period = LMP + Cycle Length
    const nextPeriod = new Date(state.lmp.getTime() + (state.cycle * oneDay));
    const ovulationDate = new Date(nextPeriod.getTime() - (14 * oneDay));
    
    // Fertile Window: 5 days before ovulation + ovulation day + 1 day after
    const fertileStart = new Date(ovulationDate.getTime() - (5 * oneDay));
    const fertileEnd = new Date(ovulationDate.getTime() + (1 * oneDay));
    
    // Pregnancy Test Date (Usually 1st day of missed period)
    const testDate = new Date(nextPeriod);

    // --- Format Output ---
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const fmtLong = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    $('next-event-title').innerText = "Next Period Expected";
    $('next-event-date').innerText = fmtLong(nextPeriod);
    
    $('val-ovu-date').innerText = fmtLong(ovulationDate);
    $('val-fertile-win').innerText = `${fmt(fertileStart)} - ${fmt(fertileEnd)}`;
    $('val-test-date').innerText = fmtLong(testDate);

    // Current Status Pill
    const today = new Date();
    today.setHours(12,0,0,0);
    
    // Check where we are relative to LMP
    const diffTime = today - state.lmp;
    const dayOfCycle = Math.floor(diffTime / oneDay) + 1;
    
    let statusText = "";
    let statusClass = "neutral";

    if(dayOfCycle >= 1 && dayOfCycle <= state.period) {
        statusText = `Period Day ${dayOfCycle}`;
        statusClass = "period";
    } else if (today >= fertileStart && today <= fertileEnd) {
        statusText = "High Fertility";
        statusClass = "fertile";
        if(today.toDateString() === ovulationDate.toDateString()) {
            statusText = "Peak Fertility (Ovulation)";
            statusClass = "peak";
        }
    } else if (dayOfCycle > state.cycle) {
        statusText = `Late by ${dayOfCycle - state.cycle} days`;
        statusClass = "period";
    } else {
        statusText = `Cycle Day ${dayOfCycle}`;
        statusClass = "neutral";
    }
    
    const pill = $('status-pill');
    pill.innerText = statusText;
    pill.className = `status-pill ${statusClass}`;

    // Render Calendar
    this.renderCalendar(new Date(state.lmp), state);
  },

  renderCalendar: function(date, state) {
      if(!state) return;
      const $ = (id) => document.getElementById(id);
      
      const year = date.getFullYear();
      const month = date.getMonth();
      
      $('cal-month-year').innerText = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const grid = $('calendar-grid');
      grid.innerHTML = '';

      // Cycle Math helpers
      const oneDay = 24 * 60 * 60 * 1000;
      
      // Calculate cycle start relative to this month to paint repeating cycles
      // We need to find a "Base Cycle Start" before or in this month
      // Start from LMP and jump by cycleLength
      
      // Normalize dates to noon to avoid DST issues
      const lmpTime = state.lmp.getTime();
      const cycleMs = state.cycle * oneDay;
      
      // Check Day Logic
      const checkDate = (d) => {
          const t = d.getTime();
          const diff = t - lmpTime;
          
          // If before LMP
          if(diff < 0) return null;
          
          const cycleProgress = diff % cycleMs; // 0 to cycleMs
          const dayInCycle = Math.floor(cycleProgress / oneDay) + 1; // 1-based index
          
          // 1. Period?
          if(dayInCycle <= state.period) return 'period';
          
          // 2. Ovulation? (Day 14 before end)
          // Cycle length 28 -> Ovulation day 14 (28-14)
          // Cycle length 30 -> Ovulation day 16 (30-14)
          const ovuDay = state.cycle - 14;
          if(dayInCycle === ovuDay) return 'ovu';
          
          // 3. Fertile? (5 before ovu to 1 after)
          // Ranges: [ovu-5, ovu+1]
          if(dayInCycle >= (ovuDay - 5) && dayInCycle <= (ovuDay + 1)) return 'fertile';
          
          return null;
      };

      // Fill Empty Slots
      for(let i=0; i<firstDay; i++) {
          grid.innerHTML += `<div class="day empty"></div>`;
      }

      // Fill Days
      const todayStr = new Date().toDateString();
      
      for(let i=1; i<=daysInMonth; i++) {
          const d = new Date(year, month, i);
          d.setHours(12,0,0,0);
          
          const type = checkDate(d);
          let cls = 'day';
          if(type) cls += ` ${type}`;
          
          if(d.toDateString() === todayStr) cls += ' today';
          
          grid.innerHTML += `<div class="${cls}">${i}</div>`;
      }
  }
};