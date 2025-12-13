if (!window.AppCalculators.category_2) window.AppCalculators.category_2 = {};

window.AppCalculators.category_2.tax_calc = {
  name: "Salary Tax Estimator (India)",

  init: function() {
    this.addListeners();
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        if(document.getElementById('inc-basic')) this.calculate();
    }, 100);
  },

  getHtml: function() {
    return `
      <div class="tax-calc-wrapper">
        
        <div class="tax-header-bar">
          <div class="form-group compact">
            <label>Financial Year</label>
            <select id="tax-year" class="tax-trigger">
              <option value="2024-2025" selected>FY 2024-25 (Latest)</option>
              <option value="2023-2024">FY 2023-24</option>
            </select>
          </div>
          <div class="form-group compact">
            <label>Age Category</label>
            <select id="tax-age" class="tax-trigger">
              <option value="60">General (Below 60)</option>
              <option value="60-80">Senior (60-80)</option>
              <option value="80">Super Senior (80+)</option>
            </select>
          </div>
        </div>

        <div class="tax-grid">
          
          <div class="tax-inputs">
            
            <div class="tax-card">
              <div class="tax-card-header">
                <span><i class="fas fa-wallet"></i> Income Details</span>
              </div>
              <div class="tax-card-body">
                <div class="input-row">
                    <label>Basic Salary</label>
                    <input type="number" id="inc-basic" class="tax-input" placeholder="0">
                </div>
                <div class="input-row">
                    <label>HRA Received</label>
                    <input type="number" id="inc-hra" class="tax-input" placeholder="0">
                </div>
                <div class="input-row">
                    <label>Special Allowances</label>
                    <input type="number" id="inc-special" class="tax-input" placeholder="0">
                </div>
                <div class="input-row highlight-row">
                    <label>Other Income</label>
                    <input type="number" id="inc-other" class="tax-input" placeholder="Interest, etc.">
                </div>
              </div>
            </div>

            <div class="tax-card">
              <div class="tax-card-header">
                <span><i class="fas fa-home"></i> HRA Exemption</span>
              </div>
              <div class="tax-card-body">
                <div class="input-row">
                    <label>Rent Paid (Yearly)</label>
                    <input type="number" id="ex-rent" class="tax-input" placeholder="0">
                </div>
                <div class="metro-toggle">
                    <label>Residing in Metro City?</label>
                    <input type="checkbox" id="ex-metro" class="tax-trigger">
                </div>
              </div>
            </div>

            <div class="tax-card">
              <div class="tax-card-header">
                <span><i class="fas fa-piggy-bank"></i> Deductions (Old Regime)</span>
              </div>
              <div class="tax-card-body">
                <div class="input-row">
                    <label>80C (Max 1.5L)</label>
                    <input type="number" id="ded-80c" class="tax-input" placeholder="LIC, PPF, ELSS">
                </div>
                <div class="input-row">
                    <label>80D (Medical)</label>
                    <input type="number" id="ded-80d" class="tax-input" placeholder="0">
                </div>
                <div class="input-row">
                    <label>NPS (Max 50k)</label>
                    <input type="number" id="ded-nps" class="tax-input" placeholder="80CCD(1B)">
                </div>
              </div>
            </div>

            <button class="calc-btn-lg tax-btn" id="manual-calc-btn">
                Recalculate <i class="fas fa-sync"></i>
            </button>

          </div>

          <div class="tax-results">
            
            <div class="regime-comparison">
                <div class="regime-card" id="card-old">
                    <div class="reg-tag">Old Regime</div>
                    <div class="reg-val" id="disp-tax-old">₹0</div>
                    <small>Tax Payable</small>
                </div>
                <div class="regime-card" id="card-new">
                    <div class="reg-tag">New Regime</div>
                    <div class="reg-val" id="disp-tax-new">₹0</div>
                    <small>Tax Payable</small>
                    <div class="rec-badge" id="rec-badge" style="display:none;">Lowest Tax</div>
                </div>
            </div>

            <div class="result-summary">
                <h4>Est. Monthly Take-Home</h4>
                <h2 id="disp-takehome">₹0</h2>
                <div class="takehome-chart-bar">
                    <div id="bar-income" class="th-bar" style="width:100%"></div>
                    <div id="bar-tax" class="th-tax" style="width:0%"></div>
                </div>
                <div class="legend">
                    <span style="color:var(--primary)">Net Income</span>
                    <span style="color:#ff6b6b">Tax</span>
                </div>
            </div>

            <div class="breakdown-table-wrapper">
                <table class="tax-table">
                    <thead>
                        <tr>
                            <th>Component</th>
                            <th>Old Regime</th>
                            <th>New Regime</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Gross Income</td><td id="td-gross-old">0</td><td id="td-gross-new">0</td></tr>
                        <tr><td>HRA Exemption</td><td id="td-hra-old" class="text-green">0</td><td class="text-muted">-</td></tr>
                        <tr><td>Std. Deduction</td><td id="td-std-old">50,000</td><td id="td-std-new">75,000</td></tr>
                        <tr><td>80C/80D/NPS</td><td id="td-ded-old" class="text-green">0</td><td class="text-muted">-</td></tr>
                        <tr class="row-total"><td>Taxable Income</td><td id="td-net-old">0</td><td id="td-net-new">0</td></tr>
                        <tr class="row-final"><td>Total Tax</td><td id="td-final-old">0</td><td id="td-final-new">0</td></tr>
                    </tbody>
                </table>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  addListeners: function() {
    const self = this;
    
    // Attach to inputs
    document.querySelectorAll('.tax-input').forEach(input => {
        input.addEventListener('input', () => self.calculate());
    });

    // Attach to selects/checkboxes
    document.querySelectorAll('.tax-trigger').forEach(input => {
        input.addEventListener('change', () => self.calculate());
    });

    // Manual button
    const btn = document.getElementById('manual-calc-btn');
    if(btn) btn.addEventListener('click', () => self.calculate());
  },

  formatMoney: function(num) {
    return "₹" + num.toLocaleString('en-IN');
  },

  calculate: function() {
    const el = (id) => document.getElementById(id);
    if (!el('inc-basic')) return;

    // 1. Gather Inputs
    const basic = parseFloat(el('inc-basic').value) || 0;
    const hra = parseFloat(el('inc-hra').value) || 0;
    const special = parseFloat(el('inc-special').value) || 0;
    const otherInc = parseFloat(el('inc-other').value) || 0;

    const rentPaid = parseFloat(el('ex-rent').value) || 0;
    const isMetro = el('ex-metro').checked;

    const ded80c = Math.min(parseFloat(el('ded-80c').value) || 0, 150000);
    const ded80d = parseFloat(el('ded-80d').value) || 0;
    const dedNps = Math.min(parseFloat(el('ded-nps').value) || 0, 50000);
    
    const ageCat = el('tax-age').value;

    // --- CALCULATIONS ---

    const grossTotal = basic + hra + special + otherInc;

    // --- OLD REGIME ---
    let hraExemption = 0;
    if (rentPaid > 0 && hra > 0) {
        const cond1 = hra;
        const cond2 = Math.max(0, rentPaid - (0.10 * basic));
        const cond3 = (isMetro ? 0.50 : 0.40) * basic;
        hraExemption = Math.min(cond1, cond2, cond3);
    }

    const stdDeductionOld = 50000;
    const totalDeductionsOld = ded80c + ded80d + dedNps;
    
    let taxableOld = grossTotal - hraExemption - stdDeductionOld - totalDeductionsOld;
    if (taxableOld < 0) taxableOld = 0;

    const taxOld = this.calcTaxOld(taxableOld, ageCat);
    const cessOld = taxOld * 0.04;
    const finalTaxOld = Math.round(taxOld + cessOld);

    // --- NEW REGIME (FY 24-25) ---
    const stdDeductionNew = 75000;
    let taxableNew = grossTotal - stdDeductionNew;
    if (taxableNew < 0) taxableNew = 0;

    const taxNew = this.calcTaxNew(taxableNew);
    const cessNew = taxNew * 0.04;
    const finalTaxNew = Math.round(taxNew + cessNew);

    // --- UPDATE UI ---
    el('disp-tax-old').innerText = this.formatMoney(finalTaxOld);
    el('disp-tax-new').innerText = this.formatMoney(finalTaxNew);

    // Comparison Badge Logic
    const cardOld = el('card-old');
    const cardNew = el('card-new');
    const badge = el('rec-badge');

    cardOld.classList.remove('recommended');
    cardNew.classList.remove('recommended');
    badge.style.display = 'block';

    let winningTax = 0;
    
    // Determine winner (Lowest Tax)
    if (finalTaxNew < finalTaxOld) {
        cardNew.classList.add('recommended');
        cardNew.appendChild(badge);
        winningTax = finalTaxNew;
    } else if (finalTaxOld < finalTaxNew) {
        cardOld.classList.add('recommended');
        cardOld.appendChild(badge);
        winningTax = finalTaxOld;
    } else {
        // Equal
        cardNew.classList.add('recommended'); 
        cardNew.appendChild(badge);
        winningTax = finalTaxNew;
    }

    // Monthly Take Home
    const yearlyNet = grossTotal - winningTax;
    el('disp-takehome').innerText = this.formatMoney(Math.round(yearlyNet / 12));

    // Graph
    let taxPct = 0;
    if(grossTotal > 0) taxPct = (winningTax / grossTotal) * 100;
    if(taxPct > 100) taxPct = 100;
    
    el('bar-income').style.width = (100 - taxPct) + "%";
    el('bar-tax').style.width = taxPct + "%";

    // Table
    el('td-gross-old').innerText = this.formatMoney(grossTotal);
    el('td-gross-new').innerText = this.formatMoney(grossTotal);
    
    el('td-hra-old').innerText = "-" + this.formatMoney(Math.round(hraExemption));
    
    el('td-std-old').innerText = "-" + this.formatMoney(stdDeductionOld);
    el('td-std-new').innerText = "-" + this.formatMoney(stdDeductionNew);

    el('td-ded-old').innerText = "-" + this.formatMoney(totalDeductionsOld);

    el('td-net-old').innerText = this.formatMoney(Math.round(taxableOld));
    el('td-net-new').innerText = this.formatMoney(Math.round(taxableNew));

    el('td-final-old').innerText = this.formatMoney(finalTaxOld);
    el('td-final-new').innerText = this.formatMoney(finalTaxNew);
  },

  calcTaxOld: function(income, age) {
    let slab1 = 250000;
    if (age === '60-80') slab1 = 300000;
    if (age === '80') slab1 = 500000;

    let tax = 0;
    // Standard Progressive Calculation
    if (income > 1000000) {
        tax += (income - 1000000) * 0.30;
        tax += (1000000 - 500000) * 0.20;
        if(slab1 < 500000) tax += (500000 - slab1) * 0.05;
    } 
    else if (income > 500000) {
        tax += (income - 500000) * 0.20;
        if(slab1 < 500000) tax += (500000 - slab1) * 0.05;
    } 
    else if (income > slab1) {
        tax += (income - slab1) * 0.05;
    }

    // Rebate 87A (Old): No tax if Taxable Income <= 5L
    if (income <= 500000) return 0;
    return tax;
  },

  calcTaxNew: function(incomeOriginal) {
    // 1. Rebate 87A (New): No tax if Taxable Income <= 7L
    if (incomeOriginal <= 700000) return 0;

    let tax = 0;
    let tempInc = incomeOriginal; 

    // New Regime Slabs (FY 24-25 Budget)
    // 0-3L: Nil | 3-7L: 5% | 7-10L: 10% | 10-12L: 15% | 12-15L: 20% | >15L: 30%
    
    if (tempInc > 1500000) {
        tax += (tempInc - 1500000) * 0.30;
        tempInc = 1500000;
    }
    if (tempInc > 1200000) {
        tax += (tempInc - 1200000) * 0.20;
        tempInc = 1200000;
    }
    if (tempInc > 1000000) {
        tax += (tempInc - 1000000) * 0.15;
        tempInc = 1000000;
    }
    if (tempInc > 700000) {
        tax += (tempInc - 700000) * 0.10;
        tempInc = 700000;
    }
    if (tempInc > 300000) {
        tax += (tempInc - 300000) * 0.05;
    }
    
    return tax;
  }
};