/**
 * Category 506: Digital Storage Converter
 * Features: Bi-directional conversion, Decimal (SI) vs Binary (IEC) modes,
 * High-precision math, and Real-world context.
 */
if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_5) window.AppCalculators.category_5 = {};

window.AppCalculators.category_5.data_calc = {
    // Multipliers for Decimal (SI) and Binary (IEC)
    standards: {
        decimal: { name: "Decimal (SI)", base: 1000, label: "1 KB = 1000 Bytes" },
        binary: { name: "Binary (IEC)", base: 1024, label: "1 KiB = 1024 Bytes" }
    },

    units: [
        { id: "b", name: "Byte", symbol: "B", power: 0 },
        { id: "kb", name: "Kilobyte", symbol: "KB", power: 1 },
        { id: "mb", name: "Megabyte", symbol: "MB", power: 2 },
        { id: "gb", name: "Gigabyte", symbol: "GB", power: 3 },
        { id: "tb", name: "Terabyte", symbol: "TB", power: 4 },
        { id: "pb", name: "Petabyte", symbol: "PB", power: 5 }
    ],

    getHtml: function() {
        return `
        <div class="data-hero-container">
            <div class="data-glass-card">
                <div class="data-header-badge">
                    <i class="fas fa-microchip"></i> Data Architecture Engine
                </div>
                
                <div class="data-standard-toggle">
                    <label>Measurement Standard:</label>
                    <div class="toggle-group">
                        <button id="std-decimal" class="std-btn active" onclick="window.AppCalculators.category_5.data_calc.setStandard('decimal')">Decimal (1000)</button>
                        <button id="std-binary" class="std-btn" onclick="window.AppCalculators.category_5.data_calc.setStandard('binary')">Binary (1024)</button>
                    </div>
                </div>

                <div class="data-converter-grid">
                    <div class="data-panel">
                        <div class="data-selector-wrapper">
                            <select id="data-u1"></select>
                        </div>
                        <input type="number" id="data-v1" class="data-main-input" value="1" step="any">
                        <div class="data-unit-label" id="d-label-u1">Source</div>
                    </div>

                    <div class="data-swap-zone">
                        <button id="data-swap" class="data-glow-btn">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>

                    <div class="data-panel data-highlight">
                        <div class="data-selector-wrapper">
                            <select id="data-u2"></select>
                        </div>
                        <input type="number" id="data-v2" class="data-main-input" step="any">
                        <div class="data-unit-label" id="d-label-u2">Target</div>
                    </div>
                </div>

                <div class="data-action-bar">
                    <div class="data-precision-pill">
                        <span>Precision: <b id="data-prec-val">2</b></span>
                        <input type="range" id="data-prec" min="0" max="10" value="2">
                    </div>
                    <div class="data-btn-group">
                        <button id="data-copy" title="Copy"><i class="fas fa-copy"></i></button>
                        <button id="data-reset" title="Reset"><i class="fas fa-undo"></i></button>
                    </div>
                </div>
            </div>

            <div class="data-stats-grid">
                <div class="data-stat-card glass-glow">
                    <h4><i class="fas fa-hdd"></i> Full Capacity View</h4>
                    <div id="data-multi-list" class="data-multi-flex"></div>
                </div>
                <div class="data-stat-card glass-glow">
                    <h4><i class="fas fa-info-circle"></i> OS vs Manufacturer Insight</h4>
                    <div class="data-insight-box" id="data-insight">
                        Manufacturers use Decimal (1000) for marketing, while Operating Systems (Windows) often use Binary (1024). This is why a 500GB drive shows as ~465GiB.
                    </div>
                    <p class="data-disclaimer">Standard applied: <span id="active-std-name">Decimal (SI)</span></p>
                </div>
            </div>

            <div class="data-stat-card glass-glow real-world-section">
                <h4><i class="fas fa-photo-video"></i> Real-World Estimations</h4>
                <div class="estimation-grid" id="data-estimations"></div>
            </div>
        </div>
        `;
    },

    currentStd: 'decimal',

    init: function() {
        const u1 = document.getElementById('data-u1');
        const u2 = document.getElementById('data-u2');
        const v1 = document.getElementById('data-v1');
        const v2 = document.getElementById('data-v2');
        const prec = document.getElementById('data-prec');

        this.units.forEach(unit => {
            u1.add(new Option(`${unit.name} (${unit.symbol})`, unit.id));
            u2.add(new Option(`${unit.name} (${unit.symbol})`, unit.id));
        });

        u1.value = 'gb';
        u2.value = 'mb';

        const sync = (source) => {
            const p = parseInt(prec.value);
            document.getElementById('data-prec-val').innerText = p;
            const unit1 = this.units.find(u => u.id === u1.value);
            const unit2 = this.units.find(u => u.id === u2.value);
            const base = this.standards[this.currentStd].base;

            if (source === 1) {
                const bytes = parseFloat(v1.value) * Math.pow(base, unit1.power);
                const res = bytes / Math.pow(base, unit2.power);
                v2.value = isNaN(res) ? "" : this.format(res, p);
            } else {
                const bytes = parseFloat(v2.value) * Math.pow(base, unit2.power);
                const res = bytes / Math.pow(base, unit1.power);
                v1.value = isNaN(res) ? "" : this.format(res, p);
            }
            this.updateExtras(v1.value, unit1, p);
        };

        v1.oninput = () => sync(1);
        v2.oninput = () => sync(2);
        u1.onchange = () => sync(1);
        u2.onchange = () => sync(1);
        prec.oninput = () => sync(1);

        document.getElementById('data-swap').onclick = () => {
            const temp = u1.value;
            u1.value = u2.value;
            u2.value = temp;
            sync(1);
        };

        document.getElementById('data-reset').onclick = () => {
            v1.value = 1;
            sync(1);
        };

        document.getElementById('data-copy').onclick = () => {
            const text = `${v1.value}${u1.options[u1.selectedIndex].text} = ${v2.value}${u2.options[u2.selectedIndex].text}`;
            navigator.clipboard.writeText(text);
        };

        this.sync = sync; // Expose for external standard toggle
        sync(1);
    },

    setStandard: function(std) {
        this.currentStd = std;
        document.querySelectorAll('.std-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`std-${std}`).classList.add('active');
        document.getElementById('active-std-name').innerText = this.standards[std].name;
        
        // Update unit names to Binary prefixes if binary mode selected
        const unitSet = this.units;
        const u1 = document.getElementById('data-u1');
        const u2 = document.getElementById('data-u2');
        
        unitSet.forEach((u, i) => {
            const suffix = std === 'binary' && u.power > 0 ? u.symbol.replace('B', 'iB') : u.symbol;
            const prefix = std === 'binary' && u.power > 0 ? u.name.replace('byte', 'ibyte') : u.name;
            u1.options[i].text = `${prefix} (${suffix})`;
            u2.options[i].text = `${prefix} (${suffix})`;
        });

        this.sync(1);
    },

    format: (n, p) => (Math.abs(n) < 1e-4 && n !== 0) ? n.toExponential(p) : parseFloat(n.toFixed(p)),

    updateExtras: function(val, unit, p) {
        const baseValue = (parseFloat(val) || 0) * Math.pow(this.standards[this.currentStd].base, unit.power);
        
        // Multi-list
        document.getElementById('data-multi-list').innerHTML = this.units.map(u => {
            const res = baseValue / Math.pow(this.standards[this.currentStd].base, u.power);
            return `<div class="data-pill"><b>${this.format(res, p)}</b> ${u.symbol}</div>`;
        }).join('');

        // Real world estimations based on GB
        const gbValue = baseValue / Math.pow(this.standards[this.currentStd].base, 3);
        const ests = [
            { icon: 'fa-music', name: 'MP3 Songs', calc: gbValue * 200 },
            { icon: 'fa-camera', name: 'HD Photos', calc: gbValue * 300 },
            { icon: 'fa-film', name: '4K Movie Hours', calc: gbValue / 7 }
        ];

        document.getElementById('data-estimations').innerHTML = ests.map(e => `
            <div class="est-item">
                <i class="fas ${e.icon}"></i>
                <div>
                    <strong>${this.format(e.calc, 0).toLocaleString()}</strong>
                    <span>${e.name}</span>
                </div>
            </div>
        `).join('');
    }
};