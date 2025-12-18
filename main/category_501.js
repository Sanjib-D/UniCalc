/**
 * Category 501: Length Converter
 * A professional-grade utility for multi-unit length conversions.
 */
if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_5) window.AppCalculators.category_5 = {};

window.AppCalculators.category_5.length_calc = {
    // Conversion factors relative to 1 Meter (m)
    units: {
        nanometer: { name: "Nanometer", symbol: "nm", factor: 1e-9, desc: "Atomic scale" },
        angstrom: { name: "Angstrom", symbol: "Å", factor: 1e-10, desc: "Molecular scale" },
        micron: { name: "Micron", symbol: "µm", factor: 1e-6, desc: "Cellular scale" },
        millimeter: { name: "Millimeter", symbol: "mm", factor: 0.001, desc: "Small objects" },
        centimeter: { name: "Centimeter", symbol: "cm", factor: 0.01, desc: "Common metric" },
        meter: { name: "Meter", symbol: "m", factor: 1, desc: "SI Base unit" },
        kilometer: { name: "Kilometer", symbol: "km", factor: 1000, desc: "Geographic distance" },
        inch: { name: "Inch", symbol: "in", factor: 0.0254, desc: "Imperial small" },
        foot: { name: "Foot", symbol: "ft", factor: 0.3048, desc: "Human height scale" },
        yard: { name: "Yard", symbol: "yd", factor: 0.9144, desc: "Field measurements" },
        mile: { name: "Mile", symbol: "mi", factor: 1609.344, desc: "Imperial long" },
        nautical_mile: { name: "Nautical Mile", symbol: "nmi", factor: 1852, desc: "Sea/Air navigation" },
        astronomical_unit: { name: "Astronomical Unit", symbol: "AU", factor: 149597870700, desc: "Interplanetary scale" }
    },

    getHtml: function() {
        return `
        <div class="len-container">
            <div class="len-card main-converter">
                <div class="len-row">
                    <div class="len-group">
                        <label>From</label>
                        <input type="number" id="len-v1" value="1" step="any" placeholder="Value">
                        <select id="len-u1"></select>
                    </div>
                    
                    <div class="len-swap-area">
                        <button id="len-swap-btn" title="Swap Units">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>

                    <div class="len-group">
                        <label>To</label>
                        <input type="number" id="len-v2" step="any" placeholder="Result">
                        <select id="len-u2"></select>
                    </div>
                </div>

                <div class="len-settings">
                    <div class="precision-control">
                        <span>Rounding: <b id="len-prec-val">4</b> Decimals</span>
                        <input type="range" id="len-prec" min="0" max="10" value="4">
                    </div>
                    <div class="action-btns">
                        <button id="len-copy" class="btn-secondary"><i class="fas fa-copy"></i> Copy</button>
                        <button id="len-reset" class="btn-secondary"><i class="fas fa-undo"></i> Reset</button>
                    </div>
                </div>
                
                <div id="len-formula" class="formula-box"></div>
            </div>

            <div class="len-grid-secondary">
                <div class="len-card">
                    <h3><i class="fas fa-layer-group"></i> All Units Table</h3>
                    <div id="len-multi-list" class="multi-output-list"></div>
                </div>
                
                <div class="len-card">
                    <h3><i class="fas fa-ruler-horizontal"></i> Magnitude Reference</h3>
                    <div id="len-visual-aid" class="visual-aid-container"></div>
                    <div id="len-history" class="history-container">
                        <h4>Recent Conversions</h4>
                        <ul id="len-history-list"></ul>
                    </div>
                </div>
            </div>
        </div>`;
    },

    init: function() {
        const u1 = document.getElementById('len-u1');
        const u2 = document.getElementById('len-u2');
        const v1 = document.getElementById('len-v1');
        const v2 = document.getElementById('len-v2');
        const prec = document.getElementById('len-prec');
        const historyList = [];

        // Populate unit dropdowns
        Object.keys(this.units).forEach(key => {
            const unit = this.units[key];
            u1.add(new Option(`${unit.name} (${unit.symbol})`, key));
            u2.add(new Option(`${unit.name} (${unit.symbol})`, key));
        });

        u1.value = 'meter';
        u2.value = 'foot';

        const performCalc = (triggerSource) => {
            const unit1 = this.units[u1.value];
            const unit2 = this.units[u2.value];
            const p = parseInt(prec.value);
            document.getElementById('len-prec-val').innerText = p;

            if (triggerSource === 1) {
                const val = parseFloat(v1.value);
                if (isNaN(val)) { v2.value = ""; return; }
                const result = (val * unit1.factor) / unit2.factor;
                v2.value = this.format(result, p);
            } else {
                const val = parseFloat(v2.value);
                if (isNaN(val)) { v1.value = ""; return; }
                const result = (val * unit2.factor) / unit1.factor;
                v1.value = this.format(result, p);
            }

            this.updateExtras(u1.value, u2.value, v1.value, p);
        };

        // Event Listeners
        v1.addEventListener('input', () => performCalc(1));
        v2.addEventListener('input', () => performCalc(2));
        u1.addEventListener('change', () => performCalc(1));
        u2.addEventListener('change', () => performCalc(1));
        prec.addEventListener('input', () => performCalc(1));

        document.getElementById('len-swap-btn').onclick = () => {
            const temp = u1.value;
            u1.value = u2.value;
            u2.value = temp;
            performCalc(1);
        };

        document.getElementById('len-reset').onclick = () => {
            v1.value = 1;
            performCalc(1);
        };

        document.getElementById('len-copy').onclick = () => {
            const text = `${v1.value} ${this.units[u1.value].symbol} = ${v2.value} ${this.units[u2.value].symbol}`;
            navigator.clipboard.writeText(text);
            alert("Copied to clipboard!");
        };

        performCalc(1);
    },

    format: function(num, p) {
        if (num === 0) return 0;
        const absNum = Math.abs(num);
        if (absNum < 0.000001 || absNum > 1000000000) {
            return num.toExponential(p);
        }
        return parseFloat(num.toFixed(p));
    },

    updateExtras: function(id1, id2, val, p) {
        const u1 = this.units[id1];
        const u2 = this.units[id2];
        const baseMeters = (parseFloat(val) || 0) * u1.factor;

        // 1. Formula Box
        const factor = u1.factor / u2.factor;
        document.getElementById('len-formula').innerHTML = 
            `<strong>Formula:</strong> multiply the length value by <code>${this.format(factor, 8)}</code>`;

        // 2. Multi-unit list
        let listHtml = "";
        Object.keys(this.units).forEach(key => {
            const u = this.units[key];
            const converted = baseMeters / u.factor;
            listHtml += `
                <div class="multi-item">
                    <span>${u.name}</span>
                    <strong>${this.format(converted, p)} ${u.symbol}</strong>
                </div>`;
        });
        document.getElementById('len-multi-list').innerHTML = listHtml;

        // 3. Visual Aid
        this.renderVisualAid(baseMeters);
    },

    renderVisualAid: function(m) {
        const container = document.getElementById('len-visual-aid');
        let comparison = "";
        
        if (m === 0) comparison = "Zero length.";
        else if (m < 0.001) comparison = "Smaller than a grain of sand.";
        else if (m < 0.03) comparison = "Comparable to a small paperclip.";
        else if (m < 1) comparison = "Approximately the length of a guitar.";
        else if (m < 5) comparison = "Roughly the height of a standard room.";
        else if (m < 100) comparison = "Comparable to a commercial airplane.";
        else if (m < 1000) comparison = "About the length of 10 football fields.";
        else if (m < 400000) comparison = "Equivalent to the elevation of the ISS.";
        else comparison = "A significant geographic or cosmic distance.";

        container.innerHTML = `
            <div class="visual-card">
                <i class="fas fa-eye"></i>
                <p>${comparison}</p>
                <div class="scale-bar"><div class="scale-fill" style="width: ${Math.min((m/1000)*100, 100)}%"></div></div>
            </div>`;
    }
};