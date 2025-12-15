if (!window.AppCalculators.category_4) window.AppCalculators.category_4 = {};

window.AppCalculators.category_4.cooking_calc = {
    name: "Cooking Converter",
    id: "cooking_calc",

    state: {
        value: 1,
        mode: 'cups_to_ml', // 'cups_to_ml' or 'ml_to_cups'
        standard: 'us', // 'us', 'metric', 'uk', 'jp'
        ingredient: 'water',
        density: 1.0, // g/ml
        customSize: 240 // for custom cup setting
    },

    standards: {
        us: { name: "US Cup", ml: 236.59, label: "~237 ml" },
        metric: { name: "Metric Cup", ml: 250, label: "250 ml" },
        uk: { name: "Imperial Cup (UK)", ml: 284.13, label: "~284 ml" },
        jp: { name: "Japanese Cup", ml: 200, label: "200 ml" },
        legal: { name: "US Legal Cup", ml: 240, label: "240 ml" }
    },

    ingredients: {
        water: { name: "Water / Liquids", density: 1.0 },
        milk: { name: "Milk (Whole)", density: 1.03 },
        flour: { name: "Flour (All-Purpose)", density: 0.53 }, // approx 125g per 236ml
        sugar_gran: { name: "Sugar (Granulated)", density: 0.85 }, // approx 200g per 236ml
        sugar_pow: { name: "Sugar (Powdered)", density: 0.51 }, // approx 120g per 236ml
        butter: { name: "Butter", density: 0.96 },
        oil: { name: "Cooking Oil", density: 0.92 },
        rice: { name: "Rice (Uncooked)", density: 0.80 },
        oats: { name: "Oats (Rolled)", density: 0.40 }
    },

    getHtml: function() {
        return `
        <div class="cook-wrapper">
            <div class="cook-header">
                <div class="cook-standard-select">
                    <label>Cup Standard</label>
                    <select id="cook-std-select" class="cook-select">
                        <option value="us">US Cup (~237 ml)</option>
                        <option value="legal">US Legal Cup (240 ml)</option>
                        <option value="metric">Metric Cup (250 ml)</option>
                        <option value="uk">Imperial Cup (284 ml)</option>
                        <option value="jp">Japanese Cup (200 ml)</option>
                    </select>
                </div>
                <button class="cook-mode-btn" id="cook-swap-btn">
                    <span id="mode-text">Cups <i class="fas fa-arrow-right"></i> mL</span>
                    <i class="fas fa-exchange-alt"></i>
                </button>
            </div>

            <div class="cook-input-card">
                <div class="cook-row-main">
                    <div class="cook-input-group">
                        <label id="cook-input-label">Volume (Cups)</label>
                        <div class="input-with-fractions">
                            <input type="number" id="cook-input-val" value="1" step="0.1" min="0">
                            <span class="cook-unit-tag" id="cook-unit-tag">cup</span>
                        </div>
                    </div>
                </div>

                <div class="cook-fractions" id="cook-fractions">
                    <button data-val="0.25">¼</button>
                    <button data-val="0.333">⅓</button>
                    <button data-val="0.5">½</button>
                    <button data-val="0.666">⅔</button>
                    <button data-val="0.75">¾</button>
                    <button data-val="1">1</button>
                </div>

                <div class="cook-ingredient-section">
                    <label>Ingredient (for Weight Est.)</label>
                    <select id="cook-ing-select" class="cook-select">
                        <option value="water">💧 Water / Most Liquids</option>
                        <option value="milk">🥛 Milk</option>
                        <option value="oil">🌻 Cooking Oil</option>
                        <option value="flour">🌾 Flour (All-Purpose)</option>
                        <option value="sugar_gran">🍚 Sugar (Granulated)</option>
                        <option value="sugar_pow">🌨️ Sugar (Powdered)</option>
                        <option value="butter">🧈 Butter</option>
                        <option value="rice">🍚 Rice (Uncooked)</option>
                        <option value="oats">🥣 Oats</option>
                    </select>
                </div>

                <div class="cook-scale-controls">
                    <button class="scale-btn" data-scale="0.5">½x</button>
                    <button class="scale-btn" data-scale="2">2x</button>
                    <button class="scale-btn" data-scale="3">3x</button>
                    <button class="scale-btn reset" id="cook-reset">Reset</button>
                </div>
            </div>

            <div class="cook-result-card" id="cook-result-card">
                <div class="cook-res-main">
                    <span class="cook-res-label">Converted Volume</span>
                    <div class="cook-res-val-group">
                        <span id="res-main-val">237</span>
                        <span id="res-main-unit">ml</span>
                    </div>
                </div>

                <div class="cook-weight-box" id="cook-weight-box">
                    <div class="weight-icon"><i class="fas fa-balance-scale"></i></div>
                    <div class="weight-info">
                        <span class="w-label">Estimated Weight</span>
                        <strong id="res-weight-val">237 g</strong>
                        <small id="res-ing-name">Water</small>
                    </div>
                </div>
            </div>

            <div class="cook-ref-table">
                <h4>Common Equivalents</h4>
                <div class="ref-row head">
                    <span>Cups</span><span>mL</span><span>Tbsp</span>
                </div>
                <div class="ref-row">
                    <span>1 Cup</span><span id="ref-1-ml">237 ml</span><span>16</span>
                </div>
                 <div class="ref-row">
                    <span>½ Cup</span><span id="ref-2-ml">118 ml</span><span>8</span>
                </div>
                 <div class="ref-row">
                    <span>⅓ Cup</span><span id="ref-3-ml">79 ml</span><span>5.3</span>
                </div>
                 <div class="ref-row">
                    <span>¼ Cup</span><span id="ref-4-ml">59 ml</span><span>4</span>
                </div>
            </div>
            
            <p class="cook-disclaimer">
                * Weight estimates vary by packing method and density. Results are approximations for cooking.
            </p>
        </div>
        `;
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.calculate();
    },

    cacheDOM: function() {
        this.dom = {
            inputVal: document.getElementById('cook-input-val'),
            stdSelect: document.getElementById('cook-std-select'),
            ingSelect: document.getElementById('cook-ing-select'),
            modeBtn: document.getElementById('cook-swap-btn'),
            modeText: document.getElementById('mode-text'),
            fractions: document.getElementById('cook-fractions'),
            inputLabel: document.getElementById('cook-input-label'),
            unitTag: document.getElementById('cook-unit-tag'),
            
            resMainVal: document.getElementById('res-main-val'),
            resMainUnit: document.getElementById('res-main-unit'),
            resWeightVal: document.getElementById('res-weight-val'),
            resIngName: document.getElementById('res-ing-name'),
            
            ref1: document.getElementById('ref-1-ml'),
            ref2: document.getElementById('ref-2-ml'),
            ref3: document.getElementById('ref-3-ml'),
            ref4: document.getElementById('ref-4-ml'),
            
            scaleBtns: document.querySelectorAll('.scale-btn')
        };
    },

    bindEvents: function() {
        // Input Change
        this.dom.inputVal.addEventListener('input', () => this.calculate());
        
        // Standard Change
        this.dom.stdSelect.addEventListener('change', (e) => {
            this.state.standard = e.target.value;
            this.updateReferenceTable();
            this.calculate();
        });

        // Ingredient Change
        this.dom.ingSelect.addEventListener('change', (e) => {
            this.state.ingredient = e.target.value;
            this.state.density = this.ingredients[e.target.value].density;
            this.calculate();
        });

        // Mode Swap
        this.dom.modeBtn.addEventListener('click', () => {
            this.state.mode = (this.state.mode === 'cups_to_ml') ? 'ml_to_cups' : 'cups_to_ml';
            this.updateUIForMode();
            this.calculate();
        });

        // Fraction Buttons
        this.dom.fractions.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.dom.inputVal.value = e.target.dataset.val;
                this.calculate();
            });
        });

        // Scale Buttons
        this.dom.scaleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if(btn.classList.contains('reset')) {
                    this.dom.inputVal.value = 1;
                } else {
                    let current = parseFloat(this.dom.inputVal.value) || 0;
                    this.dom.inputVal.value = (current * parseFloat(btn.dataset.scale));
                }
                this.calculate();
            });
        });
    },

    updateUIForMode: function() {
        if (this.state.mode === 'cups_to_ml') {
            this.dom.modeText.innerHTML = 'Cups <i class="fas fa-arrow-right"></i> mL';
            this.dom.inputLabel.innerText = "Volume (Cups)";
            this.dom.unitTag.innerText = "cup";
            this.dom.fractions.style.display = "flex";
            this.dom.resMainUnit.innerText = "ml";
        } else {
            this.dom.modeText.innerHTML = 'mL <i class="fas fa-arrow-right"></i> Cups';
            this.dom.inputLabel.innerText = "Volume (mL)";
            this.dom.unitTag.innerText = "ml";
            this.dom.fractions.style.display = "none";
            this.dom.resMainUnit.innerText = "cups";
        }
        // Adjust input value roughly for UX (optional, but helpful)
        // 1 cup -> 240 ml, 240 ml -> 1 cup
        // Simplest is to just let user re-enter, or do a smart convert?
        // Let's keep value as is to prevent confusion, user edits it.
    },

    calculate: function() {
        const val = parseFloat(this.dom.inputVal.value);
        if (isNaN(val) || val < 0) {
            this.dom.resMainVal.innerText = "--";
            this.dom.resWeightVal.innerText = "--";
            return;
        }

        const cupSize = this.standards[this.state.standard].ml;
        let resultVol = 0;
        let resultWeight = 0;
        let mlValue = 0;

        if (this.state.mode === 'cups_to_ml') {
            // Cups -> ML
            mlValue = val * cupSize;
            resultVol = mlValue; // Result is ML
            
            // Weight Calc (g) = mL * density
            resultWeight = mlValue * this.state.density;

            this.dom.resMainVal.innerText = Math.round(resultVol); // Round ML to whole number for cooking
        } else {
            // ML -> Cups
            mlValue = val;
            let cups = val / cupSize;
            resultVol = cups;
            
            // Weight Calc (g) = mL * density
            resultWeight = val * this.state.density;

            this.dom.resMainVal.innerText = resultVol.toFixed(2);
        }

        // Display Weight
        this.dom.resWeightVal.innerText = Math.round(resultWeight) + " g";
        this.dom.resIngName.innerText = this.ingredients[this.state.ingredient].name;
    },

    updateReferenceTable: function() {
        const cupSize = this.standards[this.state.standard].ml;
        this.dom.ref1.innerText = Math.round(cupSize) + " ml";
        this.dom.ref2.innerText = Math.round(cupSize * 0.5) + " ml";
        this.dom.ref3.innerText = Math.round(cupSize * 0.333) + " ml";
        this.dom.ref4.innerText = Math.round(cupSize * 0.25) + " ml";
    }
};