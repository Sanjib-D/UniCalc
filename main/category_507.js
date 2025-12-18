/**
 * Category 507: Pressure Converter
 * Features: Bi-directional conversion, High-precision physics constants,
 * Standard atmosphere (atm) reference, and real-time multi-unit preview.
 */
if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_5) window.AppCalculators.category_5 = {};

window.AppCalculators.category_5.pressure_calc = {
    // Factors relative to 1 Pascal (Pa)
    units: {
        pascal: { name: "Pascal", symbol: "Pa", factor: 1, type: "Scientific" },
        kilopascal: { name: "Kilopascal", symbol: "kPa", factor: 1000, type: "Industrial" },
        megapascal: { name: "Megapascal", symbol: "MPa", factor: 1000000, type: "Engineering" },
        bar: { name: "Bar", symbol: "bar", factor: 100000, type: "Industrial" },
        millibar: { name: "Millibar", symbol: "mbar", factor: 100, type: "Meteorology" },
        atm: { name: "Atmosphere", symbol: "atm", factor: 101325, type: "Atmospheric" },
        psi: { name: "Pounds per sq inch", symbol: "psi", factor: 6894.757293168, type: "Imperial" },
        torr: { name: "Torr", symbol: "Torr", factor: 133.322368421, type: "Scientific" },
        mmhg: { name: "Millimeters of Mercury", symbol: "mmHg", factor: 133.322387415, type: "Medical" },
        inhg: { name: "Inches of Mercury", symbol: "inHg", factor: 3386.388666667, type: "Aviation" }
    },

    getHtml: function() {
        return `
        <div class="pres-hero-container">
            <div class="pres-glass-card">
                <div class="pres-header-badge">
                    <i class="fas fa-compress-alt"></i> Atmospheric Pressure Engine
                </div>
                
                <div class="pres-converter-grid">
                    <div class="pres-panel">
                        <div class="pres-selector-wrapper">
                            <select id="pres-u1"></select>
                        </div>
                        <input type="number" id="pres-v1" class="pres-main-input" value="1" step="any">
                        <div class="pres-unit-label" id="pres-label-u1">Source</div>
                    </div>

                    <div class="pres-swap-zone">
                        <button id="pres-swap" class="pres-glow-btn">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>

                    <div class="pres-panel pres-highlight">
                        <div class="pres-selector-wrapper">
                            <select id="pres-u2"></select>
                        </div>
                        <input type="number" id="pres-v2" class="pres-main-input" step="any">
                        <div class="pres-unit-label" id="pres-label-u2">Target</div>
                    </div>
                </div>

                <div class="pres-action-bar">
                    <div class="pres-precision-pill">
                        <span>Precision: <b id="pres-prec-val">4</b></span>
                        <input type="range" id="pres-prec" min="0" max="10" value="4">
                    </div>
                    <div class="pres-btn-group">
                        <button id="pres-copy" title="Copy"><i class="fas fa-copy"></i></button>
                        <button id="pres-reset" title="Reset"><i class="fas fa-undo"></i></button>
                    </div>
                </div>
            </div>

            <div class="pres-stats-grid">
                <div class="pres-stat-card glass-glow">
                    <h4><i class="fas fa-list-ol"></i> Simultaneous Conversions</h4>
                    <div id="pres-multi-list" class="pres-multi-flex"></div>
                </div>
                <div class="pres-stat-card glass-glow">
                    <h4><i class="fas fa-info-circle"></i> Reference Data</h4>
                    <div id="pres-formula" class="pres-insight-box"></div>
                    <div id="pres-atm-ref" class="pres-atm-box"></div>
                    <p class="pres-disclaimer">Standard: IPTS-68 constants. Does not account for altitude, temperature, or humidity.</p>
                </div>
            </div>
        </div>
        `;
    },

    init: function() {
        const u1 = document.getElementById('pres-u1');
        const u2 = document.getElementById('pres-u2');
        const v1 = document.getElementById('pres-v1');
        const v2 = document.getElementById('pres-v2');
        const prec = document.getElementById('pres-prec');

        Object.keys(this.units).forEach(key => {
            const unit = this.units[key];
            u1.add(new Option(`${unit.name} (${unit.symbol})`, key));
            u2.add(new Option(`${unit.name} (${unit.symbol})`, key));
        });

        u1.value = 'atm';
        u2.value = 'psi';

        const sync = (src) => {
            const unit1 = this.units[u1.value];
            const unit2 = this.units[u2.value];
            const p = parseInt(prec.value);
            document.getElementById('pres-prec-val').innerText = p;

            if (src === 1) {
                const base = parseFloat(v1.value) * unit1.factor;
                const res = base / unit2.factor;
                v2.value = isNaN(res) ? "" : this.format(res, p);
            } else {
                const base = parseFloat(v2.value) * unit2.factor;
                const res = base / unit1.factor;
                v1.value = isNaN(res) ? "" : this.format(res, p);
            }
            this.updateExtras(u1.value, u2.value, v1.value, p);
        };

        v1.oninput = () => sync(1);
        v2.oninput = () => sync(2);
        u1.onchange = () => sync(1);
        u2.onchange = () => sync(1);
        prec.oninput = () => sync(1);

        document.getElementById('pres-swap').onclick = () => {
            const temp = u1.value;
            u1.value = u2.value;
            u2.value = temp;
            sync(1);
        };

        document.getElementById('pres-reset').onclick = () => {
            v1.value = 1;
            sync(1);
        };

        document.getElementById('pres-copy').onclick = () => {
            const text = `${v1.value} ${this.units[u1.value].symbol} = ${v2.value} ${this.units[u2.value].symbol}`;
            navigator.clipboard.writeText(text);
        };

        sync(1);
    },

    format: (n, p) => (Math.abs(n) < 1e-4 && n !== 0) ? n.toExponential(p) : parseFloat(n.toFixed(p)),

    updateExtras: function(id1, id2, val, p) {
        const u1 = this.units[id1];
        const u2 = this.units[id2];
        const basePa = (parseFloat(val) || 0) * u1.factor;
        
        // Update Formula
        const factor = u1.factor / u2.factor;
        document.getElementById('pres-formula').innerHTML = `1 ${u1.symbol} = ${this.format(factor, 8)} ${u2.symbol}`;
        
        // ATM Reference
        const atmVal = basePa / 101325;
        document.getElementById('pres-atm-ref').innerHTML = `<strong>${this.format(atmVal, 4)} ×</strong> Standard Atmospheres (atm)`;

        // Multi-list
        const displayKeys = ['pascal', 'kiloparscal', 'bar', 'psi', 'mmhg', 'atm'];
        document.getElementById('pres-multi-list').innerHTML = Object.keys(this.units).map(k => {
            const u = this.units[k];
            const res = basePa / u.factor;
            return `<div class="pres-pill"><span>${u.symbol}</span><b>${this.format(res, p)}</b></div>`;
        }).join('');
    }
};