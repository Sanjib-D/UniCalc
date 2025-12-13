if (!window.AppCalculators.category_2) window.AppCalculators.category_2 = {};

window.AppCalculators.category_2.interest_calc = {
  name: "Simple & Compound Interest",

  init: function() {
    this.syncSlider('int-princ', 'int-princ-range');
    this.syncSlider('int-rate', 'int-rate-range');
    this.syncSlider('int-time', 'int-time-range');
    this.calculate();
  },

  getHtml: function() {
    return `
      <div class="int-calc-wrapper">
        
        <div class="int-type-switch">
          <button class="int-mode-btn active" id="mode-simple" onclick="window.AppCalculators.category_2.interest_calc.setMode('simple')">
            Simple Interest
          </button>
          <button class="int-mode-btn" id="mode-compound" onclick="window.AppCalculators.category_2.interest_calc.setMode('compound')">
            Compound Interest
          </button>
          <button class="int-mode-btn" id="mode-compare" onclick="window.AppCalculators.category_2.interest_calc.setMode('compare')">
            Compare Both
          </button>
        </div>

        <div class="int-grid">
          
          <div class="int-inputs">
            
            <div class="input-card">
              <div class="input-header">
                <label>Principal Amount</label>
                <div class="input-val-wrapper">
                  <span class="currency-symbol">$</span>
                  <input type="number" id="int-princ" value="10000" oninput="window.AppCalculators.category_2.interest_calc.syncSlider('int-princ', 'int-princ-range')">
                </div>
              </div>
              <input type="range" id="int-princ-range" min="1000" max="1000000" step="1000" value="10000" class="styled-slider" oninput="window.AppCalculators.category_2.interest_calc.syncInput('int-princ', 'int-princ-range')">
            </div>

            <div class="input-card">
              <div class="input-header">
                <label>Interest Rate (p.a)</label>
                <div class="input-val-wrapper">
                  <input type="number" id="int-rate" value="5" step="0.1" oninput="window.AppCalculators.category_2.interest_calc.syncSlider('int-rate', 'int-rate-range')">
                  <span class="unit-symbol">%</span>
                </div>
              </div>
              <input type="range" id="int-rate-range" min="1" max="50" step="0.1" value="5" class="styled-slider" oninput="window.AppCalculators.category_2.interest_calc.syncInput('int-rate', 'int-rate-range')">
            </div>

            <div class="input-card">
              <div class="input-header">
                <label>Time Period</label>
                <div class="int-time-select">
                    <div class="input-val-wrapper small">
                        <input type="number" id="int-time" value="5" oninput="window.AppCalculators.category_2.interest_calc.syncSlider('int-time', 'int-time-range')">
                    </div>
                    <select id="int-time-unit" onchange="window.AppCalculators.category_2.interest_calc.calculate()">
                        <option value="years">Years</option>
                        <option value="months">Months</option>
                    </select>
                </div>
              </div>
              <input type="range" id="int-time-range" min="1" max="50" step="1" value="5" class="styled-slider" oninput="window.AppCalculators.category_2.interest_calc.syncInput('int-time', 'int-time-range')">
            </div>

            <div class="input-card" id="compound-options" style="display:none; border-left: 4px solid var(--primary);">
              <label style="margin-bottom:10px; display:block;">Compounding Frequency</label>
              <select id="int-freq" class="full-select" onchange="window.AppCalculators.category_2.interest_calc.calculate()">
                <option value="1">Annually (Once/Year)</option>
                <option value="2">Semi-Annually (Twice/Year)</option>
                <option value="4">Quarterly (4 times/Year)</option>
                <option value="12">Monthly (12 times/Year)</option>
                <option value="365">Daily (365 times/Year)</option>
              </select>
            </div>

            <button class="calc-btn-lg int-btn" onclick="window.AppCalculators.category_2.interest_calc.calculate()">
              Calculate
            </button>
          </div>

          <div class="int-results">
            
            <div class="int-summary-card">
                <span id="int-res-label">Total Amount Payable</span>
                <h1 id="int-res-val">$0</h1>
                <p id="int-res-sub">Interest Earned: <span class="highlight-green">$0</span></p>
            </div>

            <div id="compare-stats" style="display:none;" class="compare-box">
                <div class="cmp-row">
                    <span>Simple:</span> <strong id="cmp-simple">$0</strong>
                </div>
                <div class="cmp-row">
                    <span>Compound:</span> <strong id="cmp-compound">$0</strong>
                </div>
                <div class="cmp-diff">
                    Difference: <span id="cmp-diff-val">$0</span>
                </div>
            </div>

            <div class="chart-container">
                <div id="pie-view" class="pie-wrapper">
                    <div class="pie-chart" id="int-pie"></div>
                    <div class="pie-legend">
                        <div><span class="dot p"></span> Principal</div>
                        <div><span class="dot i"></span> Interest</div>
                    </div>
                </div>
                
                <div id="graph-view" class="graph-box">
                    <h4>Growth Over Time</h4>
                    <svg id="int-growth-chart" viewBox="0 0 300 150" preserveAspectRatio="none"></svg>
                </div>
            </div>

            <button class="schedule-btn-outline" onclick="window.AppCalculators.category_2.interest_calc.toggleTable()">
                View Yearly Breakdown
            </button>

          </div>
        </div>

        <div id="int-table-wrapper" class="int-table-box">
            <table class="int-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Opening Bal.</th>
                        <th>Interest</th>
                        <th>Closing Bal.</th>
                    </tr>
                </thead>
                <tbody id="int-table-body"></tbody>
            </table>
        </div>

      </div>
    `;
  },

  currentMode: 'simple',

  setMode: function(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.int-mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`mode-${mode}`).classList.add('active');

    const freqBox = document.getElementById('compound-options');
    const pieView = document.getElementById('pie-view');
    const graphView = document.getElementById('graph-view');
    const compareStats = document.getElementById('compare-stats');
    const mainSummary = document.querySelector('.int-summary-card');

    // UI Toggle Logic
    if (mode === 'simple') {
        freqBox.style.display = 'none';
        pieView.style.display = 'flex';
        graphView.style.display = 'block';
        compareStats.style.display = 'none';
        mainSummary.style.display = 'block';
    } else if (mode === 'compound') {
        freqBox.style.display = 'block';
        pieView.style.display = 'flex';
        graphView.style.display = 'block';
        compareStats.style.display = 'none';
        mainSummary.style.display = 'block';
    } else {
        // Compare Mode
        freqBox.style.display = 'block'; // Show freq for compound part
        pieView.style.display = 'none';
        graphView.style.display = 'block';
        compareStats.style.display = 'block';
        mainSummary.style.display = 'none';
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
    range.style.background = `linear-gradient(90deg, var(--primary) ${percentage}%, #e9ecef ${percentage}%)`;
  },

  toggleTable: function() {
    const el = document.getElementById('int-table-wrapper');
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
    if(el.style.display === 'block') el.scrollIntoView({behavior: 'smooth'});
  },

  formatMoney: function(num) {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  },

  calculate: function() {
    const P = parseFloat(document.getElementById('int-princ').value) || 0;
    const R = parseFloat(document.getElementById('int-rate').value) || 0;
    const timeVal = parseFloat(document.getElementById('int-time').value) || 0;
    const timeUnit = document.getElementById('int-time-unit').value;
    const freq = parseFloat(document.getElementById('int-freq').value) || 1;

    let T = timeUnit === 'months' ? timeVal / 12 : timeVal;
    if (T < 0) return;

    // --- Calculations ---

    // Simple Interest: A = P(1 + RT)
    const siTotal = P * (1 + (R/100) * T);
    const siInterest = siTotal - P;

    // Compound Interest: A = P(1 + R/n)^(nT)
    const n = freq; // times per year
    const ciTotal = P * Math.pow((1 + (R/100)/n), (n * T));
    const ciInterest = ciTotal - P;

    // --- Render Results ---

    if (this.currentMode === 'simple') {
        this.updateSummary(siTotal, siInterest);
        this.renderPie(P, siInterest);
        this.renderGraph([{label: 'Simple', data: this.generatePoints('simple', P, R, T)}]);
        this.renderTable('simple', P, R, T);
    } 
    else if (this.currentMode === 'compound') {
        this.updateSummary(ciTotal, ciInterest);
        this.renderPie(P, ciInterest);
        this.renderGraph([{label: 'Compound', data: this.generatePoints('compound', P, R, T, n)}]);
        this.renderTable('compound', P, R, T, n);
    } 
    else {
        // Compare Mode
        document.getElementById('cmp-simple').innerText = this.formatMoney(siTotal);
        document.getElementById('cmp-compound').innerText = this.formatMoney(ciTotal);
        document.getElementById('cmp-diff-val').innerText = this.formatMoney(ciTotal - siTotal);
        
        this.renderGraph([
            {label: 'Simple', data: this.generatePoints('simple', P, R, T)},
            {label: 'Compound', data: this.generatePoints('compound', P, R, T, n)}
        ]);
        this.renderTable('compound', P, R, T, n); // Show compound table by default in compare
    }
  },

  updateSummary: function(total, interest) {
    document.getElementById('int-res-val').innerText = this.formatMoney(total);
    document.getElementById('int-res-sub').innerHTML = `Interest Earned: <span class="highlight-green">${this.formatMoney(interest)}</span>`;
  },

  renderPie: function(p, i) {
    const total = p + i;
    const pPct = (p / total) * 100;
    document.getElementById('int-pie').style.background = `conic-gradient(var(--primary) 0% ${pPct}%, #20c997 ${pPct}% 100%)`;
  },

  generatePoints: function(type, P, R, T, n=1) {
    let points = [];
    const steps = 10; 
    for(let i=0; i<=steps; i++) {
        let t = (T / steps) * i;
        let val = 0;
        if(type === 'simple') val = P * (1 + (R/100) * t);
        else val = P * Math.pow((1 + (R/100)/n), (n * t));
        points.push(val);
    }
    return points;
  },

  renderGraph: function(datasets) {
    const svg = document.getElementById('int-growth-chart');
    const w = 300, h = 150, pad = 10;
    
    // Find Max Y to scale
    let maxVal = 0;
    datasets.forEach(ds => {
        const m = Math.max(...ds.data);
        if(m > maxVal) maxVal = m;
    });

    const getX = (i) => (i / 10) * w;
    const getY = (v) => h - ((v / maxVal) * (h - pad));

    let html = '';
    
    datasets.forEach((ds, idx) => {
        let d = `M 0 ${getY(ds.data[0])} `;
        ds.data.forEach((val, i) => {
            d += `L ${getX(i)} ${getY(val)} `;
        });

        // Color logic
        const color = ds.label === 'Simple' ? '#20c997' : '#007bff';
        const dash = ds.label === 'Simple' && datasets.length > 1 ? 'stroke-dasharray="5,5"' : '';

        html += `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" ${dash} />`;
    });

    svg.innerHTML = html;
  },

  renderTable: function(type, P, R, T, n=1) {
    const tbody = document.getElementById('int-table-body');
    let html = '';
    
    // We render yearly breakdowns
    let currentP = P;
    const years = Math.ceil(T);

    for(let i=1; i<=years; i++) {
        let interest = 0;
        let closeBal = 0;

        if(type === 'simple') {
            interest = P * (R/100); // Fixed per year
            closeBal = P + (interest * i);
            // Opening bal conceptually stays P for calculation, but visually accumulates
            // Actually simple interest table usually shows accumulated interest
            // Let's show: Year | Principal | Interest Earned | Total Amount
            // Adjusting logic for display consistency
            currentP = P + (interest * (i-1)); 
            closeBal = P + (interest * i);
        } else {
            // Compound
            const prevBal = P * Math.pow((1 + (R/100)/n), (n * (i-1)));
            closeBal = P * Math.pow((1 + (R/100)/n), (n * i));
            interest = closeBal - prevBal;
            currentP = prevBal;
        }

        html += `
            <tr>
                <td>Year ${i}</td>
                <td>${this.formatMoney(currentP)}</td>
                <td style="color:#20c997">+${this.formatMoney(interest)}</td>
                <td><strong>${this.formatMoney(closeBal)}</strong></td>
            </tr>
        `;
    }
    tbody.innerHTML = html;
  }
};