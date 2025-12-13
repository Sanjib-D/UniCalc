if (!window.AppCalculators.category_2) window.AppCalculators.category_2 = {};

window.AppCalculators.category_2.loan_calc = {
  name: "Loan / EMI Calculator",
  
  // Default values for different loan types
  defaults: {
    home: { rate: 8.5, tenure: 20, maxTenure: 30 },
    car: { rate: 9.0, tenure: 5, maxTenure: 7 },
    personal: { rate: 11.0, tenure: 3, maxTenure: 5 },
    edu: { rate: 10.5, tenure: 7, maxTenure: 15 },
    business: { rate: 12.0, tenure: 5, maxTenure: 10 }
  },

  getHtml: function () {
    return `
      <div class="loan-calc-wrapper">
        <div class="loan-type-pills">
          <button class="type-pill active" onclick="window.AppCalculators.category_2.loan_calc.setDefaults('home', this)"><i class="fas fa-home"></i> Home</button>
          <button class="type-pill" onclick="window.AppCalculators.category_2.loan_calc.setDefaults('car', this)"><i class="fas fa-car"></i> Car</button>
          <button class="type-pill" onclick="window.AppCalculators.category_2.loan_calc.setDefaults('personal', this)"><i class="fas fa-user"></i> Personal</button>
          <button class="type-pill" onclick="window.AppCalculators.category_2.loan_calc.setDefaults('edu', this)"><i class="fas fa-graduation-cap"></i> Education</button>
        </div>

        <div class="calc-mode-switch">
          <button class="mode-btn active" id="mode-emi" onclick="window.AppCalculators.category_2.loan_calc.switchMode('emi')">Calculate EMI</button>
          <button class="mode-btn" id="mode-amount" onclick="window.AppCalculators.category_2.loan_calc.switchMode('amount')">Check Eligibility (Reverse)</button>
        </div>

        <div class="loan-grid">
          <div class="loan-inputs">
            
            <div class="input-card" id="input-amount-group">
              <div class="input-header">
                <label>Loan Amount</label>
                <div class="input-val-wrapper">
                  <span class="currency-symbol">$</span>
                  <input type="number" id="loan-amount" value="500000" oninput="window.AppCalculators.category_2.loan_calc.syncSlider('loan-amount', 'loan-amount-range')">
                </div>
              </div>
              <input type="range" id="loan-amount-range" min="10000" max="10000000" step="5000" value="500000" class="styled-slider" oninput="window.AppCalculators.category_2.loan_calc.syncInput('loan-amount', 'loan-amount-range')">
              <div class="range-labels">
                <span>10k</span>
                <span>10M</span>
              </div>
            </div>

            <div class="input-card" id="input-target-emi-group" style="display:none;">
              <div class="input-header">
                <label>Affordable Monthly EMI</label>
                <div class="input-val-wrapper">
                  <span class="currency-symbol">$</span>
                  <input type="number" id="target-emi" value="5000">
                </div>
              </div>
              <small style="color:#666;">How much can you pay monthly?</small>
            </div>

            <div class="input-card">
              <div class="input-header">
                <label>Interest Rate (p.a)</label>
                <div class="input-val-wrapper">
                  <input type="number" id="interest-rate" value="8.5" step="0.1" oninput="window.AppCalculators.category_2.loan_calc.syncSlider('interest-rate', 'interest-rate-range')">
                  <span class="unit-symbol">%</span>
                </div>
              </div>
              <input type="range" id="interest-rate-range" min="1" max="30" step="0.1" value="8.5" class="styled-slider" oninput="window.AppCalculators.category_2.loan_calc.syncInput('interest-rate', 'interest-rate-range')">
            </div>

            <div class="input-card">
              <div class="input-header">
                <label>Loan Tenure</label>
                <div class="tenure-toggle">
                  <div class="input-val-wrapper small">
                    <input type="number" id="loan-tenure" value="20" oninput="window.AppCalculators.category_2.loan_calc.syncSlider('loan-tenure', 'loan-tenure-range')">
                  </div>
                  <select id="tenure-unit" onchange="window.AppCalculators.category_2.loan_calc.updateTenureSlider()">
                    <option value="years" selected>Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
              <input type="range" id="loan-tenure-range" min="1" max="30" step="1" value="20" class="styled-slider" oninput="window.AppCalculators.category_2.loan_calc.syncInput('loan-tenure', 'loan-tenure-range')">
            </div>

            <div class="advanced-toggle" onclick="document.getElementById('adv-options').classList.toggle('show')">
              <span><i class="fas fa-cog"></i> Extra Payments & Fees</span>
              <i class="fas fa-chevron-down"></i>
            </div>

            <div id="adv-options" class="advanced-section">
              <div class="form-group">
                <label>Processing Fee (% of Loan)</label>
                <input type="number" id="proc-fee" value="0" step="0.1" placeholder="0">
              </div>
              <div class="form-group">
                <label>Extra Monthly Payment (Prepayment)</label>
                <input type="number" id="extra-emi" value="0" placeholder="0">
              </div>
            </div>

            <button class="calc-btn-lg" onclick="window.AppCalculators.category_2.loan_calc.calculate()">
              Calculate <i class="fas fa-calculator"></i>
            </button>
          </div>

          <div class="loan-results" id="loan-result-area" style="display:none;">
            <div class="emi-display-card">
              <span id="result-label">Monthly EMI</span>
              <h2 id="disp-emi">0</h2>
              <p id="disp-msg" style="display:none; color:#28a745; font-size:0.9rem; margin-top:5px;"></p>
            </div>

            <div class="summary-grid">
              <div class="sum-item">
                <small>Principal Amount</small>
                <span id="disp-principal">0</span>
              </div>
              <div class="sum-item">
                <small>Total Interest</small>
                <span id="disp-interest" class="text-danger">0</span>
              </div>
              <div class="sum-item">
                <small>Total Payable</small>
                <span id="disp-total">0</span>
              </div>
            </div>

            <div class="chart-container">
              <div class="pie-wrapper">
                <div class="pie-chart" id="loan-pie"></div>
                <div class="pie-legend">
                  <div><span class="dot p"></span> Principal</div>
                  <div><span class="dot i"></span> Interest</div>
                </div>
              </div>
            </div>

            <div id="fee-summary" style="display:none; margin-top:15px; padding:10px; background:#f8f9fa; border-radius:8px; font-size:0.9rem; text-align:center;">
              Processing Fee: <strong id="disp-fee">0</strong>
            </div>

            <button class="schedule-btn" onclick="window.AppCalculators.category_2.loan_calc.toggleSchedule()">
              View Amortization Schedule <i class="fas fa-table"></i>
            </button>
          </div>
        </div>

        <div id="amortization-container" class="amortization-wrapper">
          <h3>Amortization Schedule (Yearly Breakdown)</h3>
          <div class="table-responsive">
            <table class="amort-table" id="amort-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Principal Paid</th>
                  <th>Interest Paid</th>
                  <th>Total Payment</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody id="amort-body"></tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  init: function () {
    // Initialize slider backgrounds
    this.updateTenureSlider();
    this.syncSlider('loan-amount', 'loan-amount-range');
    this.syncSlider('interest-rate', 'interest-rate-range');
  },

  currentMode: 'emi', // 'emi' or 'amount'

  switchMode: function(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    
    if(mode === 'emi') {
      document.getElementById('mode-emi').classList.add('active');
      document.getElementById('input-amount-group').style.display = 'block';
      document.getElementById('input-target-emi-group').style.display = 'none';
      document.getElementById('result-label').innerText = "Monthly EMI";
    } else {
      document.getElementById('mode-amount').classList.add('active');
      document.getElementById('input-amount-group').style.display = 'none';
      document.getElementById('input-target-emi-group').style.display = 'block';
      document.getElementById('result-label').innerText = "Eligible Loan Amount";
    }
    document.getElementById('loan-result-area').style.display = 'none';
  },

  setDefaults: function(type, btn) {
    document.querySelectorAll('.type-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const def = this.defaults[type];
    if(def) {
      document.getElementById('interest-rate').value = def.rate;
      document.getElementById('interest-rate-range').value = def.rate;
      
      document.getElementById('loan-tenure').value = def.tenure;
      document.getElementById('tenure-unit').value = 'years';
      this.updateTenureSlider();
      
      // Visual feedback
      this.syncInput('interest-rate', 'interest-rate-range');
    }
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

  updateTenureSlider: function() {
    const unit = document.getElementById('tenure-unit').value;
    const range = document.getElementById('loan-tenure-range');
    const input = document.getElementById('loan-tenure');
    
    if(unit === 'years') {
      range.max = 30;
      if(input.value > 30) input.value = 30;
    } else {
      range.max = 360;
      if(input.value < 12 && input.value > 0) input.value = input.value * 12; // Auto convert rough guess
    }
    range.value = input.value;
    this.updateSliderFill('loan-tenure-range');
  },

  formatMoney: function(num) {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  },

  toggleSchedule: function() {
    const el = document.getElementById('amortization-container');
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
    if(el.style.display === 'block') el.scrollIntoView({ behavior: 'smooth' });
  },

  calculate: function () {
    const rateInput = parseFloat(document.getElementById("interest-rate").value);
    const tenureInput = parseFloat(document.getElementById("loan-tenure").value);
    const tenureUnit = document.getElementById("tenure-unit").value;
    const feePercent = parseFloat(document.getElementById("proc-fee").value) || 0;
    const extraEmi = parseFloat(document.getElementById("extra-emi").value) || 0;

    let tenureMonths = tenureUnit === 'years' ? tenureInput * 12 : tenureInput;
    let monthlyRate = rateInput / 12 / 100;

    let P, EMI, totalInt, totalPay;
    
    // --- MODE: Calculate EMI ---
    if (this.currentMode === 'emi') {
      P = parseFloat(document.getElementById("loan-amount").value);
      
      if (!P || !rateInput || !tenureInput) return alert("Please fill all fields");

      // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
      let x = Math.pow(1 + monthlyRate, tenureMonths);
      EMI = (P * monthlyRate * x) / (x - 1);
      
      // Handle Prepayment Impact logic would go here (simplified for display)
      // We will generate the TRUE total interest based on schedule if extra EMI exists
      const schedule = this.generateSchedule(P, monthlyRate, tenureMonths, EMI, extraEmi);
      
      totalInt = schedule.totalInterest;
      totalPay = P + totalInt;
      
      // Update UI
      document.getElementById('disp-emi').innerText = this.formatMoney(EMI);
      document.getElementById('disp-principal').innerText = this.formatMoney(P);
      document.getElementById('disp-interest').innerText = this.formatMoney(totalInt);
      document.getElementById('disp-total').innerText = this.formatMoney(totalPay);

      if(extraEmi > 0) {
        const savedInt = ((P * monthlyRate * x) / (x - 1) * tenureMonths - P) - totalInt;
        const msg = document.getElementById('disp-msg');
        msg.style.display = 'block';
        msg.innerHTML = `<i class="fas fa-piggy-bank"></i> You save <b>${this.formatMoney(savedInt)}</b> in interest and finish <b>${(tenureMonths - schedule.actualMonths)} months</b> early!`;
      } else {
        document.getElementById('disp-msg').style.display = 'none';
      }

      this.renderChart(P, totalInt);
      this.renderTable(schedule.yearlyData);
    } 
    
    // --- MODE: Check Eligibility (Reverse) ---
    else {
      const targetEMI = parseFloat(document.getElementById("target-emi").value);
      if(!targetEMI || !rateInput || !tenureInput) return alert("Please fill all fields");

      // Reverse Formula: P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
      let x = Math.pow(1 + monthlyRate, tenureMonths);
      P = (targetEMI * (x - 1)) / (monthlyRate * x);
      
      totalPay = targetEMI * tenureMonths;
      totalInt = totalPay - P;

      document.getElementById('disp-emi').innerText = this.formatMoney(P);
      document.getElementById('disp-principal').innerText = this.formatMoney(P);
      document.getElementById('disp-interest').innerText = this.formatMoney(totalInt);
      document.getElementById('disp-total').innerText = this.formatMoney(totalPay);
      
      document.getElementById('disp-msg').style.display = 'none';
      
      this.renderChart(P, totalInt);
      
      // For table, we use the calculated Principal
      const schedule = this.generateSchedule(P, monthlyRate, tenureMonths, targetEMI, 0);
      this.renderTable(schedule.yearlyData);
    }

    // Fee
    const fee = (P * feePercent) / 100;
    if(fee > 0) {
      document.getElementById('fee-summary').style.display = 'block';
      document.getElementById('disp-fee').innerText = this.formatMoney(fee);
    } else {
      document.getElementById('fee-summary').style.display = 'none';
    }

    document.getElementById('loan-result-area').style.display = 'block';
    document.getElementById('amortization-container').style.display = 'none'; // reset table visibility
  },

  generateSchedule: function(principal, r, n, emi, extraPay) {
    let balance = principal;
    let totalInterest = 0;
    let actualMonths = 0;
    let yearlyData = [];
    let currentYearObj = { year: 1, p: 0, i: 0, t: 0, bal: 0 };
    
    for (let m = 1; m <= n; m++) {
      if (balance <= 0) break;
      
      let interest = balance * r;
      let totalPay = emi + extraPay;
      
      if (balance + interest < totalPay) {
        totalPay = balance + interest; // Last payment
      }
      
      let principalComp = totalPay - interest;
      balance -= principalComp;
      totalInterest += interest;
      actualMonths++;

      // Yearly aggregation
      currentYearObj.p += principalComp;
      currentYearObj.i += interest;
      currentYearObj.t += totalPay;
      
      if (m % 12 === 0 || balance <= 0) {
        currentYearObj.bal = balance < 0 ? 0 : balance;
        yearlyData.push({ ...currentYearObj });
        currentYearObj = { year: Math.floor(m/12) + 2, p: 0, i: 0, t: 0, bal: 0 };
      }
    }
    
    return { totalInterest, actualMonths, yearlyData };
  },

  renderChart: function(p, i) {
    const total = p + i;
    const pPct = (p / total) * 100;
    const iPct = (i / total) * 100;
    
    // CSS Conic Gradient for Pie Chart
    const chart = document.getElementById('loan-pie');
    chart.style.background = `conic-gradient(var(--primary) 0% ${pPct}%, #ff6b6b ${pPct}% 100%)`;
  },

  renderTable: function(data) {
    const tbody = document.getElementById('amort-body');
    tbody.innerHTML = data.map(y => `
      <tr>
        <td>Year ${y.year - 1}</td>
        <td>${this.formatMoney(y.p)}</td>
        <td>${this.formatMoney(y.i)}</td>
        <td>${this.formatMoney(y.t)}</td>
        <td>${this.formatMoney(y.bal)}</td>
      </tr>
    `).join('');
  }
};