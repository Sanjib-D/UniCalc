/**
 * Category 504: Speed Converter
 * Features: Bi-directional conversion, Maritime/Aviation units, 
 * Contextual use-cases, and high-precision factors.
 */
if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_5) window.AppCalculators.category_5 = {};

window.AppCalculators.category_5.speed_calc = {
    // Conversion factors relative to Meters per Second (m/s)
    units: {
        mps: { name: "Meters per second", symbol: "m/s", factor: 1, desc: "Scientific / Athletics" },
        kmh: { name: "Kilometers per hour", symbol: "km/h", factor: 1/3.6, desc: "Road travel (Metric)" },
        mph: { name: "Miles per hour", symbol: "mph", factor: 0.44704, desc: "Road travel (Imperial)" },
        fps: { name: "Feet per second", symbol: "ft/s", factor: 0.3048, desc: "Ballistics / Engineering" },
        knot: { name: "Knot", symbol: "kn", factor: 0.514444, desc: "Maritime / Aviation" },
        mach: { name: "Mach", symbol: "M", factor: 340.29, desc: "Supersonic (Sea Level)" }
    },

    getHtml: function() {
        return `
        <div class="speed-hero-container">
            <div class="speed-glass-card">
                <div class="speed-header-badge">
                    <i class="fas fa-tachometer-alt"></i> Velocity Transfer Engine
                </div>
                
                <div class="speed-converter-grid">
                    <div class="speed-panel">
                        <div class="speed-selector-wrapper">
                            <select id="speed-u1"></select>
                        </div>
                        <input type="number" id="speed-v1" class="speed-main-input" value="100" step="any">
                        <div class="speed-unit-label" id="s-label-u1">Kilometers per hour</div>
                    </div>

                    <div class="speed-swap-zone">
                        <button id="speed-swap" class="speed-glow-btn">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>

                    <div class="speed-panel speed-highlight">
                        <div class="speed-selector-wrapper">
                            <select id="speed-u2"></select>
                        </div>
                        <input type="number" id="speed-v2" class="speed-main-input" step="any">
                        <div class="speed-unit-label" id="s-label-u2">Miles per hour</div>
                    </div>
                </div>

                <div class="speed-action-bar">
                    <div class="speed-precision-pill">
                        <span>Decimals: <b id="speed-prec-val">2</b></span>
                        <input type="range" id="speed-prec" min="0" max="10" value="2">
                    </div>
                    <div class="speed-btn-group">
                        <button id="speed-copy" title="Copy Result"><i class="fas fa-copy"></i></button>
                        <button id="speed-reset" title="Reset"><i class="fas fa-undo"></i></button>
                    </div>
                </div>
            </div>

            <div class="speed-stats-grid">
                <div class="speed-stat-card glass-glow">
                    <h4><i class="fas fa-list-ul"></i> Multi-Unit Comparison</h4>
                    <div id="speed-multi-list" class="speed-multi-flex"></div>
                </div>
                <div class="speed-stat-card glass-glow">
                    <h4><i class="fas fa-info-circle"></i> Technical Context</h4>
                    <div id="speed-formula" class="speed-insight-box"></div>
                    <p class="speed-disclaimer">Mach is calculated at 20°C sea level (340.3 m/s). Results are mathematical only.</p>
                </div>
            </div>
        </div>
        `;
    },

    init: function() {
        const u1 = document.getElementById('speed-u1');
        const u2 = document.getElementById('speed-u2');
        const v1 = document.getElementById('speed-v1');
        const v2 = document.getElementById('speed-v2');
        const prec = document.getElementById('speed-prec');

        // Populate selects
        Object.keys(this.units).forEach(key => {
            const unit = this.units[key];
            u1.add(new Option(`${unit.name} (${unit.symbol})`, key));
            u2.add(new Option(`${unit.name} (${unit.symbol})`, key));
        });

        u1.value = 'kmh';
        u2.value = 'mph';

        const sync = (source) => {
            const unit1 = this.units[u1.value];
            const unit2 = this.units[u2.value];
            const p = parseInt(prec.value);
            document.getElementById('speed-prec-val').innerText = p;
            document.getElementById('s-label-u1').innerText = unit1.desc;
            document.getElementById('s-label-u2').innerText = unit2.desc;

            if (source === 1) {
                const baseMps = parseFloat(v1.value) * unit1.factor;
                const result = baseMps / unit2.factor;
                v2.value = isNaN(result) ? "" : this.format(result, p);
            } else {
                const baseMps = parseFloat(v2.value) * unit2.factor;
                const result = baseMps / unit1.factor;
                v1.value = isNaN(result) ? "" : this.format(result, p);
            }
            this.updateDetails(u1.value, u2.value, v1.value, p);
        };

        v1.oninput = () => sync(1);
        v2.oninput = () => sync(2);
        u1.onchange = () => sync(1);
        u2.onchange = () => sync(1);
        prec.oninput = () => sync(1);

        document.getElementById('speed-swap').onclick = () => {
            const temp = u1.value;
            u1.value = u2.value;
            u2.value = temp;
            sync(1);
        };

        document.getElementById('speed-reset').onclick = () => {
            v1.value = 100;
            sync(1);
        };

        document.getElementById('speed-copy').onclick = () => {
            const text = `${v1.value} ${this.units[u1.value].symbol} = ${v2.value} ${this.units[u2.value].symbol}`;
            navigator.clipboard.writeText(text).then(() => alert("Speed conversion copied!"));
        };

        sync(1);
    },

    format: (n, p) => {
        if (n === 0) return 0;
        return (Math.abs(n) < 0.001) ? n.toExponential(p) : parseFloat(n.toFixed(p));
    },

    updateDetails: function(id1, id2, val, p) {
        const u1 = this.units[id1];
        const u2 = this.units[id2];
        const factor = u1.factor / u2.factor;
        
        // Update Insight
        document.getElementById('speed-formula').innerHTML = 
            `Factor: 1 ${u1.symbol} ≈ ${this.format(factor, 6)} ${u2.symbol}`;

        // Update Multi-list
        const base = (parseFloat(val) || 0) * u1.factor;
        document.getElementById('speed-multi-list').innerHTML = Object.keys(this.units).map(k => {
            const u = this.units[k];
            const converted = base / u.factor;
            return `<div class="speed-pill">
                        <span class="pill-val">${this.format(converted, p)}</span>
                        <span class="pill-unit">${u.symbol}</span>
                    </div>`;
        }).join('');
    }
};