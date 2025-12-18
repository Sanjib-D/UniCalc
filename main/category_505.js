/**
 * Category 505: Area & Volume Converter
 * Features: Dual-mode switching, Bi-directional conversion, 
 * High-precision constants, and Multi-unit comparison.
 */
if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_5) window.AppCalculators.category_5 = {};

window.AppCalculators.category_5.area_vol_calc = {
    mode: 'area', // 'area' or 'volume'
    
    units: {
        area: {
            sq_mm: { name: "Square Millimeter", symbol: "mm²", factor: 1e-6 },
            sq_cm: { name: "Square Centimeter", symbol: "cm²", factor: 1e-4 },
            sq_m: { name: "Square Meter", symbol: "m²", factor: 1 },
            sq_km: { name: "Square Kilometer", symbol: "km²", factor: 1e6 },
            hectare: { name: "Hectare", symbol: "ha", factor: 10000 },
            acre: { name: "Acre", symbol: "ac", factor: 4046.8564224 },
            sq_in: { name: "Square Inch", symbol: "in²", factor: 0.00064516 },
            sq_ft: { name: "Square Foot", symbol: "ft²", factor: 0.09290304 },
            sq_yd: { name: "Square Yard", symbol: "yd²", factor: 0.83612736 },
            sq_mi: { name: "Square Mile", symbol: "mi²", factor: 2589988.110336 }
        },
        volume: {
            cu_mm: { name: "Cubic Millimeter", symbol: "mm³", factor: 1e-9 },
            cu_cm: { name: "Cubic Centimeter", symbol: "cm³", factor: 1e-6 },
            cu_m: { name: "Cubic Meter", symbol: "m³", factor: 1 },
            milliliter: { name: "Milliliter", symbol: "mL", factor: 1e-6 },
            liter: { name: "Liter", symbol: "L", factor: 0.001 },
            cu_in: { name: "Cubic Inch", symbol: "in³", factor: 0.000016387064 },
            cu_ft: { name: "Cubic Foot", symbol: "ft³", factor: 0.028316846592 },
            cu_yd: { name: "Cubic Yard", symbol: "yd³", factor: 0.764554857984 },
            gal_us: { name: "Gallon (US)", symbol: "gal (US)", factor: 0.003785411784 },
            gal_uk: { name: "Gallon (UK)", symbol: "gal (UK)", factor: 0.00454609 },
            pint_us: { name: "Pint (US Liq)", symbol: "pt", factor: 0.000473176473 }
        }
    },

    getHtml: function() {
        return `
        <div class="av-hero-container">
            <div class="av-mode-switcher">
                <button id="av-mode-area" class="mode-btn active">Area (2D)</button>
                <button id="av-mode-vol" class="mode-btn">Volume (3D)</button>
            </div>

            <div class="av-glass-card">
                <div class="av-header-badge">
                    <i class="fas fa-cube"></i> <span id="av-badge-text">Spatial Converter</span>
                </div>
                
                <div class="av-converter-grid">
                    <div class="av-panel">
                        <div class="av-selector-wrapper">
                            <select id="av-u1"></select>
                        </div>
                        <input type="number" id="av-v1" class="av-main-input" value="1" step="any">
                        <div class="av-unit-label" id="av-label-u1">Source</div>
                    </div>

                    <div class="av-swap-zone">
                        <button id="av-swap" class="av-glow-btn">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>

                    <div class="av-panel av-highlight">
                        <div class="av-selector-wrapper">
                            <select id="av-u2"></select>
                        </div>
                        <input type="number" id="av-v2" class="av-main-input" step="any">
                        <div class="av-unit-label" id="av-label-u2">Result</div>
                    </div>
                </div>

                <div class="av-action-bar">
                    <div class="av-precision-pill">
                        <span>Precision: <b id="av-prec-val">4</b></span>
                        <input type="range" id="av-prec" min="0" max="10" value="4">
                    </div>
                    <div class="av-btn-group">
                        <button id="av-copy" title="Copy"><i class="fas fa-copy"></i></button>
                        <button id="av-reset" title="Reset"><i class="fas fa-undo"></i></button>
                    </div>
                </div>
            </div>

            <div class="av-stats-grid">
                <div class="av-stat-card glass-glow">
                    <h4><i class="fas fa-th-list"></i> Equivalent Measurements</h4>
                    <div id="av-multi-list" class="av-multi-flex"></div>
                </div>
                <div class="av-stat-card glass-glow">
                    <h4><i class="fas fa-info-circle"></i> Mathematical Basis</h4>
                    <div id="av-formula" class="av-insight-box"></div>
                    <p class="av-disclaimer">Standard: SI and Imperial Units. Conversions are purely mathematical based on static volume/area constants.</p>
                </div>
            </div>
        </div>
        `;
    },

    init: function() {
        this.renderDropdowns();
        
        const v1 = document.getElementById('av-v1');
        const v2 = document.getElementById('av-v2');
        const u1 = document.getElementById('av-u1');
        const u2 = document.getElementById('av-u2');
        const prec = document.getElementById('av-prec');

        const sync = (src) => {
            const unitSet = this.units[this.mode];
            const unit1 = unitSet[u1.value];
            const unit2 = unitSet[u2.value];
            const p = parseInt(prec.value);
            document.getElementById('av-prec-val').innerText = p;

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

        // Event Listeners
        v1.oninput = () => sync(1);
        v2.oninput = () => sync(2);
        u1.onchange = () => sync(1);
        u2.onchange = () => sync(1);
        prec.oninput = () => sync(1);

        document.getElementById('av-mode-area').onclick = (e) => this.switchMode('area', e.target);
        document.getElementById('av-mode-vol').onclick = (e) => this.switchMode('volume', e.target);
        
        document.getElementById('av-swap').onclick = () => {
            [u1.value, u2.value] = [u2.value, u1.value];
            sync(1);
        };

        document.getElementById('av-reset').onclick = () => {
            v1.value = 1;
            sync(1);
        };

        document.getElementById('av-copy').onclick = () => {
            const unitSet = this.units[this.mode];
            const text = `${v1.value} ${unitSet[u1.value].symbol} = ${v2.value} ${unitSet[u2.value].symbol}`;
            navigator.clipboard.writeText(text);
        };

        sync(1);
    },

    switchMode: function(newMode, btn) {
        this.mode = newMode;
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('av-badge-text').innerText = newMode === 'area' ? 'Area Converter' : 'Volume Converter';
        this.renderDropdowns();
        document.getElementById('av-v1').value = 1;
        this.init(); // Re-bind and sync
    },

    renderDropdowns: function() {
        const u1 = document.getElementById('av-u1');
        const u2 = document.getElementById('av-u2');
        u1.innerHTML = ''; u2.innerHTML = '';
        const unitSet = this.units[this.mode];
        Object.keys(unitSet).forEach(key => {
            u1.add(new Option(`${unitSet[key].name} (${unitSet[key].symbol})`, key));
            u2.add(new Option(`${unitSet[key].name} (${unitSet[key].symbol})`, key));
        });
        u1.value = Object.keys(unitSet)[2]; // Default to meter based units
        u2.value = Object.keys(unitSet)[7]; // Default to imperial based units
    },

    format: (n, p) => (Math.abs(n) < 1e-4 && n !== 0) ? n.toExponential(p) : parseFloat(n.toFixed(p)),

    updateExtras: function(id1, id2, val, p) {
        const unitSet = this.units[this.mode];
        const u1 = unitSet[id1];
        const u2 = unitSet[id2];
        const factor = u1.factor / u2.factor;
        
        document.getElementById('av-formula').innerHTML = `Ratio: 1 ${u1.symbol} = ${this.format(factor, 8)} ${u2.symbol}`;
        
        const base = (parseFloat(val) || 0) * u1.factor;
        const keys = Object.keys(unitSet).slice(0, 6); // Show top 6 comparisons
        document.getElementById('av-multi-list').innerHTML = keys.map(k => {
            const unit = unitSet[k];
            return `<div class="av-pill"><b>${this.format(base / unit.factor, p)}</b> ${unit.symbol}</div>`;
        }).join('');
    }
};