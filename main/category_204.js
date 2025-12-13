if (!window.AppCalculators.category_2) window.AppCalculators.category_2 = {};

window.AppCalculators.category_2.gst_calc = {
  name: "GST / VAT Calculator",

  init: function() {
    this.calculate(); // Auto-calc on load
  },

  getHtml: function() {
    return `
      <div class="gst-calc-wrapper">
        
        <div class="gst-mode-switch">
          <button class="gst-mode-btn active" id="mode-excl" onclick="window.AppCalculators.category_2.gst_calc.switchMode('exclusive')">
            <i class="fas fa-plus-circle"></i> GST Exclusive
            <small>Add Tax to Price</small>
          </button>
          <button class="gst-mode-btn" id="mode-incl" onclick="window.AppCalculators.category_2.gst_calc.switchMode('inclusive')">
            <i class="fas fa-minus-circle"></i> GST Inclusive
            <small>Remove Tax from Price</small>
          </button>
        </div>

        <div class="gst-grid">
          
          <div class="gst-inputs">
            
            <div class="input-card">
              <label>Amount / Price</label>
              <div class="input-val-wrapper">
                <span class="currency-symbol">$</span>
                <input type="number" id="gst-amount" value="1000" placeholder="Enter Amount" oninput="window.AppCalculators.category_2.gst_calc.calculate()">
              </div>
            </div>

            <div class="input-card">
              <label>Tax Rate (%)</label>
              <div class="slab-grid">
                <button class="slab-btn" onclick="window.AppCalculators.category_2.gst_calc.setRate(5)">5%</button>
                <button class="slab-btn" onclick="window.AppCalculators.category_2.gst_calc.setRate(12)">12%</button>
                <button class="slab-btn active" onclick="window.AppCalculators.category_2.gst_calc.setRate(18)">18%</button>
                <button class="slab-btn" onclick="window.AppCalculators.category_2.gst_calc.setRate(28)">28%</button>
                <div class="custom-slab">
                    <input type="number" id="gst-rate" value="18" oninput="window.AppCalculators.category_2.gst_calc.manualRate()">
                    <span>%</span>
                </div>
              </div>
            </div>

            <div class="advanced-toggle" onclick="document.getElementById('gst-adv-options').classList.toggle('show')">
              <span><i class="fas fa-cog"></i> Quantity & Discount</span>
              <i class="fas fa-chevron-down"></i>
            </div>

            <div id="gst-adv-options" class="advanced-section">
              <div class="form-group">
                <label>Quantity</label>
                <input type="number" id="gst-qty" value="1" min="1" oninput="window.AppCalculators.category_2.gst_calc.calculate()">
              </div>
              <div class="form-group">
                <label>Discount</label>
                <div class="input-val-wrapper small" style="width:100%">
                    <input type="number" id="gst-disc" value="0" placeholder="0" oninput="window.AppCalculators.category_2.gst_calc.calculate()">
                    <select id="disc-type" onchange="window.AppCalculators.category_2.gst_calc.calculate()" style="border:none; background:transparent; font-weight:bold; color:#666;">
                        <option value="percent">%</option>
                        <option value="flat">Flat</option>
                    </select>
                </div>
              </div>
            </div>
            
            <div class="region-select">
                <label>Tax Breakdown Type:</label>
                <select id="gst-region" onchange="window.AppCalculators.category_2.gst_calc.calculate()">
                    <option value="generic">Generic (Total Tax)</option>
                    <option value="igst">IGST (Inter-State)</option>
                    <option value="cgst">CGST + SGST (Intra-State)</option>
                </select>
            </div>

          </div>

          <div class="gst-invoice-panel">
            <div class="invoice-paper">
                <div class="inv-header">
                    <h4>TAX SUMMARY</h4>
                    <span id="inv-date"></span>
                </div>
                
                <div class="inv-row">
                    <span>Net Amount</span>
                    <span id="disp-net" class="inv-val">$0</span>
                </div>
                
                <div id="row-disc" class="inv-row" style="display:none; color:#e17055;">
                    <span>Discount</span>
                    <span id="disp-disc" class="inv-val">-$0</span>
                </div>

                <div class="inv-divider"></div>
                
                <div class="inv-row tax-row" id="row-generic">
                    <span>Total Tax (<span class="rate-lbl">0</span>%)</span>
                    <span id="disp-tax" class="inv-val text-primary">$0</span>
                </div>

                <div class="inv-row tax-row sub-tax" id="row-cgst" style="display:none;">
                    <span>CGST (<span class="half-rate">0</span>%)</span>
                    <span id="disp-cgst" class="inv-val">$0</span>
                </div>
                <div class="inv-row tax-row sub-tax" id="row-sgst" style="display:none;">
                    <span>SGST (<span class="half-rate">0</span>%)</span>
                    <span id="disp-sgst" class="inv-val">$0</span>
                </div>
                <div class="inv-row tax-row sub-tax" id="row-igst" style="display:none;">
                    <span>IGST (<span class="rate-lbl">0</span>%)</span>
                    <span id="disp-igst" class="inv-val">$0</span>
                </div>

                <div class="inv-divider total"></div>

                <div class="inv-row total-row">
                    <span>Grand Total</span>
                    <span id="disp-total">$0</span>
                </div>

                <div class="inv-msg" id="mode-msg">Calculated Exclusive of Tax</div>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  currentMode: 'exclusive', // exclusive or inclusive

  switchMode: function(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.gst-mode-btn').forEach(b => b.classList.remove('active'));
    
    if (mode === 'exclusive') {
        document.getElementById('mode-excl').classList.add('active');
        document.getElementById('mode-msg').innerText = "Price + Tax = Total";
    } else {
        document.getElementById('mode-incl').classList.add('active');
        document.getElementById('mode-msg').innerText = "Total includes Tax";
    }
    this.calculate();
  },

  setRate: function(rate) {
    document.getElementById('gst-rate').value = rate;
    document.querySelectorAll('.slab-btn').forEach(b => b.classList.remove('active'));
    
    // Find button with this rate and activate it
    const buttons = document.querySelectorAll('.slab-btn');
    buttons.forEach(btn => {
        if(btn.innerText.includes(rate)) btn.classList.add('active');
    });
    
    this.calculate();
  },

  manualRate: function() {
    document.querySelectorAll('.slab-btn').forEach(b => b.classList.remove('active'));
    this.calculate();
  },

  formatMoney: function(num) {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  },

  calculate: function() {
    const amountInput = parseFloat(document.getElementById('gst-amount').value) || 0;
    const rate = parseFloat(document.getElementById('gst-rate').value) || 0;
    const qty = parseFloat(document.getElementById('gst-qty').value) || 1;
    const discInput = parseFloat(document.getElementById('gst-disc').value) || 0;
    const discType = document.getElementById('disc-type').value;
    const region = document.getElementById('gst-region').value;

    // 1. Handle Quantity
    let totalAmount = amountInput * qty;

    // 2. Handle Discount (Applied on Base Price usually)
    // NOTE: For Inclusive calculations, discount logic can be tricky. 
    // Standard practice: Discount applies to the Gross Price.
    let discountVal = 0;
    if (discType === 'percent') {
        discountVal = (totalAmount * discInput) / 100;
    } else {
        discountVal = discInput;
    }
    
    // Effective Amount after discount
    let effectiveAmount = totalAmount - discountVal;
    if(effectiveAmount < 0) effectiveAmount = 0;

    let netPrice, taxAmount, finalPrice;

    // 3. Calculation Logic
    if (this.currentMode === 'exclusive') {
        // Exclusive: Base Price -> Add Tax
        netPrice = effectiveAmount;
        taxAmount = (netPrice * rate) / 100;
        finalPrice = netPrice + taxAmount;
    } else {
        // Inclusive: Total Price -> Remove Tax
        // Formula: Tax = Total * (Rate / (100 + Rate))
        finalPrice = effectiveAmount;
        taxAmount = finalPrice * (rate / (100 + rate));
        netPrice = finalPrice - taxAmount;
    }

    // 4. Update UI
    const today = new Date();
    document.getElementById('inv-date').innerText = today.toLocaleDateString();

    document.getElementById('disp-net').innerText = this.formatMoney(netPrice);
    document.getElementById('disp-total').innerText = this.formatMoney(finalPrice);

    // Discount Row
    const discRow = document.getElementById('row-disc');
    if(discountVal > 0) {
        discRow.style.display = 'flex';
        document.getElementById('disp-disc').innerText = "-" + this.formatMoney(discountVal);
    } else {
        discRow.style.display = 'none';
    }

    // Tax Breakdowns
    document.querySelectorAll('.rate-lbl').forEach(el => el.innerText = rate);
    document.querySelectorAll('.half-rate').forEach(el => el.innerText = rate/2);

    // Reset Display
    document.getElementById('row-generic').style.display = 'none';
    document.getElementById('row-cgst').style.display = 'none';
    document.getElementById('row-sgst').style.display = 'none';
    document.getElementById('row-igst').style.display = 'none';

    if (region === 'generic') {
        document.getElementById('row-generic').style.display = 'flex';
        document.getElementById('disp-tax').innerText = this.formatMoney(taxAmount);
    } 
    else if (region === 'igst') {
        document.getElementById('row-igst').style.display = 'flex';
        document.getElementById('disp-igst').innerText = this.formatMoney(taxAmount);
    } 
    else if (region === 'cgst') {
        const halfTax = taxAmount / 2;
        document.getElementById('row-cgst').style.display = 'flex';
        document.getElementById('row-sgst').style.display = 'flex';
        document.getElementById('disp-cgst').innerText = this.formatMoney(halfTax);
        document.getElementById('disp-sgst').innerText = this.formatMoney(halfTax);
    }
  }
};