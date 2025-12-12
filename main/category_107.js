if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_1) window.AppCalculators.category_1 = {};

window.AppCalculators.category_1.discount_calc = {
  currentMode: "standard", // 'standard' or 'reverse'

  getHtml: function () {
    return `
            <div class="discount-calc-container">
                
                <div class="disc-mode-switch">
                    <button class="disc-mode-btn active" id="btn-mode-std" onclick="window.AppCalculators.category_1.discount_calc.setMode('standard')">
                        <i class="fas fa-tag"></i> Calculator
                    </button>
                    <button class="disc-mode-btn" id="btn-mode-rev" onclick="window.AppCalculators.category_1.discount_calc.setMode('reverse')">
                        <i class="fas fa-history"></i> Reverse
                    </button>
                </div>

                <div class="disc-layout">
                    
                    <div class="disc-form-panel">
                        
                        <div id="input-std">
                            <div class="disc-input-group">
                                <label>Original Price</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-dollar-sign"></i>
                                    <input type="number" id="d-price" placeholder="0.00" oninput="window.AppCalculators.category_1.discount_calc.calculate()">
                                </div>
                            </div>

                            <div class="disc-input-group">
                                <label>Discount (%)</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-percent"></i>
                                    <input type="number" id="d-disc1" placeholder="0" oninput="window.AppCalculators.category_1.discount_calc.calculate()">
                                </div>
                                <div class="preset-row">
                                    <div class="preset-chip" onclick="window.AppCalculators.category_1.discount_calc.setPreset(5)">5%</div>
                                    <div class="preset-chip" onclick="window.AppCalculators.category_1.discount_calc.setPreset(10)">10%</div>
                                    <div class="preset-chip" onclick="window.AppCalculators.category_1.discount_calc.setPreset(20)">20%</div>
                                    <div class="preset-chip" onclick="window.AppCalculators.category_1.discount_calc.setPreset(50)">50%</div>
                                </div>
                            </div>

                            <div class="disc-input-group">
                                <label>Extra Discount (%) <small style="color:#999; font-weight:normal;">(Stacked)</small></label>
                                <div class="input-with-icon">
                                    <i class="fas fa-layer-group"></i>
                                    <input type="number" id="d-disc2" placeholder="0" oninput="window.AppCalculators.category_1.discount_calc.calculate()">
                                </div>
                            </div>

                            <div class="disc-input-group">
                                <label>Sales Tax (%)</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-university"></i>
                                    <input type="number" id="d-tax" placeholder="0" oninput="window.AppCalculators.category_1.discount_calc.calculate()">
                                </div>
                            </div>
                        </div>

                        <div id="input-rev" style="display:none;">
                            <div class="disc-input-group">
                                <label>Final Price Paid</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-coins"></i>
                                    <input type="number" id="r-final" placeholder="0.00" oninput="window.AppCalculators.category_1.discount_calc.calculateReverse()">
                                </div>
                            </div>
                            <div class="disc-input-group">
                                <label>Discount Applied (%)</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-percent"></i>
                                    <input type="number" id="r-disc" placeholder="0" oninput="window.AppCalculators.category_1.discount_calc.calculateReverse()">
                                </div>
                            </div>
                            <div class="disc-input-group">
                                <label>Tax Included (%)</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-university"></i>
                                    <input type="number" id="r-tax" placeholder="0" oninput="window.AppCalculators.category_1.discount_calc.calculateReverse()">
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="disc-receipt-panel">
                        <div class="receipt">
                            <div class="receipt-header">
                                <h3>Receipt</h3>
                                <div style="font-size:0.75rem; color:#888; margin-top:5px; letter-spacing:1px;">TRANSACTION SUMMARY</div>
                            </div>

                            <div id="receipt-content">
                                <div class="receipt-row"><span>Original Price</span><span>0.00</span></div>
                                <div class="receipt-row total"><span>Total</span><span>0.00</span></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
  },

  init: function () {
    this.setMode("standard");
  },

  setMode: function (mode) {
    this.currentMode = mode;
    const btnStd = document.getElementById("btn-mode-std");
    const btnRev = document.getElementById("btn-mode-rev");
    const divStd = document.getElementById("input-std");
    const divRev = document.getElementById("input-rev");

    if (mode === "standard") {
      btnStd.classList.add("active");
      btnRev.classList.remove("active");
      divStd.style.display = "block";
      divRev.style.display = "none";
      this.calculate();
    } else {
      btnStd.classList.remove("active");
      btnRev.classList.add("active");
      divStd.style.display = "none";
      divRev.style.display = "block";
      this.calculateReverse();
    }
  },

  setPreset: function (val) {
    document.getElementById("d-disc1").value = val;
    this.calculate();
  },

  // --- LOGIC: STANDARD MODE ---
  calculate: function () {
    const price = parseFloat(document.getElementById("d-price").value) || 0;
    const d1 = parseFloat(document.getElementById("d-disc1").value) || 0;
    const d2 = parseFloat(document.getElementById("d-disc2").value) || 0;
    const tax = parseFloat(document.getElementById("d-tax").value) || 0;

    // 1. Base
    const baseTotal = price;

    // 2. Discount 1
    const discountAmount1 = baseTotal * (d1 / 100);
    let afterD1 = baseTotal - discountAmount1;

    // 3. Discount 2 (Stacked)
    const discountAmount2 = afterD1 * (d2 / 100);
    let afterD2 = afterD1 - discountAmount2;

    const totalDiscount = discountAmount1 + discountAmount2;

    // 4. Tax (on final discounted price)
    const taxAmount = afterD2 * (tax / 100);
    const finalTotal = afterD2 + taxAmount;

    this.updateReceipt({
      label1: "Original Price",
      val1: baseTotal,
      label2: "Discount",
      val2: -totalDiscount,
      label3: "Tax (" + tax + "%)",
      val3: taxAmount,
      total: finalTotal,
      saved: totalDiscount,
    });
  },

  // --- LOGIC: REVERSE MODE ---
  calculateReverse: function () {
    const final = parseFloat(document.getElementById("r-final").value) || 0;
    const disc = parseFloat(document.getElementById("r-disc").value) || 0;
    const tax = parseFloat(document.getElementById("r-tax").value) || 0;

    // Formula: Final = Original * (1 - disc) * (1 + tax)
    // Original = Final / ((1+tax) * (1-disc))
    const taxFactor = 1 + tax / 100;
    const discFactor = 1 - disc / 100;

    let original = 0;
    if (discFactor !== 0) {
      original = final / (taxFactor * discFactor);
    }

    const priceBeforeTax = final / taxFactor;
    const taxAmt = final - priceBeforeTax;

    // The discount amount is effectively (Original - PriceBeforeTax)
    // But strictly, Original * (1-d) = PriceBeforeTax
    // So Discount = Original - PriceBeforeTax
    const discountAmt = original - priceBeforeTax;

    this.updateReceipt({
      label1: "Original Price",
      val1: original,
      label2: "Discount (" + disc + "%)",
      val2: -discountAmt,
      label3: "Tax Included",
      val3: taxAmt,
      total: final,
      saved: discountAmt,
      isReverse: true,
    });
  },

  updateReceipt: function (data) {
    const container = document.getElementById("receipt-content");

    let html = `
            <div class="receipt-row">
                <span>${data.label1}</span>
                <span>${data.val1.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</span>
            </div>
        `;

    if (Math.abs(data.val2) > 0.01) {
      html += `
                <div class="receipt-row highlight">
                    <span>${data.label2}</span>
                    <span>${data.val2.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</span>
                </div>
            `;
    }

    if (Math.abs(data.val3) > 0.01) {
      html += `
                <div class="receipt-row">
                    <span>${data.label3}</span>
                    <span>${data.val3.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</span>
                </div>
            `;
    }

    html += `
            <div class="receipt-row total">
                <span>Payable</span>
                <span>${data.total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</span>
            </div>
        `;

    if (data.saved > 0.01) {
      const pct =
        data.val1 > 0 ? ((data.saved / data.val1) * 100).toFixed(1) : 0;
      html += `
                <div class="receipt-row savings">
                    YOU SAVE: ${data.saved.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} (${pct}%)
                </div>
            `;
    }

    container.innerHTML = html;
  },
};
