if (!window.AppCalculators.category_2) window.AppCalculators.category_2 = {};

window.AppCalculators.category_2.savings_goal_calc = {
  name: "Savings Goal Calculator",

  init: function() {
    this.syncSlider('sav-target', 'range-sav-target');
    this.syncSlider('sav-years', 'range-sav-years');
    this.calculate();
  },

  getHtml: function() {
    return `
      <div class="sav-calc-wrapper">
        
        <div class="sav-mode-switch">
          <button class="sav-mode-btn active" id="mode-req" onclick="window.AppCalculators.category_2.savings_goal_calc.switchMode('req')">
            <i class="fas fa-bullseye"></i> I have a Goal
          </button>
          <button class="sav-mode-btn" id="mode-grow" onclick="window.AppCalculators.category_2.savings_goal_calc.switchMode('grow')">
            <i class="fas fa-seedling"></i> I want to Grow
          </button>
        </div>

        <div class="sav-grid">
          
          <div class="sav-inputs">
            
            <div class="sav-card" id="card-target">
              <div class="sav-card-header">
                <label>Target Goal Amount</label>
                <div class="input-val-wrapper">
                  <span class="curr-symbol">$</span>
                  <input type="number" id="sav-target" value="50000" oninput="window.AppCalculators.category_2.savings_goal_calc.syncSlider('sav-target', 'range-sav-target')">
                </div>
              </div>
              <input type="range" id="range-sav-target" min="1000" max="500000" step="1000" value="50000" class="styled-slider" oninput="window.AppCalculators.category_2.savings_goal_calc.syncInput('sav-target', 'range-sav-target')">
            </div>

            <div class="sav-card" id="card-monthly" style="display:none;">
              <div class="sav-card-header">
                <label>Monthly Contribution</label>
                <div class="input-val-wrapper">
                  <span class="curr-symbol">$</span>
                  <input type="number" id="sav-monthly" value="500" oninput="window.AppCalculators.category_2.savings_goal_calc.calculate()">
                </div>
              </div>
            </div>

            <div class="sav-card">
              <div class="sav-card-header">
                <label>Current Savings</label>
                <div class="input-val-wrapper small-wrapper">
                  <span class="curr-symbol">$</span>
                  <input type="number" id="sav-current" value="5000" oninput="window.AppCalculators.category_2.savings_goal_calc.calculate()">
                </div>
              </div>
            </div>

            <div class="sav-card">
              <div class="sav-card-header">
                <label>Time Horizon (Years)</label>
                <div class="input-val-wrapper small-wrapper">
                  <input type="number" id="sav-years" value="5" oninput="window.AppCalculators.category_2.savings_goal_calc.syncSlider('sav-years', 'range-sav-years')">
                </div>
              </div>
              <input type="range" id="range-sav-years" min="1" max="40" step="1" value="5" class="styled-slider" oninput="window.AppCalculators.category_2.savings_goal_calc.syncInput('sav-years', 'range-sav-years')">
            </div>

            <div class="sav-card">
              <div class="sav-card-header">
                <label>Exp. Return Rate (%)</label>
                <div class="input-val-wrapper small-wrapper">
                  <input type="number" id="sav-rate" value="6" step="0.1" oninput="window.AppCalculators.category_2.savings_goal_calc.calculate()">
                </div>
              </div>
            </div>

            <div class="advanced-toggle" onclick="document.getElementById('sav-adv-options').classList.toggle('show')">
              <span><i class="fas fa-sliders-h"></i> Inflation & Step-Up</span>
              <i class="fas fa-chevron-down"></i>
            </div>

            <div id="sav-adv-options" class="advanced-section">
              <div class="form-group">
                <label>Inflation Rate (%)</label>
                <input type="number" id="sav-inflation" value="0" placeholder="0" oninput="window.AppCalculators.category_2.savings_goal_calc.calculate()">
                <small style="color:#888; font-size:0.75rem;">Adjusts target for future cost</small>
              </div>
              <div class="form-group">
                <label>Annual Step-Up (%)</label>
                <input type="number" id="sav-stepup" value="0" placeholder="0" oninput="window.AppCalculators.category_2.savings_goal_calc.calculate()">
              </div>
            </div>

            <button class="calc-btn-lg sav-btn" onclick="window.AppCalculators.category_2.savings_goal_calc.calculate()">
                Calculate Plan <i class="fas fa-rocket"></i>
            </button>

          </div>

          <div class="sav-results">
            
            <div class="sav-main-res">
                <span id="label-res-main">Required Monthly Saving</span>
                <h1 id="val-res-main">$0</h1>
                <div class="sav-badge" id="val-badge">Achievable</div>
            </div>

            <div class="sav-summary-grid">
                <div class="sav-stat">
                    <small>Total Contribution</small>
                    <strong id="val-total-inv">$0</strong>
                </div>
                <div class="sav-stat">
                    <small>Interest Earned</small>
                    <strong id="val-total-int" class="text-success">$0</strong>
                </div>
            </div>

            <div class="sav-chart-box">
                <h4>Growth Projection</h4>
                <div class="chart-wrapper">
                    <svg id="sav-growth-chart" viewBox="0 0 300 150" preserveAspectRatio="none"></svg>
                </div>
                <div class="chart-legend">
                    <span><span class="dot d-inv"></span> Saved</span>
                    <span><span class="dot d-int"></span> Interest</span>
                </div>
            </div>

            <div id="inf-insight" class="inf-alert" style="display:none;">
                <i class="fas fa-info-circle"></i> Due to inflation, your <b>$50k</b> goal will cost <b>$60k</b> in future terms.
            </div>

            <button class="schedule-btn-outline" onclick="window.AppCalculators.category_2.savings_goal_calc.toggleTable()">
                View Yearly Schedule
            </button>

          </div>
        </div>

        <div id="sav-table-wrapper" class="sav-table-box">
            <table class="sav-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Contribution</th>
                        <th>Interest</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody id="sav-table-body"></tbody>
            </table>
        </div>

      </div>
    `;
  },

  mode: 'req', // 'req' (Required Saving) or 'grow' (Future Value)

  switchMode: function(m) {
    this.mode = m;
    document.querySelectorAll('.sav-mode-btn').forEach(b => b.classList.remove('active'));
    
    if(m === 'req') {
        document.getElementById('mode-req').classList.add('active');
        document.getElementById('card-target').style.display = 'block';
        document.getElementById('card-monthly').style.display = 'none';
        document.getElementById('label-res-main').innerText = "Required Monthly Saving";
    } else {
        document.getElementById('mode-grow').classList.add('active');
        document.getElementById('card-target').style.display = 'none';
        document.getElementById('card-monthly').style.display = 'block';
        document.getElementById('label-res-main').innerText = "Projected Future Value";
    }
    this.calculate();
  },

  syncSlider: function(inputId, rangeId) {
    const val = document.getElementById(inputId).value;
    document.getElementById(rangeId).value = val;
    this.updateSliderFill(rangeId);
    this.calculate();
  },

  syncInput: function(inputId, rangeId) {
    const val = document.getElementById(rangeId).value;
    document.getElementById(inputId).value = val;
    this.updateSliderFill(rangeId);
    this.calculate();
  },

  updateSliderFill: function(rangeId) {
    const range = document.getElementById(rangeId);
    const percentage = ((range.value - range.min) / (range.max - range.min)) * 100;
    range.style.background = `linear-gradient(90deg, #0984e3 ${percentage}%, #e9ecef ${percentage}%)`;
  },

  toggleTable: function() {
    const el = document.getElementById('sav-table-wrapper');
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
    if(el.style.display === 'block') el.scrollIntoView({behavior: 'smooth'});
  },

  formatMoney: function(num) {
    return "$" + num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  },

  calculate: function() {
    const current = parseFloat(document.getElementById('sav-current').value) || 0;
    const years = parseFloat(document.getElementById('sav-years').value) || 1;
    const rate = parseFloat(document.getElementById('sav-rate').value) || 0;
    const inflation = parseFloat(document.getElementById('sav-inflation').value) || 0;
    const stepUp = parseFloat(document.getElementById('sav-stepup').value) || 0;

    const monthlyRate = rate / 100 / 12;
    const months = years * 12;

    let resultMain = 0;
    let totalInvested = current;
    let totalInterest = 0;
    let schedule = [];

    // --- Inflation Adjustment logic ---
    let target = 0;
    if (this.mode === 'req') {
        let nominalTarget = parseFloat(document.getElementById('sav-target').value) || 0;
        // If inflation > 0, adjust target. FV = PV * (1+inf)^n
        target = nominalTarget * Math.pow(1 + inflation/100, years);
        
        if (inflation > 0) {
            document.getElementById('inf-insight').style.display = 'block';
            document.getElementById('inf-insight').innerHTML = `<i class="fas fa-info-circle"></i> To match <b>${this.formatMoney(nominalTarget)}</b> purchasing power today, you need <b>${this.formatMoney(target)}</b> in ${years} years.`;
        } else {
            document.getElementById('inf-insight').style.display = 'none';
        }
    } else {
        document.getElementById('inf-insight').style.display = 'none';
    }

    // --- Calculation Loop (Universal for complex Step-up) ---
    // If Mode = Grow: Simple iteration
    // If Mode = Req: We need to solve for PMT. 
    // With Step-up, formula is complex. We use iterative approximation (Binary Search) for 'Req' mode.

    if (this.mode === 'grow') {
        let monthly = parseFloat(document.getElementById('sav-monthly').value) || 0;
        let balance = current;
        
        for(let m=1; m<=months; m++) {
            // Apply Step-Up every 12 months
            if (m > 1 && (m-1) % 12 === 0) {
                monthly = monthly * (1 + stepUp/100);
            }
            
            let interest = balance * monthlyRate;
            balance += interest + monthly;
            totalInvested += monthly;
            totalInterest += interest;

            if (m % 12 === 0) {
                schedule.push({ year: m/12, inv: totalInvested, int: totalInterest, bal: balance });
            }
        }
        resultMain = balance;
        document.getElementById('val-badge').innerText = "Future Value";
    } 
    else {
        // Mode: Find PMT
        // Binary Search for PMT
        let low = 0, high = target; 
        let bestPMT = 0;
        let finalBal = 0;

        for(let i=0; i<50; i++) { // 50 iterations enough for precision
            let mid = (low + high) / 2;
            let simBal = current;
            let simPMT = mid;
            
            for(let m=1; m<=months; m++) {
                if (m > 1 && (m-1) % 12 === 0) simPMT = simPMT * (1 + stepUp/100);
                simBal += (simBal * monthlyRate) + simPMT;
            }
            
            if (simBal < target) low = mid;
            else high = mid;
            
            bestPMT = high;
            finalBal = simBal;
        }
        
        // Re-run standard loop for correct stats with bestPMT
        let monthly = bestPMT;
        let balance = current;
        totalInvested = current;
        totalInterest = 0;
        
        for(let m=1; m<=months; m++) {
            if (m > 1 && (m-1) % 12 === 0) monthly = monthly * (1 + stepUp/100);
            let interest = balance * monthlyRate;
            balance += interest + monthly;
            totalInvested += monthly;
            totalInterest += interest;
            
            if (m % 12 === 0) {
                schedule.push({ year: m/12, inv: totalInvested, int: totalInterest, bal: balance });
            }
        }
        
        resultMain = bestPMT; // Initial monthly needed
        document.getElementById('val-badge').innerText = "Goal Plan";
    }

    // --- Update UI ---
    document.getElementById('val-res-main').innerText = this.formatMoney(resultMain);
    document.getElementById('val-total-inv').innerText = this.formatMoney(totalInvested);
    document.getElementById('val-total-int').innerText = this.formatMoney(totalInterest);

    this.drawChart(schedule);
    this.renderTable(schedule);
  },

  drawChart: function(data) {
    const svg = document.getElementById('sav-growth-chart');
    const w = 300, h = 150, pad = 10;
    
    const maxVal = data[data.length-1].bal;
    const getX = (i) => (i / (data.length - 1)) * (w - 2*pad) + pad;
    const getY = (v) => h - pad - ((v / maxVal) * (h - 2*pad));

    // Balance Area
    let pathD = `M ${pad} ${h-pad} `;
    data.forEach((d, i) => pathD += `L ${getX(i)} ${getY(d.bal)} `);
    pathD += `L ${w-pad} ${h-pad} Z`;

    // Invested Line
    let lineD = `M ${pad} ${getY(data[0].inv)} `;
    data.forEach((d, i) => lineD += `L ${getX(i)} ${getY(d.inv)} `);

    svg.innerHTML = `
        <defs>
            <linearGradient id="gradSav" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#0984e3;stop-opacity:0.6" />
                <stop offset="100%" style="stop-color:#0984e3;stop-opacity:0.1" />
            </linearGradient>
        </defs>
        <path d="${pathD}" fill="url(#gradSav)" />
        <path d="${lineD}" fill="none" stroke="#00cec9" stroke-width="2" stroke-dasharray="4" />
    `;
  },

  renderTable: function(data) {
    const tbody = document.getElementById('sav-table-body');
    tbody.innerHTML = data.map(d => `
        <tr>
            <td>${d.year}</td>
            <td>${this.formatMoney(d.inv)}</td>
            <td style="color:#00b894">+${this.formatMoney(d.int)}</td>
            <td><strong>${this.formatMoney(d.bal)}</strong></td>
        </tr>
    `).join('');
  }
};