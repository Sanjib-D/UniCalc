/**
 * Category 503: Temperature Converter
 * Features: Bi-directional conversion, Absolute Zero validation, 
 * Scientific formulas, and All-unit comparison.
 */
if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_5) window.AppCalculators.category_5 = {};

window.AppCalculators.category_5.temp_calc = {
    // Normalization logic: Everything converts to/from Celsius
    units: {
        celsius: { 
            name: "Celsius", symbol: "°C", absZero: -273.15,
            toC: (v) => v, 
            fromC: (v) => v,
            formula: "T"
        },
        fahrenheit: { 
            name: "Fahrenheit", symbol: "°F", absZero: -459.67,
            toC: (v) => (v - 32) / 1.8, 
            fromC: (v) => (v * 1.8) + 32,
            formula: "(T - 32) × 5/9"
        },
        kelvin: { 
            name: "Kelvin", symbol: "K", absZero: 0,
            toC: (v) => v - 273.15, 
            fromC: (v) => v + 273.15,
            formula: "T - 273.15"
        },
        rankine: { 
            name: "Rankine", symbol: "°Ra", absZero: 0,
            toC: (v) => (v - 491.67) / 1.8, 
            fromC: (v) => (v + 273.15) * 1.8,
            formula: "(T - 491.67) × 5/9"
        },
        reaumur: { 
            name: "Réaumur", symbol: "°Re", absZero: -218.52,
            toC: (v) => v * 1.25, 
            fromC: (v) => v * 0.8,
            formula: "T × 5/4"
        }
    },

    getHtml: function() {
        return `
        <div class="temp-hero-container">
            <div id="temp-error-banner" class="temp-alert-hidden">
                <i class="fas fa-exclamation-triangle"></i> Value is below Absolute Zero!
            </div>

            <div class="temp-glass-card">
                <div class="temp-header-badge">
                    <i class="fas fa-thermometer-half"></i> Thermal Dynamics Engine
                </div>
                
                <div class="temp-converter-grid">
                    <div class="temp-panel">
                        <div class="temp-selector-wrapper">
                            <select id="temp-u1"></select>
                        </div>
                        <input type="number" id="temp-v1" class="temp-main-input" value="0" step="any">
                        <div class="temp-unit-label" id="t-label-u1">Celsius</div>
                    </div>

                    <div class="temp-swap-zone">
                        <button id="temp-swap" class="temp-glow-btn">
                            <i class="fas fa-random"></i>
                        </button>
                    </div>

                    <div class="temp-panel temp-highlight">
                        <div class="temp-selector-wrapper">
                            <select id="temp-u2"></select>
                        </div>
                        <input type="number" id="temp-v2" class="temp-main-input" step="any">
                        <div class="temp-unit-label" id="t-label-u2">Fahrenheit</div>
                    </div>
                </div>

                <div class="temp-action-bar">
                    <div class="temp-precision-pill">
                        <span>Precision: <b id="temp-prec-val">2</b></span>
                        <input type="range" id="temp-prec" min="0" max="10" value="2">
                    </div>
                    <div class="temp-btn-group">
                        <button id="temp-copy" title="Copy Result"><i class="fas fa-copy"></i></button>
                        <button id="temp-reset" title="Reset"><i class="fas fa-undo"></i></button>
                    </div>
                </div>
            </div>

            <div class="temp-stats-grid">
                <div class="temp-stat-card glass-glow">
                    <h4><i class="fas fa-layer-group"></i> Multi-Scale Preview</h4>
                    <div id="temp-multi-list" class="temp-multi-flex"></div>
                </div>
                <div class="temp-stat-card glass-glow">
                    <h4><i class="fas fa-microscope"></i> Scientific Insight</h4>
                    <div id="temp-formula-display" class="temp-insight-box"></div>
                    <p class="temp-disclaimer">Standard: IPTS-68 Scale. Results are mathematical conversions.</p>
                </div>
            </div>

            <div class="temp-stat-card glass-glow thermometer-section">
                <h4><i class="fas fa-tint"></i> Relative Intensity</h4>
                <div class="thermometer-track">
                    <div id="thermometer-fill" class="thermometer-fill"></div>
                </div>
                <div class="thermometer-labels">
                    <span>Absolute Zero</span>
                    <span>Water Freezes</span>
                    <span>Room Temp</span>
                    <span>Water Boils</span>
                </div>
            </div>
        </div>
        `;
    },

    init: function() {
        const u1 = document.getElementById('temp-u1');
        const u2 = document.getElementById('temp-u2');
        const v1 = document.getElementById('temp-v1');
        const v2 = document.getElementById('temp-v2');
        const prec = document.getElementById('temp-prec');

        Object.keys(this.units).forEach(key => {
            u1.add(new Option(this.units[key].name, key));
            u2.add(new Option(this.units[key].name, key));
        });

        u1.value = 'celsius';
        u2.value = 'fahrenheit';

        const performCalc = (trigger) => {
            const unit1 = this.units[u1.value];
            const unit2 = this.units[u2.value];
            const p = parseInt(prec.value);
            document.getElementById('temp-prec-val').innerText = p;
            document.getElementById('t-label-u1').innerText = unit1.name;
            document.getElementById('t-label-u2').innerText = unit2.name;

            let currentCelsius;

            if (trigger === 1) {
                const val = parseFloat(v1.value);
                this.validateAbsZero(val, unit1);
                currentCelsius = unit1.toC(val);
                const res = unit2.fromC(currentCelsius);
                v2.value = isNaN(res) ? "" : this.format(res, p);
            } else {
                const val = parseFloat(v2.value);
                this.validateAbsZero(val, unit2);
                currentCelsius = unit2.toC(val);
                const res = unit1.fromC(currentCelsius);
                v1.value = isNaN(res) ? "" : this.format(res, p);
            }

            this.updateExtras(currentCelsius, unit1, unit2, p);
        };

        v1.oninput = () => performCalc(1);
        v2.oninput = () => performCalc(2);
        u1.onchange = () => performCalc(1);
        u2.onchange = () => performCalc(1);
        prec.oninput = () => performCalc(1);

        document.getElementById('temp-swap').onclick = () => {
            const temp = u1.value;
            u1.value = u2.value;
            u2.value = temp;
            performCalc(1);
        };

        document.getElementById('temp-reset').onclick = () => {
            v1.value = 0;
            performCalc(1);
        };

        document.getElementById('temp-copy').onclick = () => {
            const text = `${v1.value}${this.units[u1.value].symbol} = ${v2.value}${this.units[u2.value].symbol}`;
            navigator.clipboard.writeText(text).then(() => alert("Copied!"));
        };

        performCalc(1);
    },

    format: (n, p) => parseFloat(n.toFixed(p)),

    validateAbsZero: function(val, unit) {
        const banner = document.getElementById('temp-error-banner');
        if (val < unit.absZero) {
            banner.className = "temp-alert-visible";
        } else {
            banner.className = "temp-alert-hidden";
        }
    },

    updateExtras: function(c, u1, u2, p) {
        if (isNaN(c)) return;

        // Formula Display
        document.getElementById('temp-formula-display').innerHTML = 
            `Formula: ${u1.symbol} to ${u2.symbol} involves standard IPTS constants.`;

        // Multi-unit comparison
        const keys = ['celsius', 'fahrenheit', 'kelvin', 'rankine'];
        document.getElementById('temp-multi-list').innerHTML = keys.map(k => {
            const unit = this.units[k];
            const val = unit.fromC(c);
            return `<div class="temp-pill"><b>${this.format(val, p)}</b> ${unit.symbol}</div>`;
        }).join('');

        // Visual Gauge (0 to 100 Celsius range for visual)
        const percentage = Math.max(0, Math.min(100, ((c + 20) / 120) * 100));
        const fill = document.getElementById('thermometer-fill');
        fill.style.width = percentage + "%";
        
        // Color transition: Blue for cold, Red for hot
        const hue = Math.max(0, Math.min(240, 240 - (c * 2))); 
        fill.style.background = `hsl(${hue}, 70%, 50%)`;
    }
};