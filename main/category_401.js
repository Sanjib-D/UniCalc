if (!window.AppCalculators.category_4) window.AppCalculators.category_4 = {};

window.AppCalculators.category_4.tip_calc = {
    name: "Tip & Split Bill",
    id: "tip_calc",
    
    state: {
        bill: 0,
        tipValue: 15,
        tipType: 'percent', // 'percent' or 'fixed'
        people: 2,
        splitMode: 'equal', // 'equal' or 'custom'
        taxRate: 0,
        serviceCharge: 0,
        rounding: 'none', // 'none', 'up', 'down'
        currency: '$',
        customShares: [1, 1] // Weights for custom split
    },

    getHtml: function() {
        return `
        <div class="tip-calc-wrapper">
            <div class="tip-grid">
                <div class="tip-input-panel">
                    
                    <div class="tip-group">
                        <label>Bill Amount</label>
                        <div class="input-with-icon">
                            <span class="curr-icon" id="curr-display-icon">$</span>
                            <input type="number" id="tip-bill-amount" placeholder="0.00" step="0.01" min="0">
                        </div>
                    </div>

                    <div class="tip-group">
                        <div class="flex-label">
                            <label>Tip</label>
                            <div class="tip-toggle">
                                <span class="tt-opt active" data-type="percent">%</span>
                                <span class="tt-opt" data-type="fixed">$</span>
                            </div>
                        </div>
                        <div class="tip-grid-btns" id="tip-percent-btns">
                            <button class="tip-btn active" data-val="10">10%</button>
                            <button class="tip-btn" data-val="15">15%</button>
                            <button class="tip-btn" data-val="20">20%</button>
                            <div class="custom-tip-input">
                                <input type="number" id="tip-custom-val" placeholder="Custom" min="0">
                            </div>
                        </div>
                    </div>

                    <div class="tip-group">
                        <label>Number of People</label>
                        <div class="people-counter">
                            <button id="p-minus"><i class="fas fa-minus"></i></button>
                            <input type="number" id="tip-people-count" value="2" min="1" max="50">
                            <button id="p-plus"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>

                    <div class="tip-group">
                        <label>Split Method</label>
                        <div class="split-mode-switch">
                            <button class="sm-btn active" data-mode="equal">Equal Split</button>
                            <button class="sm-btn" data-mode="custom">Uneven Split</button>
                        </div>
                    </div>

                    <div id="custom-split-container" style="display:none;">
                        <label>Adjust Shares (Weights)</label>
                        <div id="custom-split-list" class="custom-split-list"></div>
                        <small class="hint-text">Use ratios (e.g., 1 for everyone, 2 for someone paying double).</small>
                    </div>

                    <div class="adv-toggle" id="adv-toggle-btn">
                        <span>Advanced Options (Tax, Service, Rounding)</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>

                    <div class="adv-section" id="adv-section" style="display:none;">
                        <div class="row-split">
                            <div class="form-group">
                                <label>Tax Rate (%)</label>
                                <input type="number" id="tip-tax" placeholder="0" min="0">
                            </div>
                            <div class="form-group">
                                <label>Service Charge</label>
                                <input type="number" id="tip-service" placeholder="0" min="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Currency Symbol</label>
                            <select id="tip-currency" class="tip-select">
                                <option value="$">$ (USD/AUD)</option>
                                <option value="€">€ (EUR)</option>
                                <option value="£">£ (GBP)</option>
                                <option value="₹">₹ (INR)</option>
                                <option value="¥">¥ (JPY)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Rounding</label>
                            <div class="rounding-opts">
                                <button class="rnd-btn active" data-rnd="none">None</button>
                                <button class="rnd-btn" data-rnd="up">Up</button>
                                <button class="rnd-btn" data-rnd="down">Down</button>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="tip-result-panel">
                    <div class="receipt-paper">
                        <div class="receipt-header">
                            <h3>Bill Receipt</h3>
                            <div class="receipt-date" id="receipt-date"></div>
                        </div>
                        
                        <div class="receipt-body">
                            <div class="r-row">
                                <span>Bill Amount</span>
                                <span id="r-bill">0.00</span>
                            </div>
                            <div class="r-row">
                                <span>Tax & Fees</span>
                                <span id="r-tax">0.00</span>
                            </div>
                            <div class="r-row highlight">
                                <span>Tip Amount</span>
                                <span id="r-tip">0.00</span>
                            </div>
                            <div class="r-divider"></div>
                            <div class="r-row total">
                                <span>Grand Total</span>
                                <span id="r-total">0.00</span>
                            </div>
                        </div>

                        <div class="receipt-split-section">
                            <div class="split-header">
                                <span>Amount Per Person</span>
                                <span class="person-count-badge"><i class="fas fa-user"></i> <span id="r-p-count">2</span></span>
                            </div>
                            <div class="big-price" id="r-per-person">0.00</div>
                            <div id="r-custom-details" style="display:none; margin-top:10px;">
                                <small>See breakdown below</small>
                            </div>
                        </div>

                        <div class="receipt-footer">
                            <button id="tip-reset-btn"><i class="fas fa-redo"></i> Reset</button>
                            <button id="tip-share-btn"><i class="fas fa-copy"></i> Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.updateDate();
        this.reCalc(); // Initial calc
    },

    cacheDOM: function() {
        this.dom = {
            bill: document.getElementById('tip-bill-amount'),
            customTip: document.getElementById('tip-custom-val'),
            people: document.getElementById('tip-people-count'),
            tax: document.getElementById('tip-tax'),
            service: document.getElementById('tip-service'),
            currency: document.getElementById('tip-currency'),
            customSplitList: document.getElementById('custom-split-list'),
            customSplitCont: document.getElementById('custom-split-container'),
            advSection: document.getElementById('adv-section'),
            advToggle: document.getElementById('adv-toggle-btn'),
            
            // Outputs
            rBill: document.getElementById('r-bill'),
            rTax: document.getElementById('r-tax'),
            rTip: document.getElementById('r-tip'),
            rTotal: document.getElementById('r-total'),
            rPerPerson: document.getElementById('r-per-person'),
            rPCount: document.getElementById('r-p-count'),
            rCustomDet: document.getElementById('r-custom-details'),
            currIcon: document.getElementById('curr-display-icon')
        };
    },

    bindEvents: function() {
        const self = this;

        // Bill Input
        this.dom.bill.addEventListener('input', (e) => {
            this.state.bill = parseFloat(e.target.value) || 0;
            this.reCalc();
        });

        // Tip Type Toggle
        document.querySelectorAll('.tt-opt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tt-opt').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.state.tipType = e.target.dataset.type;
                this.updateTipUI();
                this.reCalc();
            });
        });

        // Tip Buttons
        document.querySelectorAll('.tip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.state.tipValue = parseFloat(e.target.dataset.val);
                this.dom.customTip.value = ''; // clear custom
                this.reCalc();
            });
        });

        // Custom Tip Input
        this.dom.customTip.addEventListener('input', (e) => {
            document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
            this.state.tipValue = parseFloat(e.target.value) || 0;
            this.reCalc();
        });

        // People Counter
        document.getElementById('p-minus').addEventListener('click', () => this.updatePeople(-1));
        document.getElementById('p-plus').addEventListener('click', () => this.updatePeople(1));
        this.dom.people.addEventListener('input', (e) => {
            let val = parseInt(e.target.value) || 1;
            if(val < 1) val = 1;
            this.state.people = val;
            this.renderCustomSplitInputs();
            this.reCalc();
        });

        // Split Mode
        document.querySelectorAll('.sm-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.sm-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.state.splitMode = e.target.dataset.mode;
                
                if (this.state.splitMode === 'custom') {
                    this.dom.customSplitCont.style.display = 'block';
                    this.renderCustomSplitInputs();
                } else {
                    this.dom.customSplitCont.style.display = 'none';
                }
                this.reCalc();
            });
        });

        // Advanced Options
        this.dom.advToggle.addEventListener('click', () => {
            const isHidden = this.dom.advSection.style.display === 'none';
            this.dom.advSection.style.display = isHidden ? 'block' : 'none';
            this.dom.advToggle.querySelector('i').style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        });

        this.dom.tax.addEventListener('input', (e) => {
            this.state.taxRate = parseFloat(e.target.value) || 0;
            this.reCalc();
        });

        this.dom.service.addEventListener('input', (e) => {
            this.state.serviceCharge = parseFloat(e.target.value) || 0;
            this.reCalc();
        });

        this.dom.currency.addEventListener('change', (e) => {
            this.state.currency = e.target.value;
            this.dom.currIcon.innerText = this.state.currency;
            this.reCalc();
        });

        // Rounding
        document.querySelectorAll('.rnd-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.rnd-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.state.rounding = e.target.dataset.rnd;
                this.reCalc();
            });
        });

        // Footer Actions
        document.getElementById('tip-reset-btn').addEventListener('click', () => this.reset());
        document.getElementById('tip-share-btn').addEventListener('click', () => this.copyToClipboard());
    },

    updatePeople: function(change) {
        let newVal = this.state.people + change;
        if (newVal < 1) newVal = 1;
        this.state.people = newVal;
        this.dom.people.value = newVal;
        this.renderCustomSplitInputs();
        this.reCalc();
    },

    updateTipUI: function() {
        const input = this.dom.customTip;
        if (this.state.tipType === 'percent') {
            input.placeholder = "Custom %";
            document.querySelectorAll('.tip-btn').forEach(b => {
                b.textContent = b.dataset.val + '%';
            });
        } else {
            input.placeholder = "Custom $";
            document.querySelectorAll('.tip-btn').forEach(b => {
                b.textContent = '$' + b.dataset.val; // Simplified for UI
            });
        }
    },

    renderCustomSplitInputs: function() {
        if (this.state.splitMode !== 'custom') return;
        
        // Resize customShares array
        while (this.state.customShares.length < this.state.people) {
            this.state.customShares.push(1);
        }
        this.state.customShares.length = this.state.people;

        this.dom.customSplitList.innerHTML = '';
        
        this.state.customShares.forEach((val, idx) => {
            const div = document.createElement('div');
            div.className = 'custom-share-row';
            div.innerHTML = `
                <span class="share-label">Person ${idx + 1}</span>
                <input type="number" class="share-input" data-idx="${idx}" value="${val}" min="0" step="0.5">
            `;
            this.dom.customSplitList.appendChild(div);
        });

        // Bind events to new inputs
        this.dom.customSplitList.querySelectorAll('.share-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                const val = parseFloat(e.target.value) || 0;
                this.state.customShares[idx] = val;
                this.reCalc();
            });
        });
    },

    reCalc: function() {
        const s = this.state;
        const currency = s.currency;

        // 1. Calculate Tax & Service
        let taxAmount = 0;
        if (s.taxRate > 0) {
            taxAmount = s.bill * (s.taxRate / 100);
        }
        
        // 2. Calculate Tip
        let tipAmount = 0;
        if (s.tipType === 'percent') {
            tipAmount = s.bill * (s.tipValue / 100);
        } else {
            tipAmount = s.tipValue;
        }

        const fees = taxAmount + s.serviceCharge;
        const grandTotal = s.bill + fees + tipAmount;

        // 3. Update Receipt Summary
        this.dom.rBill.innerText = currency + s.bill.toFixed(2);
        this.dom.rTax.innerText = currency + fees.toFixed(2);
        this.dom.rTip.innerText = currency + tipAmount.toFixed(2);
        this.dom.rTotal.innerText = currency + grandTotal.toFixed(2);
        this.dom.rPCount.innerText = s.people;

        // 4. Split Logic
        if (s.splitMode === 'equal') {
            let perPerson = grandTotal / s.people;
            perPerson = this.applyRounding(perPerson);
            
            this.dom.rPerPerson.innerText = currency + perPerson.toFixed(2);
            this.dom.rCustomDet.style.display = 'none';
        } else {
            // Weighted Split
            const totalWeight = s.customShares.reduce((a, b) => a + b, 0);
            if (totalWeight === 0) {
                 this.dom.rPerPerson.innerText = "Error";
                 return;
            }

            // Show range or "Varies"
            this.dom.rPerPerson.innerText = "Varies";
            this.dom.rCustomDet.style.display = 'block';
            
            // Generate detailed breakdown string for copy
            let detailsHtml = '<div style="margin-top:5px; font-size:0.8rem; text-align:left;">';
            s.customShares.forEach((weight, idx) => {
                let share = (weight / totalWeight) * grandTotal;
                share = this.applyRounding(share);
                detailsHtml += `<div>Person ${idx+1}: <b>${currency}${share.toFixed(2)}</b></div>`;
            });
            detailsHtml += '</div>';
            this.dom.rCustomDet.innerHTML = detailsHtml;
        }
    },

    applyRounding: function(amount) {
        if (this.state.rounding === 'up') return Math.ceil(amount);
        if (this.state.rounding === 'down') return Math.floor(amount);
        return amount;
    },

    updateDate: function() {
        const now = new Date();
        document.getElementById('receipt-date').innerText = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    },

    reset: function() {
        this.state.bill = 0;
        this.state.tipValue = 15;
        this.state.people = 2;
        this.state.splitMode = 'equal';
        this.dom.bill.value = '';
        this.dom.people.value = 2;
        this.dom.customTip.value = '';
        
        // Reset buttons UI
        document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.tip-btn[data-val="15"]').classList.add('active');
        
        this.reCalc();
    },

    copyToClipboard: function() {
        const s = this.state;
        let text = `Bill Receipt\n`;
        text += `Total Bill: ${s.currency}${document.getElementById('r-total').innerText.replace(/[^0-9.]/g, '')}\n`;
        text += `Tip Included: ${s.currency}${document.getElementById('r-tip').innerText.replace(/[^0-9.]/g, '')}\n`;
        
        if (s.splitMode === 'equal') {
            text += `Split: Equal (${s.people} people)\n`;
            text += `Amount Per Person: ${document.getElementById('r-per-person').innerText}`;
        } else {
             text += `Split: Uneven (${s.people} people)\n`;
             // Add breakdown logic here if needed for text copy
             text += `See receipt for individual shares.`;
        }

        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('tip-share-btn');
            const original = btn.innerHTML;
            btn.innerHTML = `<i class="fas fa-check"></i> Copied`;
            setTimeout(() => btn.innerHTML = original, 2000);
        });
    }
};