if (!window.AppCalculators.category_4) window.AppCalculators.category_4 = {};

window.AppCalculators.category_4.fuel_calc = {
    name: "Fuel Cost & Mileage",
    id: "fuel_calc",

    // Default State
    state: {
        mode: 'cost', // 'cost', 'mileage', 'compare'
        units: 'metric', // 'metric' (km, L, km/L) or 'imperial' (mi, gal, mpg)
        currency: '$',
        history: JSON.parse(localStorage.getItem('fuel_calc_history')) || []
    },

    getHtml: function() {
        return `
        <div class="fuel-calc-wrapper">
            <div class="fuel-header-controls">
                <div class="fuel-tabs">
                    <button class="ft-tab active" data-mode="cost"><i class="fas fa-route"></i> Trip Cost</button>
                    <button class="ft-tab" data-mode="mileage"><i class="fas fa-tachometer-alt"></i> Check Mileage</button>
                    <button class="ft-tab" data-mode="compare"><i class="fas fa-balance-scale"></i> Compare</button>
                </div>
                <div class="fuel-unit-toggle">
                    <span class="u-tog active" data-unit="metric">Metric (km/L)</span>
                    <span class="u-tog" data-unit="imperial">Imperial (MPG)</span>
                </div>
            </div>

            <div id="view-cost" class="fuel-view active">
                <div class="fuel-grid">
                    <div class="fuel-input-card">
                        <div class="fuel-group">
                            <label>Distance <span class="unit-dist">(km)</span></label>
                            <div class="input-with-toggle">
                                <input type="number" id="fc-dist" placeholder="0" min="0">
                                <div class="toggle-btn" id="fc-roundtrip-btn">
                                    <i class="fas fa-exchange-alt"></i> Round Trip
                                </div>
                            </div>
                        </div>

                        <div class="fuel-group">
                            <label>Fuel Efficiency <span class="unit-eff">(km/L)</span></label>
                            <input type="number" id="fc-eff" placeholder="e.g. 15" min="0.1">
                            <div class="vehicle-presets">
                                <span data-val="50">Bike</span>
                                <span data-val="15">Car</span>
                                <span data-val="10">SUV</span>
                                <span data-val="4">Truck</span>
                            </div>
                        </div>

                        <div class="fuel-group">
                            <label>Fuel Price <span class="unit-curr-vol">($/L)</span></label>
                            <input type="number" id="fc-price" placeholder="0.00" step="0.01">
                        </div>
                        
                        <div class="fuel-actions">
                            <button class="fuel-btn-primary" id="btn-calc-cost">Calculate Cost</button>
                            <button class="fuel-btn-sec" id="btn-clear-cost">Clear</button>
                        </div>
                    </div>

                    <div class="fuel-result-card" id="res-card-cost" style="display:none;">
                        <h3>Trip Summary</h3>
                        <div class="fuel-big-res">
                            <span class="curr-symbol">$</span><span id="res-total-cost">0.00</span>
                            <small>Total Fuel Cost</small>
                        </div>
                        
                        <div class="fuel-stats-grid">
                            <div class="fs-item">
                                <i class="fas fa-gas-pump"></i>
                                <span id="res-fuel-req">0</span> <span class="unit-vol">L</span>
                                <label>Fuel Needed</label>
                            </div>
                            <div class="fs-item">
                                <i class="fas fa-road"></i>
                                <span class="curr-symbol">$</span><span id="res-cost-km">0.00</span>
                                <label>Cost per <span class="unit-dist-s">km</span></label>
                            </div>
                        </div>

                        <div class="fuel-history-actions">
                            <button id="btn-save-trip"><i class="fas fa-save"></i> Save Trip</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="view-mileage" class="fuel-view">
                <div class="fuel-grid">
                    <div class="fuel-input-card">
                         <div class="fuel-group">
                            <label>Distance Method</label>
                            <div class="switch-box">
                                <span class="sw-opt active" data-m="dist">Distance</span>
                                <span class="sw-opt" data-m="odo">Odometer</span>
                            </div>
                        </div>

                        <div id="input-method-dist">
                            <div class="fuel-group">
                                <label>Distance Traveled <span class="unit-dist">(km)</span></label>
                                <input type="number" id="mc-dist" placeholder="0" min="0">
                            </div>
                        </div>

                        <div id="input-method-odo" style="display:none;">
                            <div class="row-split">
                                <div class="fuel-group">
                                    <label>Start Odo</label>
                                    <input type="number" id="mc-odo-start" placeholder="0">
                                </div>
                                <div class="fuel-group">
                                    <label>End Odo</label>
                                    <input type="number" id="mc-odo-end" placeholder="0">
                                </div>
                            </div>
                        </div>

                        <div class="fuel-group">
                            <label>Fuel Consumed <span class="unit-vol">(L)</span></label>
                            <input type="number" id="mc-fuel" placeholder="0" min="0">
                        </div>

                        <div class="fuel-group">
                            <label>Total Cost (Optional)</label>
                            <input type="number" id="mc-cost" placeholder="0.00">
                        </div>

                        <button class="fuel-btn-primary" id="btn-calc-mileage">Calculate Mileage</button>
                    </div>

                    <div class="fuel-result-card" id="res-card-mileage" style="display:none;">
                        <h3>Vehicle Efficiency</h3>
                        <div class="gauge-wrapper">
                            <div class="mileage-score" id="res-eff-score">0</div>
                            <span class="unit-eff">km/L</span>
                        </div>
                        <div class="fuel-stats-grid">
                            <div class="fs-item">
                                <label>Cost / <span class="unit-dist-s">km</span></label>
                                <span class="curr-symbol">$</span><span id="res-mc-cpk">--</span>
                            </div>
                            <div class="fs-item">
                                <label>Range (Est)</label>
                                <span id="res-mc-range">--</span> <span class="unit-dist-s">km</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="view-compare" class="fuel-view">
                <div class="compare-container">
                    <div class="compare-col">
                        <h4>Vehicle A</h4>
                        <div class="fuel-group">
                            <label>Mileage <span class="unit-eff">(km/L)</span></label>
                            <input type="number" id="cmp-eff-a" placeholder="15">
                        </div>
                        <div class="fuel-group">
                            <label>Fuel Type Price</label>
                            <input type="number" id="cmp-price-a" placeholder="Price A">
                        </div>
                    </div>
                    
                    <div class="compare-center">
                        <div class="fuel-group">
                            <label>Trip Dist <span class="unit-dist">(km)</span></label>
                            <input type="number" id="cmp-dist" value="100">
                        </div>
                        <button class="fuel-btn-small" id="btn-calc-cmp">Compare</button>
                    </div>

                    <div class="compare-col">
                        <h4>Vehicle B</h4>
                        <div class="fuel-group">
                            <label>Mileage <span class="unit-eff">(km/L)</span></label>
                            <input type="number" id="cmp-eff-b" placeholder="10">
                        </div>
                        <div class="fuel-group">
                            <label>Fuel Type Price</label>
                            <input type="number" id="cmp-price-b" placeholder="Price B">
                        </div>
                    </div>
                </div>

                <div class="compare-results" id="res-compare" style="display:none;">
                    <div class="cmp-res-row">
                        <div class="cmp-val" id="res-cmp-a">$0.00</div>
                        <div class="cmp-label">Total Cost</div>
                        <div class="cmp-val" id="res-cmp-b">$0.00</div>
                    </div>
                    <div class="cmp-diff-box">
                        Difference: <span id="res-cmp-diff">$0.00</span>
                        <small id="res-cmp-msg">Vehicle A is cheaper</small>
                    </div>
                </div>
            </div>

            <div class="fuel-history-section">
                <div class="fh-header" id="hist-toggle">
                    <span>Recent Calculations</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="fh-list" id="fuel-hist-list" style="display:none;"></div>
            </div>
        </div>
        `;
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.updateUnits();
        this.renderHistory();
    },

    cacheDOM: function() {
        this.dom = {
            // Toggles
            modeTabs: document.querySelectorAll('.ft-tab'),
            unitToggles: document.querySelectorAll('.u-tog'),
            views: document.querySelectorAll('.fuel-view'),
            
            // Cost View Inputs
            dist: document.getElementById('fc-dist'),
            eff: document.getElementById('fc-eff'),
            price: document.getElementById('fc-price'),
            roundTripBtn: document.getElementById('fc-roundtrip-btn'),
            
            // Mileage View Inputs
            mDist: document.getElementById('mc-dist'),
            mOdoStart: document.getElementById('mc-odo-start'),
            mOdoEnd: document.getElementById('mc-odo-end'),
            mFuel: document.getElementById('mc-fuel'),
            mCost: document.getElementById('mc-cost'),
            mSwitch: document.querySelectorAll('.sw-opt'),
            mInputDist: document.getElementById('input-method-dist'),
            mInputOdo: document.getElementById('input-method-odo'),
            
            // Compare Inputs
            cmpEffA: document.getElementById('cmp-eff-a'),
            cmpPriceA: document.getElementById('cmp-price-a'),
            cmpEffB: document.getElementById('cmp-eff-b'),
            cmpPriceB: document.getElementById('cmp-price-b'),
            cmpDist: document.getElementById('cmp-dist'),

            // Outputs
            resCardCost: document.getElementById('res-card-cost'),
            resTotalCost: document.getElementById('res-total-cost'),
            resFuelReq: document.getElementById('res-fuel-req'),
            resCostKm: document.getElementById('res-cost-km'),
            
            resCardMileage: document.getElementById('res-card-mileage'),
            resEffScore: document.getElementById('res-eff-score'),
            resMcCpk: document.getElementById('res-mc-cpk'),
            resMcRange: document.getElementById('res-mc-range'),

            resCompare: document.getElementById('res-compare'),
            resCmpA: document.getElementById('res-cmp-a'),
            resCmpB: document.getElementById('res-cmp-b'),
            resCmpDiff: document.getElementById('res-cmp-diff'),
            resCmpMsg: document.getElementById('res-cmp-msg'),

            // History
            histList: document.getElementById('fuel-hist-list'),
            histToggle: document.getElementById('hist-toggle'),
            
            // Unit Spans
            uDist: document.querySelectorAll('.unit-dist'),
            uDistS: document.querySelectorAll('.unit-dist-s'),
            uVol: document.querySelectorAll('.unit-vol'),
            uEff: document.querySelectorAll('.unit-eff'),
            uCurrVol: document.querySelectorAll('.unit-curr-vol'),
            uCurr: document.querySelectorAll('.curr-symbol')
        };
    },

    bindEvents: function() {
        const self = this;

        // Mode Switching
        this.dom.modeTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                this.dom.modeTabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.dom.views.forEach(v => v.classList.remove('active'));
                document.getElementById('view-' + btn.dataset.mode).classList.add('active');
            });
        });

        // Unit Toggle
        this.dom.unitToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                this.dom.unitToggles.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.units = btn.dataset.unit;
                this.updateUnits();
                // Clear inputs to avoid unit confusion
                this.clearInputs();
            });
        });

        // Round Trip Toggle
        this.dom.roundTripBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            self.calculateCost();
        });

        // Vehicle Presets
        document.querySelectorAll('.vehicle-presets span').forEach(span => {
            span.addEventListener('click', () => {
                let val = parseFloat(span.dataset.val);
                // Convert preset if imperial
                if(this.state.units === 'imperial') {
                    // approx 1 km/l = 2.35 mpg
                    val = val * 2.352; 
                }
                this.dom.eff.value = val.toFixed(1);
                this.calculateCost();
            });
        });

        // Real-time Calc Cost
        ['input', 'change'].forEach(evt => {
            this.dom.dist.addEventListener(evt, () => this.calculateCost());
            this.dom.eff.addEventListener(evt, () => this.calculateCost());
            this.dom.price.addEventListener(evt, () => this.calculateCost());
        });

        // Mileage Input Method Switch
        this.dom.mSwitch.forEach(btn => {
            btn.addEventListener('click', () => {
                this.dom.mSwitch.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if(btn.dataset.m === 'dist') {
                    this.dom.mInputDist.style.display = 'block';
                    this.dom.mInputOdo.style.display = 'none';
                } else {
                    this.dom.mInputDist.style.display = 'none';
                    this.dom.mInputOdo.style.display = 'block';
                }
            });
        });

        // Calculate Buttons
        document.getElementById('btn-calc-cost').addEventListener('click', () => this.calculateCost(true));
        document.getElementById('btn-clear-cost').addEventListener('click', () => this.clearInputs());
        document.getElementById('btn-calc-mileage').addEventListener('click', () => this.calculateMileage());
        document.getElementById('btn-calc-cmp').addEventListener('click', () => this.calculateCompare());

        // History
        document.getElementById('btn-save-trip').addEventListener('click', () => this.saveToHistory());
        this.dom.histToggle.addEventListener('click', () => {
            const isHidden = this.dom.histList.style.display === 'none';
            this.dom.histList.style.display = isHidden ? 'block' : 'none';
            this.dom.histToggle.querySelector('i').style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    },

    updateUnits: function() {
        const u = this.state.units === 'metric';
        const txtDist = u ? '(km)' : '(mi)';
        const txtDistS = u ? 'km' : 'mi';
        const txtVol = u ? 'L' : 'gal';
        const txtEff = u ? 'km/L' : 'MPG';
        const txtCurrVol = u ? '($/L)' : '($/gal)';

        this.dom.uDist.forEach(e => e.innerText = txtDist);
        this.dom.uDistS.forEach(e => e.innerText = txtDistS);
        this.dom.uVol.forEach(e => e.innerText = txtVol);
        this.dom.uEff.forEach(e => e.innerText = txtEff);
        this.dom.uCurrVol.forEach(e => e.innerText = txtCurrVol);
    },

    clearInputs: function() {
        this.dom.dist.value = '';
        this.dom.eff.value = '';
        this.dom.price.value = '';
        this.dom.resCardCost.style.display = 'none';
    },

    calculateCost: function(scrollTo = false) {
        let dist = parseFloat(this.dom.dist.value);
        const eff = parseFloat(this.dom.eff.value);
        const price = parseFloat(this.dom.price.value);
        
        if(!dist || !eff || !price) return;

        // Handle Round Trip
        if(this.dom.roundTripBtn.classList.contains('active')) {
            dist *= 2;
        }

        const fuelReq = dist / eff;
        const totalCost = fuelReq * price;
        const cpk = totalCost / dist;

        this.dom.resTotalCost.innerText = totalCost.toFixed(2);
        this.dom.resFuelReq.innerText = fuelReq.toFixed(1);
        this.dom.resCostKm.innerText = cpk.toFixed(2);

        this.dom.resCardCost.style.display = 'block';
        if(scrollTo) this.dom.resCardCost.scrollIntoView({behavior: 'smooth'});
        
        this.tempResult = { dist, totalCost, fuelReq, date: new Date() };
    },

    calculateMileage: function() {
        let dist = 0;
        const isOdo = this.dom.mInputOdo.style.display !== 'none';

        if (isOdo) {
            const s = parseFloat(this.dom.mOdoStart.value);
            const e = parseFloat(this.dom.mOdoEnd.value);
            if(s && e) dist = e - s;
        } else {
            dist = parseFloat(this.dom.mDist.value);
        }

        const fuel = parseFloat(this.dom.mFuel.value);
        const cost = parseFloat(this.dom.mCost.value); // Optional

        if (!dist || !fuel || dist <= 0 || fuel <= 0) {
            alert("Please enter valid distance and fuel consumed.");
            return;
        }

        const efficiency = dist / fuel;
        this.dom.resEffScore.innerText = efficiency.toFixed(1);

        if (cost > 0) {
            const cpk = cost / dist;
            this.dom.resMcCpk.innerText = cpk.toFixed(2);
        } else {
            this.dom.resMcCpk.innerText = '--';
        }
        
        // Approx Range (assume 40L/10gal tank as generic placeholder or just show efficiency calc)
        // Let's hide range or use it as specific tank calc if extended. 
        // For now, let's just show efficiency clearly.
        this.dom.resMcRange.innerText = (efficiency * fuel).toFixed(0); // Actually this is just distance traveled, renaming UI to 'Distance Covered' dynamically or just keep calc simple.

        this.dom.resCardMileage.style.display = 'block';
        this.dom.resCardMileage.scrollIntoView({behavior: 'smooth'});
    },

    calculateCompare: function() {
        const dist = parseFloat(this.dom.cmpDist.value) || 0;
        const effA = parseFloat(this.dom.cmpEffA.value) || 0;
        const prcA = parseFloat(this.dom.cmpPriceA.value) || 0;
        const effB = parseFloat(this.dom.cmpEffB.value) || 0;
        const prcB = parseFloat(this.dom.cmpPriceB.value) || 0;

        if(!dist || !effA || !prcA || !effB || !prcB) return;

        const costA = (dist / effA) * prcA;
        const costB = (dist / effB) * prcB;
        const diff = Math.abs(costA - costB);

        this.dom.resCmpA.innerText = '$' + costA.toFixed(2);
        this.dom.resCmpB.innerText = '$' + costB.toFixed(2);
        this.dom.resCmpDiff.innerText = '$' + diff.toFixed(2);

        if(costA < costB) {
            this.dom.resCmpMsg.innerText = "Vehicle A saves money";
            this.dom.resCmpMsg.style.color = "#27ae60";
        } else if (costB < costA) {
            this.dom.resCmpMsg.innerText = "Vehicle B saves money";
            this.dom.resCmpMsg.style.color = "#27ae60";
        } else {
            this.dom.resCmpMsg.innerText = "Costs are equal";
            this.dom.resCmpMsg.style.color = "#555";
        }

        this.dom.resCompare.style.display = 'block';
    },

    saveToHistory: function() {
        if(!this.tempResult) return;
        
        const rec = {
            date: new Date().toLocaleDateString(),
            dist: this.tempResult.dist.toFixed(1),
            cost: this.tempResult.totalCost.toFixed(2),
            unit: this.state.units === 'metric' ? 'km' : 'mi',
            curr: this.state.currency
        };

        this.state.history.unshift(rec);
        if(this.state.history.length > 5) this.state.history.pop();
        
        localStorage.setItem('fuel_calc_history', JSON.stringify(this.state.history));
        this.renderHistory();
        
        // Feedback
        const btn = document.getElementById('btn-save-trip');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Saved';
        setTimeout(() => btn.innerHTML = orig, 1500);
    },

    renderHistory: function() {
        if(this.state.history.length === 0) {
            this.dom.histList.innerHTML = '<div style="padding:10px; color:#999; text-align:center;">No recent trips saved.</div>';
            return;
        }

        this.dom.histList.innerHTML = this.state.history.map(item => `
            <div class="fh-item">
                <div class="fh-date">${item.date}</div>
                <div class="fh-det">${item.dist} ${item.unit}</div>
                <div class="fh-cost">${item.curr}${item.cost}</div>
            </div>
        `).join('');
    }
};