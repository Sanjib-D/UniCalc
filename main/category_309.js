// category_309.js - Sleep Cycle Calculator
window.AppCalculators.category_3 = window.AppCalculators.category_3 || {};

window.AppCalculators.category_3.sleep_calc = {
  // 1. HTML Structure
  getHtml: function () {
    return `
      <div class="sleep-calc-wrapper">
        
        <div class="sleep-header-bar">
          <div class="sleep-badge">
            <i class="fas fa-moon"></i> Sleep Optimizer
          </div>
        </div>

        <div class="sleep-grid-layout initial-center" id="sleep-grid-container">
          
          <div class="sleep-input-card">
            
            <div class="sleep-mode-switch">
              <button class="sm-btn active" data-mode="wake">I want to wake at...</button>
              <button class="sm-btn" data-mode="bed">I'm going to bed at...</button>
            </div>

            <div class="sleep-main-input-group">
              <label id="time-label">Desired Wake Up Time</label>
              <div class="time-picker-wrapper">
                <input type="time" id="sleep-time-input" class="sleep-time-input">
                <button id="set-now-btn" class="now-btn" style="display:none;">Set Now</button>
              </div>
            </div>

            <div class="sleep-settings-grid">
              <div class="s-group">
                <label>Time to Fall Asleep</label>
                <select id="sleep-latency" class="sleep-select">
                  <option value="5">5 mins (Instant)</option>
                  <option value="15" selected>15 mins (Average)</option>
                  <option value="30">30 mins (Slow)</option>
                  <option value="45">45 mins (Insomnia)</option>
                </select>
              </div>
              <div class="s-group">
                <label>Age Group</label>
                <select id="sleep-age" class="sleep-select">
                  <option value="teen">Teen (14-17)</option>
                  <option value="adult" selected>Adult (18-64)</option>
                  <option value="older">Older Adult (65+)</option>
                </select>
              </div>
            </div>

            <button id="sleep-calc-btn" class="sleep-btn-main">Calculate Best Times</button>
            
            <div class="nap-section">
               <span class="nap-label">Need a quick boost?</span>
               <div class="nap-buttons">
                 <button class="nap-btn" id="nap-power"><i class="fas fa-bolt"></i> Power Nap (20m)</button>
                 <button class="nap-btn" id="nap-cycle"><i class="fas fa-sync-alt"></i> Full Cycle (90m)</button>
               </div>
            </div>
          </div>

          <div class="sleep-result-card" id="sleep-results" style="display:none;">
            
            <div class="sleep-res-header">
              <span id="res-subtitle">To wake up refreshed at 7:00 AM, you should sleep at:</span>
            </div>

            <div class="best-time-box">
               <div class="star-badge"><i class="fas fa-star"></i> Best Time</div>
               <h1 id="res-best-time">--:--</h1>
               <span id="res-best-cycles">6 Cycles (9 Hours)</span>
            </div>

            <div class="sleep-train-container">
               <div class="train-track" id="cycle-list">
                  </div>
            </div>

            <div class="sleep-options-box">
               <h4>Other Options</h4>
               <div class="opt-grid" id="other-options-grid">
                  </div>
            </div>

            <div class="sleep-tip-box">
               <i class="fas fa-lightbulb"></i>
               <span id="sleep-tip-text">A standard sleep cycle lasts about 90 minutes. Waking up between cycles helps you feel energized.</span>
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
      mode: 'wake', // 'wake' or 'bed'
      time: '07:00',
      latency: 15,
      age: 'adult'
    };

    // --- Set Default Time (Tomorrow 7AM or Now) ---
    // If wake mode, default 7am. If bed mode, default Now.
    $('sleep-time-input').value = "07:00";

    // --- Mode Switching ---
    qa('.sm-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        qa('.sm-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.mode = btn.dataset.mode;
        
        if (state.mode === 'wake') {
            $('time-label').innerText = "Desired Wake Up Time";
            $('set-now-btn').style.display = 'none';
            $('sleep-time-input').value = "07:00";
        } else {
            $('time-label').innerText = "Bedtime / Sleep Start";
            $('set-now-btn').style.display = 'block';
            this.setNow();
        }
      });
    });

    // --- Set Now Button ---
    this.setNow = () => {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        $('sleep-time-input').value = `${h}:${m}`;
    };
    $('set-now-btn').onclick = this.setNow;

    // --- Nap Buttons ---
    $('nap-power').onclick = () => this.calcNap(20);
    $('nap-cycle').onclick = () => this.calcNap(90);

    // --- Main Calculate ---
    $('sleep-calc-btn').onclick = () => {
       state.time = $('sleep-time-input').value;
       state.latency = parseInt($('sleep-latency').value);
       state.age = $('sleep-age').value;
       this.calculate(state);
    };
  },

  // 3. Calculation Logic
  calculate: function(state) {
    if(!state.time) return alert("Please set a time.");

    const $ = (id) => document.getElementById(id);
    const container = $('sleep-grid-container');
    container.classList.remove('initial-center');
    $('sleep-results').style.display = 'block';

    // Parse Base Time
    const [h, m] = state.time.split(':').map(Number);
    const baseDate = new Date();
    baseDate.setHours(h, m, 0, 0);

    // If 'wake' mode: We calculate BACKWARDS from wake time
    // If 'bed' mode: We calculate FORWARDS from bed time (adding latency first)

    const cycleLen = 90; // minutes
    const cyclesToCalc = [6, 5, 4, 3]; // Standard recommendations
    
    let results = [];

    cyclesToCalc.forEach(cycleCount => {
        const totalSleepMin = cycleCount * cycleLen;
        let resultDate = new Date(baseDate);

        if (state.mode === 'wake') {
            // Wake Time - (Sleep Duration + Latency)
            // Example: 7:00 AM - (9h + 15m)
            const totalSub = totalSleepMin + state.latency;
            resultDate.setMinutes(resultDate.getMinutes() - totalSub);
        } else {
            // Bed Time + Latency + Sleep Duration
            const totalAdd = totalSleepMin + state.latency;
            resultDate.setMinutes(resultDate.getMinutes() + totalAdd);
        }
        
        results.push({
            cycles: cycleCount,
            date: resultDate,
            durationH: (totalSleepMin / 60).toFixed(1)
        });
    });

    // Sort results chronologically for display flow
    results.sort((a, b) => a.date - b.date);

    // --- Update UI ---
    
    // Subtitle
    const timeStr = this.formatTime(baseDate);
    if(state.mode === 'wake') {
        $('res-subtitle').innerText = `To wake up at ${timeStr}, you should fall asleep at:`;
    } else {
        $('res-subtitle').innerText = `If you sleep at ${timeStr}, wake up at:`;
    }

    // Determine "Best" (Usually 5 or 6 cycles depending on age)
    let bestCycles = (state.age === 'teen') ? 6 : 5; 
    // Teen: 9h (6 cycles), Adult: 7.5h (5 cycles) usually sufficient minimum, but 6 is ideal.
    // Let's bias towards 5-6 range.
    
    // Find the best option in our results array
    let bestOption = results.find(r => r.cycles === bestCycles) || results[results.length-1];
    
    // If calculating forward (bed mode), chronological order is 3,4,5,6
    // If calculating backward (wake mode), chronological order is 6,5,4,3 (earliest time first)
    
    // Let's strictly highlight the 5 or 6 cycle one
    const preferredCycles = (state.age === 'older') ? 5 : (state.age === 'teen' ? 6 : 5);
    bestOption = results.find(r => r.cycles === preferredCycles);

    $('res-best-time').innerText = this.formatTime(bestOption.date);
    $('res-best-cycles').innerText = `${bestOption.cycles} Cycles (${bestOption.durationH} Hours Sleep)`;

    // Render Options List
    let html = '';
    results.forEach(res => {
        if(res === bestOption) return; // Skip main display
        const quality = res.cycles >= 5 ? 'Ideal' : (res.cycles === 4 ? 'Okay' : 'Short');
        const qClass = res.cycles >= 5 ? 'good' : (res.cycles === 4 ? 'avg' : 'low');
        
        html += `
          <div class="opt-card ${qClass}">
             <span class="opt-time">${this.formatTime(res.date)}</span>
             <span class="opt-cycles">${res.cycles} Cycles</span>
             <span class="opt-badge">${quality}</span>
          </div>
        `;
    });
    $('other-options-grid').innerHTML = html;

    // Render Sleep Train (Visual of the Best Option)
    // Show [Fall Asleep] -> [C1] -> [C2] ... -> [Wake]
    // We just visualize blocks
    let trainHtml = '';
    // Latency Block
    trainHtml += `<div class="train-car latency" title="Falling Asleep"><i class="fas fa-hourglass-start"></i></div>`;
    
    for(let i=1; i<=bestOption.cycles; i++) {
        let label = (i === bestOption.cycles && state.mode==='bed') ? 'Wake' : i;
        trainHtml += `<div class="train-car cycle"><span>${label}</span></div>`;
    }
    
    if(state.mode === 'wake') {
        trainHtml += `<div class="train-car wake" title="Wake Up"><i class="fas fa-sun"></i></div>`;
    }
    
    $('cycle-list').innerHTML = trainHtml;
  },

  calcNap: function(min) {
      const now = new Date();
      const wakeTime = new Date(now.getTime() + min*60000);
      alert(`For a ${min} minute nap, set your alarm for: ${this.formatTime(wakeTime)}`);
  },

  formatTime: function(date) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
};