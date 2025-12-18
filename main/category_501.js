if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_5) window.AppCalculators.category_5 = {};

window.AppCalculators.category_5.length_calc = {
    units: {
        nanometer: { name: "Nanometer", factor: 1e-9, symbol: "nm" },
        micron: { name: "Micron (μm)", factor: 1e-6, symbol: "μm" },
        millimeter: { name: "Millimeter", factor: 0.001, symbol: "mm" },
        centimeter: { name: "Centimeter", factor: 0.01, symbol: "cm" },
        meter: { name: "Meter", factor: 1, symbol: "m" },
        kilometer: { name: "Kilometer", factor: 1000, symbol: "km" },
        inch: { name: "Inch", factor: 0.0254, symbol: "in" },
        foot: { name: "Foot", factor: 0.3048, symbol: "ft" },
        yard: { name: "Yard", factor: 0.9144, symbol: "yd" },
        mile: { name: "Mile", factor: 1609.344, symbol: "mi" },
        nautical_mile: { name: "Nautical Mile", factor: 1852, symbol: "nmi" }
    },

    getHtml: function() {
        return `
        <div class="len-calc-container">
            <div class="len-main-card">
                <div class="len-input-section">
                    <div class="len-field">
                        <label>From</label>
                        <input type="number" id="len-val-1" step="any" value="1" placeholder="Enter value">
                        <select id="len-unit-1"></select>
                    </div>
                    
                    <div class="len-swap-wrapper">
                        <button id="len-swap-btn" title="Swap Units"><i class="fas fa-exchange-alt"></i></button>
                    </div>

                    <div class="len-field">
                        <label>To</label>
                        <input type="number" id="len-val-2" step="any" placeholder="Result">
                        <select id="len-unit-2"></select>
                    </div>
                </div>

                <div class="len-controls">
                    <div class="precision-control">
                        <label>Decimals: </label>
                        <input type="range" id="len-precision" min="0" max="10" value="4">
                        <span id="precision-label">4</span>
                    </div>
                    <button id="len-copy-btn" class="secondary-btn"><i class="fas fa-copy"></i> Copy</button>
                    <button id="len-reset-btn" class="secondary-btn"><i class="fas fa-undo"></i> Reset</button>
                </div>

                <div id="len-formula-box" class="formula-display"></div>
            </div>

            <div class="len-grid">
                <div class="len-card">
                    <h3><i class="fas fa-list"></i> All Unit Comparisons</h3>
                    <div id="len-all-units" class="comparison-list"></div>
                </div>
                <div class="len-card">
                    <h3><i class="fas fa-history"></i> Recent Conversions</h3>
                    <div id="len-history" class="history-list"></div>
                </div>
            </div>

            <div class="len-card scale-section">
                <h3><i class="fas fa-ruler"></i> Visual Scale Reference</h3>
                <div id="len-visual-aid" class="visual-aid"></div>
            </div>
        </div>
        `;
    },

    init: function() {
        const u1 = document.getElementById('len-unit-1');
        const u2 = document.getElementById('len-unit-2');
        const v1 = document.getElementById('len-val-1');
        const v2 = document.getElementById('len-val-2');
        const precisionSlider = document.getElementById('len-precision');
        
        // Populate Selects
        Object.keys(this.units).forEach(key => {
            const unit = this.units[key];
            const opt1 = new Option(`${unit.name} (${unit.symbol})`, key);
            const opt2 = new Option(`${unit.name} (${unit.symbol})`, key);
            u1.add(opt1);
            u2.add(opt2);
        });

        u2.value = "foot"; // Default target

        // Event Listeners
        v1.addEventListener('input', () => this.convert(1));
        v2.addEventListener('input', () => this.convert(2));
        u1.addEventListener('change', () => this.convert(1));
        u2.addEventListener('change', () => this.convert(1));
        precisionSlider.addEventListener('input', (e) => {
            document.getElementById('precision-label').innerText = e.target.value;
            this.convert(1);
        });

        document.getElementById('len-swap-btn').onclick = () => {
            const temp = u1.value;
            u1.value = u2.value;
            u2.value = temp;
            this.convert(1);
        };

        document.getElementById('len-reset-btn').onclick = () => {
            v1.value = 1;
            this.convert(1);
        };

        document.getElementById('len-copy-btn').onclick = () => {
            const text = `${v1.value} ${this.units[u1.value].symbol} = ${v2.value} ${this.units[u2.value].symbol}`;
            navigator.clipboard.writeText(text);
            alert("Copied to clipboard!");
        };

        this.convert(1); // Initial calculation
    },

    convert: function(triggerSource) {
        const u1Key = document.getElementById('len-unit-1').value;
        const u2Key = document.getElementById('len-unit-2').value;
        const v1 = document.getElementById('len-val-1');
        const v2 = document.getElementById('len-val-2');
        const precision = parseInt(document.getElementById('len-precision').value);

        const unit1 = this.units[u1Key];
        const unit2 = this.units[u2Key];

        let baseValue; // Value in Meters

        if (triggerSource === 1) {
            baseValue = parseFloat(v1.value) * unit1.factor;
            const result = baseValue / unit2.factor;
            v2.value = isNaN(result) ? "" : this.format(result, precision);
        } else {
            baseValue = parseFloat(v2.value) * unit2.factor;
            const result = baseValue / unit1.factor;
            v1.value = isNaN(result) ? "" : this.format(result, precision);
        }

        this.updateUI(u1Key, u2Key, baseValue, precision);
    },

    format: function(num, p) {
        if (Math.abs(num) < 0.0001 && num !== 0) return num.toExponential(p);
        return parseFloat(num.toFixed(p));
    },

    updateUI: function(u1, u2, baseMeters, precision) {
        if (isNaN(baseMeters)) return;

        // Formula
        const ratio = this.units[u1].factor / this.units[u2].factor;
        document.getElementById('len-formula-box').innerHTML = 
            `<strong>Formula:</strong> Multiply the length value by <code>${this.format(ratio, 8)}</code>`;

        // Comparison List
        let listHtml = "";
        Object.keys(this.units).forEach(key => {
            const u = this.units[key];
            const val = baseMeters / u.factor;
            listHtml += `<div class="comp-item"><span>${u.name}</span><strong>${this.format(val, precision)} ${u.symbol}</strong></div>`;
        });
        document.getElementById('len-all-units').innerHTML = listHtml;

        // Visual Aid
        this.renderVisualAid(baseMeters);
        
        // History (Debounced)
        this.addToHistory(u1, u2, baseMeters, precision);
    },

    renderVisualAid: function(m) {
        const container = document.getElementById('len-visual-aid');
        let comparison = "";
        if (m < 0.001) comparison = "Thinner than a human hair.";
        else if (m < 0.03) comparison = "About the size of a paperclip.";
        else if (m < 1) comparison = "Roughly the length of a guitar.";
        else if (m < 10) comparison = "Equivalent to a standard garden hose.";
        else if (m < 1000) comparison = "Similar to a football field's length.";
        else comparison = "Longer than a 10-minute walk.";

        container.innerHTML = `
            <div class="scale-box">
                <p>${comparison}</p>
                <div class="scale-bar"><div class="scale-fill" style="width: ${Math.min((m*10), 100)}%"></div></div>
            </div>
        `;
    },

    history: [],
    addToHistory: function(u1, u2, base, p) {
        const entry = `${this.format(base/this.units[u1].factor, p)} ${this.units[u1].symbol} → ${this.format(base/this.units[u2].factor, p)} ${this.units[u2].symbol}`;
        if (this.history[0] === entry) return;
        this.history.unshift(entry);
        if (this.history.length > 5) this.history.pop();
        
        document.getElementById('len-history').innerHTML = this.history.map(h => `<div class="history-item">${h}</div>`).join('');
    },

    calculate: function() {
        // Required by main script trigger
        this.convert(1);
        return null; // Results are handled in real-time
    }
};