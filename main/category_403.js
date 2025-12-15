if (!window.AppCalculators.category_4) window.AppCalculators.category_4 = {};

window.AppCalculators.category_4.bill_calc = {
    name: "Electricity Bill Estimator",
    id: "bill_calc",

    state: {
        mode: 'units', // 'units', 'appliance', 'meter'
        unitsConsumed: 0,
        billingPeriod: 'monthly',
        currency: '₹', 
        slabs: [
            { limit: 100, rate: 5.0 }, 
            { limit: 200, rate: 7.0 }, 
            { limit: Infinity, rate: 9.0 } 
        ],
        fixedCharge: 50,
        taxRate: 5, // %
        appliances: []
    },

    getHtml: function() {
        return `
        <div class="eb-calc-wrapper">
            <div class="eb-header-controls">
                <div class="eb-tabs">
                    <button class="eb-tab active" data-mode="units"><i class="fas fa-bolt"></i> Quick Bill</button>
                    <button class="eb-tab" data-mode="appliance"><i class="fas fa-tv"></i> Appliances</button>
                    <button class="eb-tab" data-mode="meter"><i class="fas fa-tachometer-alt"></i> Meter Reading</button>
                </div>
                <div class="eb-settings-btn" id="eb-settings-toggle">
                    <i class="fas fa-cog"></i> Tariff Settings
                </div>
            </div>

            <div class="eb-settings-panel" id="eb-settings-panel" style="display:none;">
                <h4><i class="fas fa-sliders-h"></i> Configure Tariff & Slabs</h4>
                <div class="eb-row-split">
                    <div class="eb-group">
                        <label>Currency Symbol</label>
                        <select id="eb-currency" class="eb-select">
                            <option value="₹">₹ (INR)</option>
                            <option value="$">$ (USD)</option>
                            <option value="€">€ (EUR)</option>
                            <option value="£">£ (GBP)</option>
                        </select>
                    </div>
                    <div class="eb-group">
                        <label>Default Fixed Charge</label>
                        <input type="number" id="eb-fixed-charge" value="50">
                    </div>
                    <div class="eb-group">
                        <label>Tax / Duty (%)</label>
                        <input type="number" id="eb-tax" value="5">
                    </div>
                </div>
                
                <div class="eb-slabs-container">
                    <label>Rate Slabs (Unit Range & Price)</label>
                    <div id="eb-slabs-list"></div>
                    <button class="eb-btn-small" id="eb-add-slab">+ Add Slab</button>
                </div>
                <button class="eb-btn-close-settings" id="eb-close-settings">Save & Close</button>
            </div>

            <div id="view-units" class="eb-view active">
                <div class="eb-card">
                    <div class="eb-group">
                        <label>Total Units Consumed (kWh)</label>
                        <input type="number" id="eb-input-units" placeholder="e.g. 250" class="eb-main-input">
                    </div>
                    
                    <div class="eb-divider-label"><span>Optional Manual Overrides</span></div>
                    <div class="eb-row-split">
                        <div class="eb-group">
                            <label>Avg. Rate / Unit <small>(Flat)</small></label>
                            <input type="number" id="eb-quick-rate" placeholder="Default: Slabs">
                        </div>
                        <div class="eb-group">
                            <label>Fixed Charge</label>
                            <input type="number" id="eb-quick-fixed" placeholder="Default: 50">
                        </div>
                    </div>
                    
                    <div class="eb-btn-row">
                        <button class="eb-btn-primary" id="btn-calc-units">Calculate Bill</button>
                    </div>
                </div>
            </div>

            <div id="view-appliance" class="eb-view">
                <div class="eb-appliance-manager">
                    <div class="eb-add-bar">
                        <select id="eb-app-select" class="eb-select-app">
                            <option value="" disabled selected>Select Appliance</option>
                            <option value="1000">AC (1 Ton)</option>
                            <option value="1500">AC (1.5 Ton)</option>
                            <option value="2000">Geyser</option>
                            <option value="150">Refrigerator</option>
                            <option value="70">Ceiling Fan</option>
                            <option value="10">LED Bulb</option>
                            <option value="100">TV (LED)</option>
                            <option value="200">Desktop Computer</option>
                            <option value="800">Microwave</option>
                            <option value="400">Washing Machine</option>
                            <option value="0">Custom...</option>
                        </select>
                        <button id="eb-add-app-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    
                    <div id="eb-app-list" class="eb-app-list">
                        <div class="eb-empty-state">No appliances added yet.</div>
                    </div>

                    <div class="eb-total-bar">
                        <span>Total Monthly Consumption:</span>
                        <strong id="eb-app-total-units">0 kWh</strong>
                    </div>

                    <button class="eb-btn-primary" id="btn-calc-app">Calculate Cost</button>
                </div>
            </div>

            <div id="view-meter" class="eb-view">
                <div class="eb-card">
                    <div class="eb-row-split">
                        <div class="eb-group">
                            <label>Previous Reading (kWh)</label>
                            <input type="number" id="eb-meter-prev" placeholder="0">
                        </div>
                        <div class="eb-group">
                            <label>Current Reading (kWh)</label>
                            <input type="number" id="eb-meter-curr" placeholder="0">
                        </div>
                    </div>
                    <div class="eb-group">
                        <div class="eb-info-box">
                            Units Consumed: <strong id="eb-meter-diff">0</strong> kWh
                        </div>
                    </div>
                    <button class="eb-btn-primary" id="btn-calc-meter">Calculate Bill</button>
                </div>
            </div>

            <div id="eb-result-section" class="eb-result-card" style="display:none;">
                <div class="eb-res-header">
                    <span class="eb-res-label">Estimated Monthly Bill</span>
                    <h2 id="eb-final-bill">0.00</h2>
                </div>

                <div class="eb-breakdown-grid">
                    <div class="eb-bd-item">
                        <small>Energy Charges</small>
                        <span id="eb-res-energy">0.00</span>
                    </div>
                    <div class="eb-bd-item">
                        <small>Fixed Charges</small>
                        <span id="eb-res-fixed">0.00</span>
                    </div>
                    <div class="eb-bd-item">
                        <small>Tax & Duty</small>
                        <span id="eb-res-tax">0.00</span>
                    </div>
                    <div class="eb-bd-item highlight">
                        <small>Avg Cost / Unit</small>
                        <span id="eb-res-avg">0.00</span>
                    </div>
                </div>

                <div class="eb-accordion" id="eb-slab-container">
                    <div class="eb-acc-header" id="eb-acc-toggle">
                        <span>View Slab Breakdown</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="eb-acc-body" id="eb-slab-breakdown" style="display:none;">
                        </div>
                </div>

                <div class="eb-viz-bar">
                    <div class="eb-bar-label">Cost Distribution</div>
                    <div class="eb-stacked-bar">
                        <div id="bar-energy" class="sb-seg energy" style="width:0%"></div>
                        <div id="bar-fixed" class="sb-seg fixed" style="width:0%"></div>
                        <div id="bar-tax" class="sb-seg tax" style="width:0%"></div>
                    </div>
                    <div class="eb-legend">
                        <span><i class="fas fa-circle" style="color:#3498db"></i> Energy</span>
                        <span><i class="fas fa-circle" style="color:#f1c40f"></i> Fixed</span>
                        <span><i class="fas fa-circle" style="color:#e74c3c"></i> Tax</span>
                    </div>
                </div>

                <div class="eb-actions-footer">
                     <button id="eb-btn-reset" class="eb-btn-sec"><i class="fas fa-redo"></i> Reset</button>
                     <button id="eb-btn-share" class="eb-btn-sec"><i class="fas fa-copy"></i> Copy Bill</button>
                </div>
            </div>
        </div>
        `;
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.renderSlabs();
        this.updateCurrencyUI();
    },

    cacheDOM: function() {
        this.dom = {
            tabs: document.querySelectorAll('.eb-tab'),
            views: document.querySelectorAll('.eb-view'),
            settingsToggle: document.getElementById('eb-settings-toggle'),
            settingsPanel: document.getElementById('eb-settings-panel'),
            closeSettings: document.getElementById('eb-close-settings'),
            
            // Settings Inputs
            currency: document.getElementById('eb-currency'),
            fixedCharge: document.getElementById('eb-fixed-charge'),
            tax: document.getElementById('eb-tax'),
            slabsList: document.getElementById('eb-slabs-list'),
            addSlabBtn: document.getElementById('eb-add-slab'),

            // Unit Mode
            inputUnits: document.getElementById('eb-input-units'),
            btnCalcUnits: document.getElementById('btn-calc-units'),
            quickRate: document.getElementById('eb-quick-rate'), // New
            quickFixed: document.getElementById('eb-quick-fixed'), // New

            // Appliance Mode
            appSelect: document.getElementById('eb-app-select'),
            addAppBtn: document.getElementById('eb-add-app-btn'),
            appList: document.getElementById('eb-app-list'),
            appTotalUnits: document.getElementById('eb-app-total-units'),
            btnCalcApp: document.getElementById('btn-calc-app'),

            // Meter Mode
            meterPrev: document.getElementById('eb-meter-prev'),
            meterCurr: document.getElementById('eb-meter-curr'),
            meterDiff: document.getElementById('eb-meter-diff'),
            btnCalcMeter: document.getElementById('btn-calc-meter'),

            // Results
            resSection: document.getElementById('eb-result-section'),
            resFinal: document.getElementById('eb-final-bill'),
            resEnergy: document.getElementById('eb-res-energy'),
            resFixed: document.getElementById('eb-res-fixed'),
            resTax: document.getElementById('eb-res-tax'),
            resAvg: document.getElementById('eb-res-avg'),
            
            slabContainer: document.getElementById('eb-slab-container'),
            accToggle: document.getElementById('eb-acc-toggle'),
            slabBreakdown: document.getElementById('eb-slab-breakdown'),
            
            barEnergy: document.getElementById('bar-energy'),
            barFixed: document.getElementById('bar-fixed'),
            barTax: document.getElementById('bar-tax'),

            btnReset: document.getElementById('eb-btn-reset'),
            btnShare: document.getElementById('eb-btn-share')
        };
    },

    bindEvents: function() {
        // Tabs
        this.dom.tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                this.dom.tabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.mode = btn.dataset.mode;
                
                this.dom.views.forEach(v => v.classList.remove('active'));
                document.getElementById('view-' + this.state.mode).classList.add('active');
                
                this.dom.resSection.style.display = 'none';
            });
        });

        // Settings Toggle
        this.dom.settingsToggle.addEventListener('click', () => {
            const isHidden = this.dom.settingsPanel.style.display === 'none';
            this.dom.settingsPanel.style.display = isHidden ? 'block' : 'none';
        });

        this.dom.closeSettings.addEventListener('click', () => {
            this.updateSettingsFromUI();
            this.dom.settingsPanel.style.display = 'none';
        });

        this.dom.addSlabBtn.addEventListener('click', () => {
            this.state.slabs.push({ limit: Infinity, rate: 0 });
            if(this.state.slabs.length > 1) {
                this.state.slabs[this.state.slabs.length - 2].limit = 100; 
            }
            this.renderSlabs();
        });

        // Calculation Triggers
        this.dom.btnCalcUnits.addEventListener('click', () => {
            const u = parseFloat(this.dom.inputUnits.value);
            if (u >= 0) this.calculateBill(u);
        });

        this.dom.btnCalcMeter.addEventListener('click', () => {
            const p = parseFloat(this.dom.meterPrev.value) || 0;
            const c = parseFloat(this.dom.meterCurr.value) || 0;
            if (c < p) { alert("Current reading cannot be less than previous."); return; }
            this.calculateBill(c - p);
        });

        this.dom.meterCurr.addEventListener('input', () => {
             const p = parseFloat(this.dom.meterPrev.value) || 0;
             const c = parseFloat(this.dom.meterCurr.value) || 0;
             if(c >= p) this.dom.meterDiff.innerText = (c - p).toFixed(1);
        });

        // Appliance Logic
        this.dom.addAppBtn.addEventListener('click', () => this.addAppliance());
        this.dom.btnCalcApp.addEventListener('click', () => {
            this.calculateApplianceTotal(); 
            const total = parseFloat(this.dom.appTotalUnits.innerText);
            this.calculateBill(total);
        });

        // Result Accordion
        this.dom.accToggle.addEventListener('click', () => {
            const isHidden = this.dom.slabBreakdown.style.display === 'none';
            this.dom.slabBreakdown.style.display = isHidden ? 'block' : 'none';
            this.dom.accToggle.querySelector('i').style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        });

        // Footer Actions
        this.dom.btnReset.addEventListener('click', () => this.resetAll());
        this.dom.btnShare.addEventListener('click', () => this.copyBill());
        
        this.dom.currency.addEventListener('change', () => {
            this.state.currency = this.dom.currency.value;
            this.updateCurrencyUI();
        });
    },

    renderSlabs: function() {
        this.dom.slabsList.innerHTML = '';
        this.state.slabs.forEach((slab, index) => {
            const isLast = index === this.state.slabs.length - 1;
            const div = document.createElement('div');
            div.className = 'eb-slab-row';
            div.innerHTML = `
                <div class="slab-idx">#${index + 1}</div>
                <div class="slab-inputs">
                    <span>Up to</span>
                    ${isLast ? 
                        `<input type="text" value="∞" disabled class="slab-inf">` : 
                        `<input type="number" class="slab-limit" data-idx="${index}" value="${slab.limit}">`
                    }
                    <span>units @</span>
                    <input type="number" class="slab-rate" data-idx="${index}" value="${slab.rate}">
                </div>
                ${this.state.slabs.length > 1 ? `<button class="slab-del" data-idx="${index}"><i class="fas fa-times"></i></button>` : ''}
            `;
            this.dom.slabsList.appendChild(div);
        });

        this.dom.slabsList.querySelectorAll('.slab-limit').forEach(el => {
            el.addEventListener('change', (e) => {
                this.state.slabs[e.target.dataset.idx].limit = parseFloat(e.target.value) || 0;
            });
        });
        this.dom.slabsList.querySelectorAll('.slab-rate').forEach(el => {
            el.addEventListener('change', (e) => {
                this.state.slabs[e.target.dataset.idx].rate = parseFloat(e.target.value) || 0;
            });
        });
        this.dom.slabsList.querySelectorAll('.slab-del').forEach(el => {
            el.addEventListener('click', (e) => {
                this.state.slabs.splice(e.currentTarget.dataset.idx, 1);
                this.renderSlabs();
            });
        });
    },

    updateSettingsFromUI: function() {
        this.state.currency = this.dom.currency.value;
        this.state.fixedCharge = parseFloat(this.dom.fixedCharge.value) || 0;
        this.state.taxRate = parseFloat(this.dom.tax.value) || 0;
    },

    updateCurrencyUI: function() {},

    addAppliance: function() {
        const select = this.dom.appSelect;
        const watts = parseFloat(select.value) || 0;
        let name = select.options[select.selectedIndex].text;
        
        if (name === "Select Appliance") return;
        if (name === "Custom...") name = "Custom Appliance";

        const appObj = {
            id: Date.now(),
            name: name,
            watts: watts,
            qty: 1,
            hours: 5
        };
        
        this.state.appliances.push(appObj);
        this.renderApplianceList();
    },

    renderApplianceList: function() {
        if (this.state.appliances.length === 0) {
            this.dom.appList.innerHTML = '<div class="eb-empty-state">No appliances added yet.</div>';
            this.dom.appTotalUnits.innerText = "0 kWh";
            return;
        }

        this.dom.appList.innerHTML = '';
        this.state.appliances.forEach((app, index) => {
            const div = document.createElement('div');
            div.className = 'eb-app-item';
            div.innerHTML = `
                <div class="app-info">
                    <strong>${app.name}</strong>
                    <div class="app-inputs">
                        <label>Watts:</label> <input type="number" class="app-watts" data-idx="${index}" value="${app.watts}">
                        <label>Qty:</label> <input type="number" class="app-qty" data-idx="${index}" value="${app.qty}">
                        <label>Hrs/Day:</label> <input type="number" class="app-hours" data-idx="${index}" value="${app.hours}">
                    </div>
                </div>
                <button class="app-del" data-idx="${index}"><i class="fas fa-trash"></i></button>
            `;
            this.dom.appList.appendChild(div);
        });

        this.dom.appList.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = e.target.dataset.idx;
                const val = parseFloat(e.target.value) || 0;
                if (e.target.classList.contains('app-watts')) this.state.appliances[idx].watts = val;
                if (e.target.classList.contains('app-qty')) this.state.appliances[idx].qty = val;
                if (e.target.classList.contains('app-hours')) this.state.appliances[idx].hours = val;
                this.calculateApplianceTotal();
            });
        });

        this.dom.appList.querySelectorAll('.app-del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.state.appliances.splice(e.currentTarget.dataset.idx, 1);
                this.renderApplianceList();
                this.calculateApplianceTotal();
            });
        });
        
        this.calculateApplianceTotal();
    },

    calculateApplianceTotal: function() {
        let dailyUnits = 0;
        this.state.appliances.forEach(app => {
            dailyUnits += (app.watts * app.qty * app.hours) / 1000;
        });
        const monthlyUnits = dailyUnits * 30;
        this.dom.appTotalUnits.innerText = monthlyUnits.toFixed(1) + " kWh";
        return monthlyUnits;
    },

    calculateBill: function(units) {
        this.state.unitsConsumed = units;
        const s = this.state;
        let energyCharge = 0;
        let appliedFixedCharge = s.fixedCharge;
        let breakdownHTML = '<table class="eb-bd-table"><tr><th>Slab</th><th>Units</th><th>Rate</th><th>Cost</th></tr>';
        
        // Check for Quick Overrides (Only in Units mode, or if values exist)
        let flatRate = parseFloat(this.dom.quickRate.value);
        let overrideFixed = parseFloat(this.dom.quickFixed.value);
        let useFlatRate = !isNaN(flatRate) && flatRate > 0;

        if (!isNaN(overrideFixed)) {
            appliedFixedCharge = overrideFixed;
        }

        if (useFlatRate) {
            // Flat Rate Calculation
            energyCharge = units * flatRate;
            this.dom.slabContainer.style.display = 'none'; // Hide slab accordion
        } else {
            // Slab Calculation Logic
            this.dom.slabContainer.style.display = 'block';
            let remaining = units;
            let previousLimit = 0;
            
            s.slabs.forEach((slab) => {
                if (remaining <= 0) return;
                let slabSize = (slab.limit === Infinity) ? remaining : (slab.limit - previousLimit);
                let unitsInSlab = Math.min(remaining, slabSize);
                let costInSlab = unitsInSlab * slab.rate;
                
                energyCharge += costInSlab;
                remaining -= unitsInSlab;
                previousLimit = slab.limit;

                breakdownHTML += `
                    <tr>
                        <td>${slab.limit === Infinity ? '> ' + (previousLimit - slabSize) : (previousLimit - slabSize) + '-' + slab.limit}</td>
                        <td>${unitsInSlab.toFixed(1)}</td>
                        <td>${s.currency}${slab.rate}</td>
                        <td>${s.currency}${costInSlab.toFixed(2)}</td>
                    </tr>
                `;
            });
            breakdownHTML += '</table>';
            this.dom.slabBreakdown.innerHTML = breakdownHTML;
        }

        // Taxes & Totals
        const taxAmount = energyCharge * (s.taxRate / 100);
        const totalBill = energyCharge + appliedFixedCharge + taxAmount;
        const avgCost = units > 0 ? (totalBill / units) : 0;

        // Render Results
        this.dom.resEnergy.innerText = s.currency + energyCharge.toFixed(2);
        this.dom.resFixed.innerText = s.currency + appliedFixedCharge.toFixed(2);
        this.dom.resTax.innerText = s.currency + taxAmount.toFixed(2);
        this.dom.resFinal.innerText = s.currency + Math.round(totalBill).toFixed(2);
        this.dom.resAvg.innerText = s.currency + avgCost.toFixed(2);

        // Visual Bars
        const totalForBar = energyCharge + appliedFixedCharge + taxAmount;
        if(totalForBar > 0) {
            this.dom.barEnergy.style.width = ((energyCharge / totalForBar) * 100) + '%';
            this.dom.barFixed.style.width = ((appliedFixedCharge / totalForBar) * 100) + '%';
            this.dom.barTax.style.width = ((taxAmount / totalForBar) * 100) + '%';
        }

        this.dom.resSection.style.display = 'block';
        this.dom.resSection.scrollIntoView({behavior: 'smooth'});
    },

    resetAll: function() {
        this.dom.inputUnits.value = '';
        this.dom.meterPrev.value = '';
        this.dom.meterCurr.value = '';
        this.dom.quickRate.value = '';
        this.dom.quickFixed.value = '';
        this.dom.meterDiff.innerText = '0';
        this.state.appliances = [];
        this.renderApplianceList();
        this.dom.resSection.style.display = 'none';
    },

    copyBill: function() {
        const t = `Electricity Bill Estimate\n` +
                  `Units: ${this.state.unitsConsumed.toFixed(1)} kWh\n` +
                  `Total: ${this.dom.resFinal.innerText}\n` +
                  `Energy: ${this.dom.resEnergy.innerText}, Fixed: ${this.dom.resFixed.innerText}, Tax: ${this.dom.resTax.innerText}`;
        navigator.clipboard.writeText(t).then(() => {
            const btn = this.dom.btnShare;
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied';
            setTimeout(() => btn.innerHTML = orig, 1500);
        });
    }
};