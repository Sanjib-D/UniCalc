// category_307.js - Pregnancy Due Date Calculator
window.AppCalculators.category_3 = window.AppCalculators.category_3 || {};

window.AppCalculators.category_3.pregnancy_calc = {
  // 1. HTML Structure
  getHtml: function () {
    return `
      <div class="preg-calc-wrapper">
        
        <div class="preg-header-bar">
          <div class="preg-method-group">
            <label>Calculation Method</label>
            <select id="preg-method" class="preg-select-main">
              <option value="lmp">Last Period (LMP)</option>
              <option value="conception">Conception Date</option>
              <option value="ivf">IVF Transfer Date</option>
            </select>
          </div>
        </div>

        <div class="preg-grid-layout initial-center" id="preg-grid-container">
          
          <div class="preg-input-card">
            <h4 class="preg-card-title"><i class="fas fa-baby-carriage"></i> Pregnancy Details</h4>
            
            <div id="input-sec-lmp" class="input-section active">
               <div class="preg-group">
                 <label>First Day of Last Period</label>
                 <input type="date" id="date-lmp" class="preg-date-input">
               </div>
               <div class="preg-group">
                 <label>Average Cycle Length (Days)</label>
                 <div class="cycle-control">
                   <button class="cycle-btn" id="cyc-minus"><i class="fas fa-minus"></i></button>
                   <input type="number" id="cycle-len" value="28" min="20" max="45" class="cycle-input">
                   <button class="cycle-btn" id="cyc-plus"><i class="fas fa-plus"></i></button>
                 </div>
                 <small class="hint-text">Standard is 28 days</small>
               </div>
            </div>

            <div id="input-sec-conception" class="input-section" style="display:none;">
               <div class="preg-group">
                 <label>Date of Conception / Ovulation</label>
                 <input type="date" id="date-conception" class="preg-date-input">
               </div>
            </div>

            <div id="input-sec-ivf" class="input-section" style="display:none;">
               <div class="preg-group">
                 <label>Transfer Date</label>
                 <input type="date" id="date-ivf" class="preg-date-input">
               </div>
               <div class="preg-group">
                 <label>Embryo Type</label>
                 <div class="ivf-toggle">
                   <span class="ivf-opt active" data-val="3">Day 3 Transfer</span>
                   <span class="ivf-opt" data-val="5">Day 5 Transfer</span>
                 </div>
               </div>
            </div>

            <button id="preg-calc-btn" class="preg-btn-main">Calculate Due Date</button>
            
            <div class="disclaimer-text">
               <i class="fas fa-info-circle"></i> This tool provides an estimate based on standard medical rules. Please consult your healthcare provider for accurate dating.
            </div>
          </div>

          <div class="preg-result-card" id="preg-results" style="display:none;">
            
            <div class="preg-res-header">
              <span class="res-sub">Estimated Due Date</span>
              <h1 id="res-edd">--</h1>
              <div class="res-current" id="res-current-status">You are -- weeks pregnant</div>
            </div>

            <div class="preg-progress-container">
               <div class="progress-labels">
                 <span>0w</span>
                 <span>40w</span>
               </div>
               <div class="preg-progress-track">
                 <div id="preg-progress-bar" class="preg-progress-fill"></div>
                 <div id="preg-marker" class="preg-marker"><i class="fas fa-baby"></i></div>
               </div>
               <div class="trimester-labels">
                 <span class="tri t1">1st Trimester</span>
                 <span class="tri t2">2nd Trimester</span>
                 <span class="tri t3">3rd Trimester</span>
               </div>
            </div>

            <div class="preg-stats-grid">
               <div class="p-stat">
                 <small>Conception Date</small>
                 <strong id="val-conception">--</strong>
               </div>
               <div class="p-stat">
                 <small>1st Trimester Ends</small>
                 <strong id="val-t1-end">--</strong>
               </div>
               <div class="p-stat">
                 <small>2nd Trimester Ends</small>
                 <strong id="val-t2-end">--</strong>
               </div>
            </div>

            <div class="preg-timeline">
               <h4><i class="fas fa-calendar-check"></i> Key Milestones</h4>
               <div class="timeline-list" id="milestone-list">
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
    const qa = (sel) => document.querySelectorAll(sel);

    let state = {
      method: 'lmp',
      ivfType: 3 // 3 or 5 day
    };

    // --- Set Default Date to Today ---
    const today = new Date().toISOString().split('T')[0];
    $('date-lmp').value = today;
    $('date-conception').value = today;
    $('date-ivf').value = today;

    // --- Method Switching ---
    $('preg-method').addEventListener('change', (e) => {
        state.method = e.target.value;
        // Hide all inputs
        $('input-sec-lmp').style.display = 'none';
        $('input-sec-conception').style.display = 'none';
        $('input-sec-ivf').style.display = 'none';
        
        // Show selected
        document.getElementById(`input-sec-${state.method}`).style.display = 'block';
    });

    // --- Cycle Buttons ---
    $('cyc-minus').onclick = () => $('cycle-len').stepDown();
    $('cyc-plus').onclick = () => $('cycle-len').stepUp();

    // --- IVF Toggle ---
    qa('.ivf-opt').forEach(btn => {
      btn.addEventListener('click', () => {
         qa('.ivf-opt').forEach(b => b.classList.remove('active'));
         btn.classList.add('active');
         state.ivfType = parseInt(btn.dataset.val);
      });
    });

    // --- Calculate ---
    $('preg-calc-btn').onclick = () => {
        this.calculate(state);
    };
  },

  // 3. Calculation Logic
  calculate: function(state) {
    const $ = (id) => document.getElementById(id);
    const method = state.method;
    
    let dueDate = new Date();
    let conceptionDate = new Date();
    
    // 1. Determine Due Date based on Method
    if (method === 'lmp') {
        const lmpStr = $('date-lmp').value;
        if(!lmpStr) return alert("Please select a date.");
        // Set time to noon to avoid timezone rolling issues
        const lmp = new Date(lmpStr + "T12:00:00");
        const cycle = parseInt($('cycle-len').value) || 28;
        
        // Naegele's Rule: LMP + 280 days + (Cycle - 28) adjustment
        const offset = cycle - 28;
        dueDate = new Date(lmp);
        dueDate.setDate(lmp.getDate() + 280 + offset);
        
        conceptionDate = new Date(lmp);
        conceptionDate.setDate(lmp.getDate() + 14 + offset); // Approx ovulation
    } 
    else if (method === 'conception') {
        const conStr = $('date-conception').value;
        if(!conStr) return alert("Please select a date.");
        conceptionDate = new Date(conStr + "T12:00:00");
        
        // Conception + 266 days (38 weeks)
        dueDate = new Date(conceptionDate);
        dueDate.setDate(conceptionDate.getDate() + 266);
    } 
    else if (method === 'ivf') {
        const ivfStr = $('date-ivf').value;
        if(!ivfStr) return alert("Please select a date.");
        const transferDate = new Date(ivfStr + "T12:00:00");
        
        // Transfer Date + 266 days - (Transfer Age)
        // e.g. Day 5 transfer means baby is already 5 days old relative to conception
        dueDate = new Date(transferDate);
        dueDate.setDate(transferDate.getDate() + 266 - state.ivfType);
        
        conceptionDate = new Date(transferDate);
        conceptionDate.setDate(transferDate.getDate() - state.ivfType);
    }

    // 2. Calculate Current Progress
    const today = new Date();
    today.setHours(12,0,0,0); // Match time logic
    
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Total pregnancy length is usually considered 280 days (40 weeks) from LMP
    const daysDiff = Math.round((dueDate - today) / oneDay);
    const daysPregnant = 280 - daysDiff;
    
    // 3. Milestones Helper
    // LMP Equivalent date helps calculate "Week X" dates
    const lmpEquiv = new Date(dueDate);
    lmpEquiv.setDate(dueDate.getDate() - 280);
    
    const getWeekDate = (w) => {
        const d = new Date(lmpEquiv);
        d.setDate(lmpEquiv.getDate() + (w * 7));
        return d;
    };

    // 4. Update UI
    const container = $('preg-grid-container');
    container.classList.remove('initial-center');
    $('preg-results').style.display = 'block';

    // Format Dates
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    $('res-edd').innerText = fmt(dueDate);
    
    // Weeks/Days Logic
    let displayStatus = "";
    let pct = 0;

    if (daysPregnant < 0) {
        displayStatus = "Pregnancy hasn't started yet";
        pct = 0;
    } else if (daysPregnant > 300) {
        displayStatus = "Baby likely arrived!";
        pct = 100;
    } else {
        const w = Math.floor(daysPregnant / 7);
        const d = daysPregnant % 7;
        displayStatus = `${w} weeks, ${d} days pregnant`;
        pct = (daysPregnant / 280) * 100;
    }
    
    $('res-current-status').innerText = displayStatus;
    
    // Progress Bar
    if(pct > 100) pct = 100;
    if(pct < 0) pct = 0;
    // Animate width
    setTimeout(() => {
        $('preg-progress-bar').style.width = pct + '%';
        $('preg-marker').style.left = pct + '%';
    }, 100);

    // Stats
    $('val-conception').innerText = fmt(conceptionDate);
    $('val-t1-end').innerText = fmt(getWeekDate(13)); // End of W13
    $('val-t2-end').innerText = fmt(getWeekDate(27)); // End of W27

    // Timeline Builder
    // Define key weeks and descriptions
    const milestones = [
        { week: 4, title: "Positive Test Likely", desc: "hCG levels are usually high enough." },
        { week: 6, title: "Heartbeat Detectable", desc: "Early ultrasound may detect a pulse." },
        { week: 12, title: "First Trimester Ends", desc: "Risk of miscarriage drops significantly." },
        { week: 20, title: "Anatomy Scan", desc: "Detailed scan; gender often revealed." },
        { week: 24, title: "Viability Milestone", desc: "Baby has a chance of survival if born." },
        { week: 28, title: "Third Trimester Begins", desc: "Baby opens eyes; rapid growth starts." },
        { week: 37, title: "Full Term", desc: "Baby is considered ready for birth." }
    ];

    let html = '';
    milestones.forEach(m => {
        const d = getWeekDate(m.week);
        // Check if this date is in the past
        const isPast = today >= d;
        const cls = isPast ? 'past' : '';
        const icon = isPast ? 'fa-check-circle' : 'fa-circle';
        
        html += `
          <div class="m-item ${cls}">
             <div class="m-date">
                <span class="d-text">${fmt(d)}</span>
                <span class="w-text">Week ${m.week}</span>
             </div>
             <div class="m-marker"><i class="fas ${icon}"></i></div>
             <div class="m-content">
                <strong>${m.title}</strong>
                <p>${m.desc}</p>
             </div>
          </div>
        `;
    });
    $('milestone-list').innerHTML = html;
  }
};