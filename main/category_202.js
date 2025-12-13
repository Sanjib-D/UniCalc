if (!window.AppCalculators.category_2) window.AppCalculators.category_2 = {};

window.AppCalculators.category_2.mortgage_calc = {
  name: "Mortgage Calculator",
  
  init: function() {
    // Set default slider backgrounds
    this.syncSlider('mort-price', 'mort-price-range');
    this.syncSlider('mort-rate', 'mort-rate-range');
    
    // Initialize Down Payment Sync
    this.updateDownPayment('percent'); 
  },

  getHtml: function () {
    return `
      <div class="mortgage-calc-wrapper">
        
        <div class="calc-mode-switch mort-switch">
          <button class="mode-btn active" id="mode-payment" onclick="window.AppCalculators.category_2.mortgage_calc.switchMode('payment')">
            <i class="fas fa-file-invoice-dollar"></i> Monthly Payment
          </button>
          <button class="mode-btn" id="mode-afford" onclick="window.AppCalculators.category_2.mortgage_calc.switchMode('afford')">
            <i class="fas fa-home"></i> How much can I afford?
          </button>
        </div>

        <div class="mort-grid">
          <div class="mort-inputs">
            
            <div class="input-card" id="group-price">
              <div class="input-header">
                <label>Home Price</label>
                <div class="input-val-wrapper">
                  <span class="currency-symbol">$</span>
                  <input type="number" id="mort-price" value="400000" oninput="window.AppCalculators.category_2.mortgage_calc.syncSlider('mort-price', 'mort-price-range'); window.AppCalculators.category_2.mortgage_calc.updateDownPayment('price_change');">
                </div>
              </div>
              <input type="range" id="mort-price-range" min="50000" max="2000000" step="5000" value="400000" class="styled-slider" oninput="window.AppCalculators.category_2.mortgage_calc.syncInput('mort-price', 'mort-price-range'); window.AppCalculators.category_2.mortgage_calc.updateDownPayment('price_change');">
            </div>

            <div class="input-card" id="group-target" style="display:none;">
              <div class="input-header">
                <label>Target Monthly Payment</label>
                <div class="input-val-wrapper">
                  <span class="currency-symbol">$</span>
                  <input type="number" id="mort-target" value="2500">
                </div>
              </div>
              <small class="hint-text">Includes Tax, Insurance & HOA</small>
            </div>

            <div class="input-card">
              <div class="input-header">
                <label>Down Payment</label>
                <div class="down-payment-controls">
                  <div class="input-val-wrapper small">
                    <input type="number" id="mort-down-pct" value="20" oninput="window.AppCalculators.category_2.mortgage_calc.updateDownPayment('percent')">
                    <span class="unit-symbol">%</span>
                  </div>
                  <div class="input-val-wrapper">
                    <span class="currency-symbol">$</span>
                    <input type="number" id="mort-down-amt" value="80000" oninput="window.AppCalculators.category_2.mortgage_calc.updateDownPayment('amount')">
                  </div>
                </div>
              </div>
              <input type="range" id="mort-down-range" min="0" max="90" step="1" value="20" class="styled-slider" oninput="document.getElementById('mort-down-pct').value = this.value; window.AppCalculators.category_2.mortgage_calc.updateDownPayment('percent');">
            </div>

            <div class="split-row">
              <div class="input-card compact">
                <label>Interest Rate %</label>
                <div class="input-val-wrapper">
                  <input type="number" id="mort-rate" value="6.5" step="0.1" oninput="window.AppCalculators.category_2.mortgage_calc.syncSlider('mort-rate', 'mort-rate-range')">
                </div>
                <input type="range" id="mort-rate-range" min="1" max="15" step="0.1" value="6.5" class="styled-slider mt-2" oninput="window.AppCalculators.category_2.mortgage_calc.syncInput('mort-rate', 'mort-rate-range')">
              </div>

              <div class="input-card compact">
                <label>Loan Term</label>
                <select id="mort-term" class="mort-select">
                  <option value="30">30 Years</option>
                  <option value="20">20 Years</option>
                  <option value="15">15 Years</option>
                  <option value="10">10 Years</option>
                </select>
              </div>
            </div>

            <div class="accordion-box">
              <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
                <span><i class="fas fa-sliders-h"></i> Taxes, Insurance & HOA</span>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="accordion-content">
                <div class="form-group">
                  <label>Property Tax / Year ($)</label>
                  <input type="number" id="mort-tax" value="4800">
                </div>
                <div class="form-group">
                  <label>Home Insurance / Year ($)</label>
                  <input type="number" id="mort-ins" value="1200">
                </div>
                <div class="form-group">
                  <label>PMI (Monthly %) <small>(Usually 0.5-1%)</small></label>
                  <input type="number" id="mort-pmi" value="0.5" step="0.1">
                </div>
                <div class="form-group">
                  <label>HOA Fees / Month ($)</label>
                  <input type="number" id="mort-hoa" value="0">
                </div>
              </div>
            </div>
            
            <button class="calc-btn-lg mort-btn" onclick="window.AppCalculators.category_2.mortgage_calc.calculate()">
              Calculate <i class="fas fa-chevron-right"></i>
            </button>

          </div>

          <div class="mort-results" id="mort-result-area" style="display:none;">
            
            <div class="mort-main-display">
              <span id="mort-res-label">Estimated Monthly Payment</span>
              <h1 id="mort-res-val">$0</h1>
            </div>

            <div class="breakdown-bars">
              <div class="bar-row">
                <span class="dot c-pi"></span> Principal & Interest
                <span class="val" id="val-pi">$0</span>
              </div>
              <div class="bar-visual" id="bar-pi" style="width:0; background:var(--primary);"></div>

              <div class="bar-row">
                <span class="dot c-tax"></span> Property Tax
                <span class="val" id="val-tax">$0</span>
              </div>
              <div class="bar-visual" id="bar-tax" style="width:0; background:#ff9f43;"></div>

              <div class="bar-row">
                <span class="dot c-ins"></span> Home Insurance
                <span class="val" id="val-ins">$0</span>
              </div>
              <div class="bar-visual" id="bar-ins" style="width:0; background:#2ed573;"></div>

              <div class="bar-row" id="row-pmi">
                <span class="dot c-pmi"></span> PMI (Mortgage Ins.)
                <span class="val" id="val-pmi">$0</span>
              </div>
              <div class="bar-visual" id="bar-pmi" style="width:0; background:#ff6b6b;"></div>
              
              <div class="bar-row" id="row-hoa">
                <span class="dot c-hoa"></span> HOA Fees
                <span class="val" id="val-hoa">$0</span>
              </div>
              <div class="bar-visual" id="bar-hoa" style="width:0; background:#576574;"></div>
            </div>
            
            <div class="mort-stats">
              <div class="stat-box">
                <small>Loan Amount</small>
                <strong id="stat-loan">$0</strong>
              </div>
              <div class="stat-box">
                <small>Total Interest</small>
                <strong id="stat-interest" style="color:#ff6b6b">$0</strong>
              </div>
              <div class="stat-box">
                <small>Total Cost</small>
                <strong id="stat-total">$0</strong>
              </div>
            </div>

            <button class="schedule-btn-outline" onclick="window.AppCalculators.category_2.mortgage_calc.toggleSchedule()">
              Show Amortization Schedule
            </button>

          </div>
        </div>
        
        <div id="mort-schedule-container" class="mort-schedule-wrapper">
            <h3>Yearly Amortization</h3>
            <div class="table-responsive">
                <table class="amort-table">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Interest</th>
                            <th>Principal</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody id="mort-schedule-body"></tbody>
                </table>
            </div>
        </div>

      </div>
    `;
  },

  mode: 'payment', // 'payment' or 'afford'

  switchMode: function(m) {
    this.mode = m;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('mort-result-area').style.display = 'none';
    document.getElementById('mort-schedule-container').style.display = 'none';
    
    if(m === 'payment') {
        document.getElementById('mode-payment').classList.add('active');
        document.getElementById('group-price').style.display = 'block';
        document.getElementById('group-target').style.display = 'none';
        document.getElementById('mort-res-label').innerText = "Estimated Monthly Payment";
    } else {
        document.getElementById('mode-afford').classList.add('active');
        document.getElementById('group-price').style.display = 'none';
        document.getElementById('group-target').style.display = 'block';
        document.getElementById('mort-res-label').innerText = "Maximum Home Price";
    }
  },

  // Sync Slider inputs
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

  // Complex Logic for Down Payment Sync
  updateDownPayment: function(source) {
    const priceInput = document.getElementById('mort-price');
    const pctInput = document.getElementById('mort-down-pct');
    const amtInput = document.getElementById('mort-down-amt');
    const rangeInput = document.getElementById('mort-down-range');

    let price = parseFloat(priceInput.value) || 0;
    
    // If calculating Affordability, price isn't known yet, so we use a placeholder logic or skip
    if(this.mode === 'afford' && source === 'price_change') return;

    if(source === 'percent' || source === 'price_change') {
        // Source is Percentage slider/input -> Calculate Amount
        let pct = parseFloat(pctInput.value) || 0;
        if(pct > 100) pct = 100;
        
        const amt = (price * pct) / 100;
        amtInput.value = amt.toFixed(0);
        rangeInput.value = pct; // sync slider
    } 
    else if (source === 'amount') {
        // Source is Amount input -> Calculate Percentage
        let amt = parseFloat(amtInput.value) || 0;
        if(amt > price) amt = price;
        
        const pct = (price > 0) ? (amt / price) * 100 : 0;
        pctInput.value = pct.toFixed(1);
        rangeInput.value = pct; // sync slider visual might be jumpy if not integer, but okay
    }
    
    this.updateSliderFill('mort-down-range');
  },

  formatMoney: function(num) {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  },

  toggleSchedule: function() {
    const el = document.getElementById('mort-schedule-container');
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
    if(el.style.display === 'block') el.scrollIntoView({behavior: 'smooth'});
  },

  calculate: function() {
    // 1. Gather Inputs
    const rate = parseFloat(document.getElementById('mort-rate').value);
    const years = parseFloat(document.getElementById('mort-term').value);
    const taxYear = parseFloat(document.getElementById('mort-tax').value) || 0;
    const insYear = parseFloat(document.getElementById('mort-ins').value) || 0;
    const hoaMonth = parseFloat(document.getElementById('mort-hoa').value) || 0;
    const pmiPct = parseFloat(document.getElementById('mort-pmi').value) || 0; // Annual % of Loan Amount
    
    if(!rate || !years) return alert("Please check interest rate and term.");

    const r = rate / 100 / 12;
    const n = years * 12;
    const monthlyTax = taxYear / 12;
    const monthlyIns = insYear / 12;
    
    let homePrice, loanAmount, downPayment, monthlyPI, monthlyPMI;

    // --- MODE 1: Calculate Monthly Payment ---
    if(this.mode === 'payment') {
        homePrice = parseFloat(document.getElementById('mort-price').value);
        downPayment = parseFloat(document.getElementById('mort-down-amt').value);
        loanAmount = homePrice - downPayment;
        
        if(loanAmount <= 0) return alert("Down payment cannot be greater than home price.");

        // Mortgage Formula: M = P[r(1+r)^n]/[(1+r)^n - 1]
        monthlyPI = loanAmount * ( (r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1) );
        
        // PMI Calculation (Simple approximation: applied if down payment < 20%)
        const downPct = (downPayment / homePrice) * 100;
        monthlyPMI = (downPct < 20) ? (loanAmount * (pmiPct/100) / 12) : 0;
        
        const totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyPMI + hoaMonth;

        // FIXED: Passing downPayment to the display function
        this.displayResults(totalMonthly, monthlyPI, monthlyTax, monthlyIns, monthlyPMI, hoaMonth, loanAmount, homePrice, downPayment, n, r);
    } 
    
    // --- MODE 2: Calculate Affordability (Reverse) ---
    else {
        const targetPayment = parseFloat(document.getElementById('mort-target').value);
        const downPct = parseFloat(document.getElementById('mort-down-pct').value);

        // Net available for P&I and PMI
        let availableForLoan = targetPayment - monthlyTax - monthlyIns - hoaMonth;
        
        if(availableForLoan <= 0) return alert("Tax, Insurance & HOA exceed your target payment!");

        const mortgageFactor = (r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
        const pmiFactor = (downPct < 20) ? (pmiPct/100/12) : 0;
        
        loanAmount = availableForLoan / (mortgageFactor + pmiFactor);
        homePrice = loanAmount / (1 - (downPct/100));
        downPayment = homePrice - loanAmount;

        monthlyPI = loanAmount * mortgageFactor;
        monthlyPMI = loanAmount * pmiFactor;
        
        // FIXED: Passing downPayment to the display function
        this.displayResults(homePrice, monthlyPI, monthlyTax, monthlyIns, monthlyPMI, hoaMonth, loanAmount, homePrice, downPayment, n, r, true);
    }
  },

  displayResults: function(mainMetric, pi, tax, ins, pmi, hoa, loan, price, downPayment, n, r, isReverse=false) {
    const resArea = document.getElementById('mort-result-area');
    resArea.style.display = 'block';

    // Update Main Display
    document.getElementById('mort-res-val').innerText = this.formatMoney(mainMetric);
    document.getElementById('mort-res-label').innerText = isReverse ? "Maximum Home Price" : "Estimated Monthly Payment";
    
    // Values for Breakdown
    const totalMonthly = pi + tax + ins + pmi + hoa; 
    
    // Populate Breakdown text
    document.getElementById('val-pi').innerText = this.formatMoney(pi);
    document.getElementById('val-tax').innerText = this.formatMoney(tax);
    document.getElementById('val-ins').innerText = this.formatMoney(ins);
    document.getElementById('val-pmi').innerText = this.formatMoney(pmi);
    document.getElementById('val-hoa').innerText = this.formatMoney(hoa);

    // Toggle Visibility of PMI/HOA rows if 0
    document.getElementById('row-pmi').style.display = pmi > 0 ? 'flex' : 'none';
    document.getElementById('bar-pmi').style.display = pmi > 0 ? 'block' : 'none';
    document.getElementById('row-hoa').style.display = hoa > 0 ? 'flex' : 'none';
    document.getElementById('bar-hoa').style.display = hoa > 0 ? 'block' : 'none';

    // Animate Bars
    // Use isReverse to determine denominator for bar width (if Affordability mode, mainMetric is price, so we use totalMonthly calculated here)
    const barDenominator = totalMonthly; 

    setTimeout(() => {
        document.getElementById('bar-pi').style.width = (pi/barDenominator*100) + "%";
        document.getElementById('bar-tax').style.width = (tax/barDenominator*100) + "%";
        document.getElementById('bar-ins').style.width = (ins/barDenominator*100) + "%";
        if(pmi>0) document.getElementById('bar-pmi').style.width = (pmi/barDenominator*100) + "%";
        if(hoa>0) document.getElementById('bar-hoa').style.width = (hoa/barDenominator*100) + "%";
    }, 100);

    // Stats
    const totalInterest = (pi * n) - loan;
    
    // Total Cost = All monthly payments * months + Down Payment
    // Note: Tax/Ins/HOA are perpetual costs of ownership, usually "Total Cost of Loan" implies Principal + Interest + Fees during loan term.
    // For this calculator, let's show Total Cost of Loan (Principal + Interest + PMI + Down Payment) to avoid confusion with perpetual taxes.
    // OR we can include Tax/Ins for the duration of the loan term. Let's include everything for the N months.
    const totalCost = (totalMonthly * n) + downPayment; 

    document.getElementById('stat-loan').innerText = this.formatMoney(loan);
    document.getElementById('stat-interest').innerText = this.formatMoney(totalInterest);
    document.getElementById('stat-total').innerText = this.formatMoney(totalCost);

    // Generate Schedule
    this.generateScheduleTable(loan, r, n, pi);
  },

  generateScheduleTable: function(principal, r, n, monthlyPayment) {
    let balance = principal;
    let html = '';
    let yearInterest = 0;
    let yearPrincipal = 0;

    for(let m=1; m<=n; m++) {
        const interest = balance * r;
        const principalPaid = monthlyPayment - interest;
        balance -= principalPaid;
        
        // Floating point correction
        if(balance < 0) balance = 0;

        yearInterest += interest;
        yearPrincipal += principalPaid;

        if(m % 12 === 0 || m === n) {
            html += `
                <tr>
                    <td>Year ${Math.ceil(m/12)}</td>
                    <td>${this.formatMoney(yearInterest)}</td>
                    <td>${this.formatMoney(yearPrincipal)}</td>
                    <td>${this.formatMoney(balance)}</td>
                </tr>
            `;
            yearInterest = 0;
            yearPrincipal = 0;
        }
    }
    document.getElementById('mort-schedule-body').innerHTML = html;
  }
};