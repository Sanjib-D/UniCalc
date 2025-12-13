if (!window.AppCalculators.category_2) window.AppCalculators.category_2 = {};

window.AppCalculators.category_2.sip_calc = {
  name: "SIP Calculator",

  init: function() {
    this.syncSlider('sip-amount', 'sip-amount-range');
    this.syncSlider('sip-rate', 'sip-rate-range');
    this.syncSlider('sip-years', 'sip-years-range');
    this.calculate(); // Auto-calc on load
  },

  getHtml: function() {
    return `
      <div class="sip-calc-wrapper">
        
        <div class="sip-modes">
          <button class="sip-mode-btn active" id="mode-std" onclick="window.AppCalculators.category_2.sip_calc.switchMode('std')">
            <i class="fas fa-chart-line"></i> Standard SIP
          </button>
          <button class="sip-mode-btn" id="mode-step" onclick="window.AppCalculators.category_2.sip_calc.switchMode('step')">
            <i class="fas fa-layer-group"></i> Step-Up SIP
          </button>
          <button class="sip-mode-btn" id="mode-target" onclick="window.AppCalculators.category_2.sip_calc.switchMode('target')">
            <i class="fas fa-bullseye"></i> Target Goal
          </button>
        </div>

        <div class="sip-grid">
          <div class="sip-inputs">
            
            <div class="input-card" id="card-amount">
              <div class="input-header">
                <label id="lbl-amount">Monthly Investment</label>
                <div class="input-val-wrapper">
                  <span class="currency-symbol">$</span>
                  <input type="number" id="sip-amount" value="500" oninput="window.AppCalculators.category_2.sip_calc.syncSlider('sip-amount', 'sip-amount-range')">
                </div>
              </div>
              <input type="range" id="sip-amount-range" min="100" max="100000" step="100" value="500" class="styled-slider" oninput="window.AppCalculators.category_2.sip_calc.syncInput('sip-amount', 'sip-amount-range')">
            </div>

            <div class="input-card" id="card-target" style="display:none;">
              <div class="input-header">
                <label>Target Goal Amount</label>
                <div class="input-val-wrapper">
                  <span class="currency-symbol">$</span>
                  <input type="number" id="sip-target-val" value="1000000" oninput="window.AppCalculators.category_2.sip_calc.calculate()">
                </div>
              </div>
              <small style="color:#666;">How much do you want to save?</small>
            </div>

            <div class="input-card">
              <div class="input-header">
                <label>Expected Return Rate (p.a)</label>
                <div class="input-val-wrapper">
                  <input type="number" id="sip-rate" value="12" step="0.1" oninput="window.AppCalculators.category_2.sip_calc.syncSlider('sip-rate', 'sip-rate-range')">
                  <span class="unit-symbol">%</span>
                </div>
              </div>
              <input type="range" id="sip-rate-range" min="1" max="30" step="0.1" value="12" class="styled-slider" oninput="window.AppCalculators.category_2.sip_calc.syncInput('sip-rate', 'sip-rate-range')">
            </div>

            <div class="input-card">
              <div class="input-header">
                <label>Time Period (Years)</label>
                <div class="input-val-wrapper small">
                  <input type="number" id="sip-years" value="10" oninput="window.AppCalculators.category_2.sip_calc.syncSlider('sip-years', 'sip-years-range')">
                </div>
              </div>
              <input type="range" id="sip-years-range" min="1" max="50" step="1" value="10" class="styled-slider" oninput="window.AppCalculators.category_2.sip_calc.syncInput('sip-years', 'sip-years-range')">
            </div>

            <div class="input-card" id="card-step" style="display:none; border-left:4px solid #fd7e14;">
              <div class="input-header">
                <label>Annual Step-Up %</label>
                <div class="input-val-wrapper small">
                  <input type="number" id="sip-step-pct" value="10" oninput="window.AppCalculators.category_2.sip_calc.calculate()">
                  <span class="unit-symbol">%</span>
                </div>
              </div>
              <small style="color:#666;">Increase investment every year by...</small>
            </div>

            <div class="inflation-toggle">
               <label class="switch">
                  <input type="checkbox" id="sip-inflation" onchange="window.AppCalculators.category_2.sip_calc.calculate()">
                  <span class="slider round"></span>
               </label>
               <span>Adjust for Inflation (6%)</span>
            </div>

            <button class="calc-btn-lg sip-btn" onclick="window.AppCalculators.category_2.sip_calc.calculate()">
              Calculate <i class="fas fa-rocket"></i>
            </button>

          </div>

          <div class="sip-results" id="sip-result-area" style="display:none;">
            
            <div class="sip-summary-card">
              <span id="sip-res-label">Expected Maturity Value</span>
              <h1 id="sip-res-val">$0</h1>
              <p id="sip-res-sub" class="res-sub-text"></p>
            </div>

            <div class="sip-stat-grid">
              <div class="sip-stat">
                <small>Invested Amount</small>
                <strong id="stat-invested">$0</strong>
              </div>
              <div class="sip-stat">
                <small>Est. Returns</small>
                <strong id="stat-returns" style="color:#2ecc71;">$0</strong>
              </div>
            </div>

            <div class="viz-container">
              <div class="pie-container">
                <div class="sip-pie" id="sip-pie-chart"></div>
                <div class="pie-legend-row">
                    <div><span class="dot-lg p-inv"></span> Invested</div>
                    <div><span class="dot-lg p-ret"></span> Returns</div>
                </div>
              </div>
            </div>

            <div class="graph-box">
                <h4>Wealth Growth Over Time</h4>
                <svg id="sip-growth-chart" viewBox="0 0 300 150" preserveAspectRatio="none"></svg>
                <div class="graph-labels">
                    <span>Year 0</span>
                    <span id="graph-end-year">Year 10</span>
                </div>
            </div>
            
            <button class="table-toggle-btn" onclick="window.AppCalculators.category_2.sip_calc.toggleTable()">
                View Annual Breakdown <i class="fas fa-chevron-down"></i>
            </button>

          </div>
        </div>

        <div id="sip-table-wrapper" class="sip-table-box">
            <table class="sip-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Invested</th>
                        <th>Wealth Value</th>
                        <th>Growth</th>
                    </tr>
                </thead>
                <tbody id="sip-table-body"></tbody>
            </table>
        </div>

      </div>
    `;
  },

  currentMode: 'std', // std, step, target

  switchMode: function(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.sip-mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sip-result-area').style.display = 'none';
    document.getElementById('sip-table-wrapper').style.display = 'none';
    
    // Reset Visibility
    document.getElementById('card-step').style.display = 'none';
    document.getElementById('card-target').style.display = 'none';
    document.getElementById('card-amount').style.display = 'block';

    if (mode === 'std') {
        document.getElementById('mode-std').classList.add('active');
        document.getElementById('lbl-amount').innerText = "Monthly Investment";
    } 
    else if (mode === 'step') {
        document.getElementById('mode-step').classList.add('active');
        document.getElementById('card-step').style.display = 'block';
        document.getElementById('lbl-amount').innerText = "Starting Investment";
    }
    else if (mode === 'target') {
        document.getElementById('mode-target').classList.add('active');
        document.getElementById('card-amount').style.display = 'none';
        document.getElementById('card-target').style.display = 'block';
    }
    this.calculate();
  },

  syncSlider: function(inputId, rangeId) {
    const val = document.getElementById(inputId).value;
    document.getElementById(rangeId).value = val;
    this.updateSliderFill(rangeId);
  },

  syncInput: function(inputId, rangeId) {
    const val = document.getElementById(rangeId).value;
    document.getElementById(inputId).value = val;
    this.updateSliderFill(rangeId);
  },

  updateSliderFill: function(rangeId) {
    const range = document.getElementById(rangeId);
    const percentage = ((range.value - range.min) / (range.max - range.min)) * 100;
    range.style.background = `linear-gradient(90deg, #6c5ce7 ${percentage}%, #dfe6e9 ${percentage}%)`;
  },

  formatMoney: function(num) {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  },

  toggleTable: function() {
    const el = document.getElementById('sip-table-wrapper');
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
    if(el.style.display === 'block') el.scrollIntoView({behavior: 'smooth'});
  },

  calculate: function() {
    const rate = parseFloat(document.getElementById('sip-rate').value);
    const years = parseFloat(document.getElementById('sip-years').value);
    const inflation = document.getElementById('sip-inflation').checked;
    
    if(!rate || !years) return;

    // Effective Rate Calculation
    // If inflation is checked, we adjust the rate: (1+r)/(1+i) - 1. Assuming 6% inflation.
    let r_eff = rate;
    if(inflation) {
        r_eff = ((1 + rate/100) / (1 + 0.06) - 1) * 100;
    }

    const monthlyRate = r_eff / 100 / 12;
    const months = years * 12;

    let totalInvested = 0;
    let currentValue = 0;
    let monthlyInv = 0;
    let yearlyData = [];

    // --- Mode 1: Standard SIP ---
    if(this.currentMode === 'std') {
        monthlyInv = parseFloat(document.getElementById('sip-amount').value);
        
        // Iterative calculation for graph data
        for(let m=1; m<=months; m++) {
            currentValue = (currentValue + monthlyInv) * (1 + monthlyRate);
            totalInvested += monthlyInv;
            
            if(m % 12 === 0 || m === months) {
                yearlyData.push({
                    year: Math.ceil(m/12), 
                    inv: totalInvested, 
                    val: currentValue
                });
            }
        }
        this.displayResults(currentValue, totalInvested, yearlyData, "Expected Maturity Value");
    }

    // --- Mode 2: Step-Up SIP ---
    else if(this.currentMode === 'step') {
        monthlyInv = parseFloat(document.getElementById('sip-amount').value);
        const stepPct = parseFloat(document.getElementById('sip-step-pct').value) || 0;
        
        let currentMonthly = monthlyInv;

        for(let m=1; m<=months; m++) {
            // Apply Step Up every 12 months (start of new year)
            if(m > 1 && (m-1) % 12 === 0) {
                currentMonthly = currentMonthly * (1 + stepPct/100);
            }
            
            currentValue = (currentValue + currentMonthly) * (1 + monthlyRate);
            totalInvested += currentMonthly;

            if(m % 12 === 0 || m === months) {
                yearlyData.push({
                    year: Math.ceil(m/12), 
                    inv: totalInvested, 
                    val: currentValue
                });
            }
        }
        this.displayResults(currentValue, totalInvested, yearlyData, "Expected Maturity Value");
    }

    // --- Mode 3: Target Goal (Reverse) ---
    else if(this.currentMode === 'target') {
        const target = parseFloat(document.getElementById('sip-target-val').value);
        
        // Formula: P = M / ( [ (1+i)^n - 1 ] / i * (1+i) )
        // Using standard formula for simplicity in reverse mode
        const factor = ( (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate ) * (1 + monthlyRate);
        const requiredMonthly = target / factor;
        
        // Now generate data forward to verify and graph
        monthlyInv = requiredMonthly;
        for(let m=1; m<=months; m++) {
            currentValue = (currentValue + monthlyInv) * (1 + monthlyRate);
            totalInvested += monthlyInv;
            if(m % 12 === 0 || m === months) {
                yearlyData.push({
                    year: Math.ceil(m/12), 
                    inv: totalInvested, 
                    val: currentValue
                });
            }
        }
        
        this.displayResults(requiredMonthly, totalInvested, yearlyData, "Monthly SIP Needed", true);
    }
  },

  displayResults: function(mainMetric, invested, data, label, isReverse=false) {
    const resArea = document.getElementById('sip-result-area');
    resArea.style.display = 'block';

    if(isReverse) {
        // Main metric is monthly investment
        document.getElementById('sip-res-val').innerText = this.formatMoney(mainMetric);
        document.getElementById('sip-res-sub').innerText = `To reach ${this.formatMoney(data[data.length-1].val)} in ${data.length} years`;
        
        document.getElementById('stat-invested').innerText = this.formatMoney(invested);
        document.getElementById('stat-returns').innerText = this.formatMoney(data[data.length-1].val - invested);
    } else {
        // Main metric is Maturity Value
        document.getElementById('sip-res-val').innerText = this.formatMoney(mainMetric);
        document.getElementById('sip-res-sub').innerText = `Total Gain: ${this.formatMoney(mainMetric - invested)}`;

        document.getElementById('stat-invested').innerText = this.formatMoney(invested);
        document.getElementById('stat-returns').innerText = this.formatMoney(mainMetric - invested);
    }
    
    document.getElementById('sip-res-label').innerText = label;

    // Charts
    const finalVal = data[data.length-1].val;
    const finalInv = data[data.length-1].inv;
    
    // Pie Chart CSS
    const invPct = (finalInv / finalVal) * 100;
    // Handle edge case where value < invested (negative returns or high inflation)
    const safeInvPct = invPct > 100 ? 100 : (invPct < 0 ? 0 : invPct);
    
    document.getElementById('sip-pie-chart').style.background = `conic-gradient(#a29bfe 0% ${safeInvPct}%, #2ecc71 ${safeInvPct}% 100%)`;

    // SVG Line Chart
    this.drawGraph(data);

    // Table
    this.renderTable(data);
  },

  drawGraph: function(data) {
    const svg = document.getElementById('sip-growth-chart');
    const w = 300;
    const h = 150;
    const pad = 10;
    
    // Scales
    const maxY = data[data.length-1].val;
    const maxX = data.length; // number of years
    
    const getX = (i) => (i / (maxX-1)) * (w - pad); // i is index
    const getY = (val) => h - ((val / maxY) * (h - pad)); // Invert Y

    // Build Path for Wealth Line (Green Area)
    let pathD = `M 0 ${h} `;
    data.forEach((d, i) => {
        pathD += `L ${getX(i)} ${getY(d.val)} `;
    });
    // Close area for fill
    let areaD = pathD + `L ${getX(data.length-1)} ${h} Z`;

    // Build Path for Invested Line (Dashed)
    let invPathD = `M 0 ${h} `;
    data.forEach((d, i) => {
        invPathD += `L ${getX(i)} ${getY(d.inv)} `;
    });

    svg.innerHTML = `
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#2ecc71;stop-opacity:0.6" />
                <stop offset="100%" style="stop-color:#2ecc71;stop-opacity:0.1" />
            </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#grad1)" />
        
        <path d="${pathD}" fill="none" stroke="#2ecc71" stroke-width="3" />
        
        <path d="${invPathD}" fill="none" stroke="#a29bfe" stroke-width="2" stroke-dasharray="4" />
    `;
    
    document.getElementById('graph-end-year').innerText = `Year ${data[data.length-1].year}`;
  },

  renderTable: function(data) {
    const tbody = document.getElementById('sip-table-body');
    tbody.innerHTML = data.map(row => `
        <tr>
            <td>${row.year}</td>
            <td>${this.formatMoney(row.inv)}</td>
            <td><strong>${this.formatMoney(row.val)}</strong></td>
            <td style="color:#2ecc71;">+${this.formatMoney(row.val - row.inv)}</td>
        </tr>
    `).join('');
  }
};