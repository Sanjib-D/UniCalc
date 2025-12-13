if (!window.AppCalculators.category_2) window.AppCalculators.category_2 = {};

window.AppCalculators.category_2.inflation_calc = {
  name: "Inflation Calculator",

  init: function() {
    this.syncSlider('inf-amount', 'range-inf-amount');
    this.syncSlider('inf-rate', 'range-inf-rate');
    this.setYears();
    this.calculate();
  },

  getHtml: function() {
    return `
      <div class="inf-calc-wrapper">
        
        <div class="inf-mode-switch">
          <button class="inf-mode-btn active" id="mode-future" onclick="window.AppCalculators.category_2.inflation_calc.switchMode('future')">
            <i class="fas fa-forward"></i> Future Projection
          </button>
          <button class="inf-mode-btn" id="mode-past" onclick="window.AppCalculators.category_2.inflation_calc.switchMode('past')">
            <i class="fas fa-history"></i> Historical Impact
          </button>
        </div>

        <div class="inf-grid">
          
          <div class="inf-inputs">
            
            <div class="inf-card">
              <div class="inf-card-header">
                <span id="label-amount-title">Current Amount</span>
              </div>
              <div class="inf-card-body">
                <div class="amount-wrapper">
                    <span class="curr-symbol">$</span>
                    <input type="number" id="inf-amount" value="1000" oninput="window.AppCalculators.category_2.inflation_calc.syncSlider('inf-amount', 'range-inf-amount')">
                </div>
                <input type="range" id="range-inf-amount" min="100" max="100000" step="100" value="1000" class="styled-slider mt-2" oninput="window.AppCalculators.category_2.inflation_calc.syncInput('inf-amount', 'range-inf-amount')">
              </div>
            </div>

            <div class="inf-card">
              <div class="inf-card-header">Time Period</div>
              <div class="inf-card-body">
                <div class="year-row">
                    <div class="year-group">
                        <label>Start Year</label>
                        <input type="number" id="inf-start-year" class="year-input" oninput="window.AppCalculators.category_2.inflation_calc.calculate()">
                    </div>
                    <div class="year-arrow"><i class="fas fa-arrow-right"></i></div>
                    <div class="year-group">
                        <label>End Year</label>
                        <input type="number" id="inf-end-year" class="year-input" oninput="window.AppCalculators.category_2.inflation_calc.calculate()">
                    </div>
                </div>
                <div class="year-diff-badge" id="val-year-diff">10 Years</div>
              </div>
            </div>

            <div class="inf-card">
              <div class="inf-card-header">
                <span>Average Inflation Rate (%)</span>
                <i class="fas fa-info-circle info-icon" title="Average annual rate of price increase"></i>
              </div>
              <div class="inf-card-body">
                <div class="rate-input-row">
                    <input type="number" id="inf-rate" value="3.5" step="0.1" oninput="window.AppCalculators.category_2.inflation_calc.syncSlider('inf-rate', 'range-inf-rate')">
                    <div class="rate-presets">
                        <span onclick="window.AppCalculators.category_2.inflation_calc.setRate(2)">Low (2%)</span>
                        <span onclick="window.AppCalculators.category_2.inflation_calc.setRate(3.5)">Avg (3.5%)</span>
                        <span onclick="window.AppCalculators.category_2.inflation_calc.setRate(8)">High (8%)</span>
                    </div>
                </div>
                <input type="range" id="range-inf-rate" min="0" max="20" step="0.1" value="3.5" class="styled-slider mt-2" oninput="window.AppCalculators.category_2.inflation_calc.syncInput('inf-rate', 'range-inf-rate')">
              </div>
            </div>

            <button class="calc-btn-lg inf-btn" onclick="window.AppCalculators.category_2.inflation_calc.calculate()">
                Calculate Value
            </button>

          </div>

          <div class="inf-results">
            
            <div class="inf-result-box">
                <span id="res-label-main">Future Equivalent Value</span>
                <h1 id="res-val-main">$0</h1>
                <div class="inf-impact-text" id="res-impact-text">
                    That means prices will rise by <b>41%</b>.
                </div>
            </div>

            <div class="inf-visual-card">
                <h4>Purchasing Power Erosion</h4>
                <div class="erosion-container">
                    <div class="money-stack" id="visual-stack-start" style="height: 100%;">
                        <div class="stack-label">Start</div>
                    </div>
                    <div class="erosion-arrow"><i class="fas fa-angle-double-right"></i></div>
                    <div class="money-stack withered" id="visual-stack-end" style="height: 70%;">
                        <div class="stack-label">End</div>
                    </div>
                </div>
                <p id="power-text">Your money loses 30% of its value.</p>
            </div>

            <div class="inf-chart-container">
                <h4>Value Trend</h4>
                <svg id="inf-trend-chart" viewBox="0 0 300 120" preserveAspectRatio="none"></svg>
            </div>

            <button class="schedule-btn-outline" onclick="window.AppCalculators.category_2.inflation_calc.toggleTable()">
                View Year-by-Year Breakdown
            </button>

          </div>
        </div>

        <div id="inf-table-wrapper" class="inf-table-box">
            <table class="inf-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Inflation Rate</th>
                        <th>Equivalent Value</th>
                        <th>Cumulative Change</th>
                    </tr>
                </thead>
                <tbody id="inf-table-body"></tbody>
            </table>
        </div>

      </div>
    `;
  },

  mode: 'future',

  setYears: function() {
    const currentYear = new Date().getFullYear();
    document.getElementById('inf-start-year').value = currentYear;
    document.getElementById('inf-end-year').value = currentYear + 10;
  },

  switchMode: function(mode) {
    this.mode = mode;
    document.querySelectorAll('.inf-mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`mode-${mode}`).classList.add('active');
    
    const currentYear = new Date().getFullYear();
    const startInput = document.getElementById('inf-start-year');
    const endInput = document.getElementById('inf-end-year');
    const titleLabel = document.getElementById('label-amount-title');
    const resLabel = document.getElementById('res-label-main');

    if (mode === 'future') {
        startInput.value = currentYear;
        endInput.value = currentYear + 10;
        titleLabel.innerText = "Current Amount";
        resLabel.innerText = "Future Equivalent Cost";
    } else {
        startInput.value = 1990;
        endInput.value = currentYear;
        titleLabel.innerText = "Past Amount";
        resLabel.innerText = "Today's Equivalent Value";
    }
    this.calculate();
  },

  setRate: function(val) {
    document.getElementById('inf-rate').value = val;
    document.getElementById('range-inf-rate').value = val;
    this.updateSliderFill('range-inf-rate');
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
    range.style.background = `linear-gradient(90deg, #e17055 ${percentage}%, #e9ecef ${percentage}%)`;
  },

  toggleTable: function() {
    const el = document.getElementById('inf-table-wrapper');
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
    if(el.style.display === 'block') el.scrollIntoView({behavior: 'smooth'});
  },

  formatMoney: function(num) {
    return "$" + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  },

  calculate: function() {
    const amount = parseFloat(document.getElementById('inf-amount').value) || 0;
    const rate = parseFloat(document.getElementById('inf-rate').value) || 0;
    const startYear = parseInt(document.getElementById('inf-start-year').value) || 0;
    const endYear = parseInt(document.getElementById('inf-end-year').value) || 0;

    let years = endYear - startYear;
    if (years < 0) years = 0; // Simple validation

    document.getElementById('val-year-diff').innerText = `${years} Years`;

    // Formula: Future Value = PV * (1 + r)^n
    const multiplier = Math.pow(1 + (rate / 100), years);
    const finalValue = amount * multiplier;
    
    // Purchasing Power (Reverse): How much is the Start Amount worth in End Year terms?
    // Actually, purchasing power of $1 drops.
    // Power = 1 / (1+r)^n
    const powerRetention = 1 / multiplier;
    const erodedValue = amount * powerRetention;

    // --- Results Update ---
    
    document.getElementById('res-val-main').innerText = this.formatMoney(Math.round(finalValue));
    
    const pctChange = ((finalValue - amount) / amount) * 100;
    document.getElementById('res-impact-text').innerHTML = 
        `Cumulative Inflation: <b>${pctChange.toFixed(1)}%</b>`;

    // Visual Stack Logic (Erosion)
    // If Mode Future: "What cost $1000 today will cost $X".
    // Power Text: "$1000 today will only buy $Y worth of goods".
    
    const visualEndHeight = Math.max(10, (erodedValue / amount) * 100);
    document.getElementById('visual-stack-end').style.height = `${visualEndHeight}%`;
    
    document.getElementById('power-text').innerHTML = 
        `<b>${this.formatMoney(amount)}</b> in ${endYear} will have the purchasing power of only <b>${this.formatMoney(Math.round(erodedValue))}</b> today.`;

    // Generate Graph Data
    this.generateChartData(amount, rate, years, startYear);
  },

  generateChartData: function(amount, rate, years, startYear) {
    let data = [];
    let currentVal = amount;
    
    for(let i = 0; i <= years; i++) {
        data.push({
            year: startYear + i,
            val: currentVal,
            pct: ((currentVal - amount)/amount)*100
        });
        currentVal = currentVal * (1 + (rate/100));
    }

    this.drawChart(data);
    this.renderTable(data, rate);
  },

  drawChart: function(data) {
    const svg = document.getElementById('inf-trend-chart');
    const w = 300, h = 120, pad = 10;
    
    const maxVal = data[data.length-1].val;
    const minVal = data[0].val; // usually amount
    
    // Y Scale needs to accommodate 0 to maxVal
    const getX = (i) => (i / (data.length - 1)) * (w - 2*pad) + pad;
    const getY = (val) => h - pad - ((val - minVal) / (maxVal - minVal)) * (h - 2*pad); // Normalized to fit view

    let d = `M ${pad} ${h-pad} `; // Start bottom left
    if(data.length > 1) {
        d = `M ${getX(0)} ${getY(data[0].val)} `;
        for(let i=1; i<data.length; i++) {
            d += `L ${getX(i)} ${getY(data[i].val)} `;
        }
    }

    // Fill area
    let fillD = d + `L ${w-pad} ${h-pad} L ${pad} ${h-pad} Z`;

    svg.innerHTML = `
        <defs>
            <linearGradient id="gradInf" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#e17055;stop-opacity:0.6" />
                <stop offset="100%" style="stop-color:#e17055;stop-opacity:0.0" />
            </linearGradient>
        </defs>
        <path d="${fillD}" fill="url(#gradInf)" />
        <path d="${d}" fill="none" stroke="#e17055" stroke-width="3" stroke-linecap="round" />
    `;
  },

  renderTable: function(data, rate) {
    const tbody = document.getElementById('inf-table-body');
    // Limit rows if > 50 years to prevent lag, show every 5th year maybe?
    // For now simple map
    
    tbody.innerHTML = data.map(row => `
        <tr>
            <td>${row.year}</td>
            <td>${rate}%</td>
            <td><strong>${this.formatMoney(Math.round(row.val))}</strong></td>
            <td style="color:#e17055">+${row.pct.toFixed(1)}%</td>
        </tr>
    `).join('');
  }
};