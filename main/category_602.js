/**
 * Volume Calculator (3D) - Category 6, Tool 2
 * Strictly implements requirements for:
 * - 15+ 3D Shapes (Cube, Sphere, Cylinder, Pyramids, Torus, etc.)
 * - Unit Conversion (Linear Inputs -> Volume Outputs)
 * - Real-time Validation
 * - SVG Visualization & Formula Display
 * - History Management
 */

if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_6) window.AppCalculators.category_6 = {};

window.AppCalculators.category_6.volume_geom_calc = (function () {

    // --- Configuration & Data ---

    // Linear Unit Factors (Converting to Meters)
    const linearUnits = {
        mm: 0.001,
        cm: 0.01,
        m: 1.0,
        km: 1000.0,
        in: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.34
    };

    // Volume Unit Factors (Converting from Cubic Meters)
    const volumeUnits = {
        mm3: { label: "mm³", factor: 1e9 },        // m³ * 1e9 = mm³
        cm3: { label: "cm³", factor: 1e6 },
        m3: { label: "m³", factor: 1 },
        km3: { label: "km³", factor: 1e-9 },
        in3: { label: "in³", factor: 61023.7441 },
        ft3: { label: "ft³", factor: 35.3146667 },
        yd3: { label: "yd³", factor: 1.30795062 },
        ml: { label: "mL", factor: 1e6 },
        l: { label: "Liters", factor: 1000 },
        gal: { label: "Gallons (US)", factor: 264.172 }
    };

    // Shape Definitions
    const shapes = {
        cube: {
            name: "Cube",
            inputs: [{ id: "s", label: "Side Length (s)" }],
            formula: "V = s³",
            desc: "Volume is the side length cubed.",
            calc: (v) => Math.pow(v.s, 3)
        },
        cuboid: {
            name: "Cuboid / Rectangular Prism",
            inputs: [{ id: "l", label: "Length (l)" }, { id: "w", label: "Width (w)" }, { id: "h", label: "Height (h)" }],
            formula: "V = l × w × h",
            desc: "Product of length, width, and height.",
            calc: (v) => v.l * v.w * v.h
        },
        sphere: {
            name: "Sphere",
            inputs: [{ id: "r", label: "Radius (r)" }],
            formula: "V = ⁴/₃πr³",
            desc: "Based on the radius of the sphere.",
            calc: (v) => (4 / 3) * Math.PI * Math.pow(v.r, 3)
        },
        hemisphere: {
            name: "Hemisphere",
            inputs: [{ id: "r", label: "Radius (r)" }],
            formula: "V = ⅔πr³",
            desc: "Half the volume of a sphere.",
            calc: (v) => (2 / 3) * Math.PI * Math.pow(v.r, 3)
        },
        cylinder: {
            name: "Cylinder",
            inputs: [{ id: "r", label: "Radius (r)" }, { id: "h", label: "Height (h)" }],
            formula: "V = πr²h",
            desc: "Area of the circular base times height.",
            calc: (v) => Math.PI * Math.pow(v.r, 2) * v.h
        },
        hollow_cylinder: {
            name: "Hollow Cylinder",
            inputs: [{ id: "R", label: "Outer Radius (R)" }, { id: "r", label: "Inner Radius (r)" }, { id: "h", label: "Height (h)" }],
            formula: "V = πh(R² - r²)",
            desc: "Volume of outer cylinder minus inner cylinder.",
            calc: (v) => {
                if (v.r >= v.R) throw new Error("Inner radius must be smaller than outer radius.");
                return Math.PI * v.h * (Math.pow(v.R, 2) - Math.pow(v.r, 2));
            }
        },
        cone: {
            name: "Cone",
            inputs: [{ id: "r", label: "Base Radius (r)" }, { id: "h", label: "Height (h)" }],
            formula: "V = ⅓πr²h",
            desc: "One-third of a cylinder with same dimensions.",
            calc: (v) => (1 / 3) * Math.PI * Math.pow(v.r, 2) * v.h
        },
        frustum_cone: {
            name: "Frustum of Cone",
            inputs: [{ id: "R", label: "Base Radius (R)" }, { id: "r", label: "Top Radius (r)" }, { id: "h", label: "Height (h)" }],
            formula: "V = ⅓πh(R² + Rr + r²)",
            desc: "Volume of a truncated cone.",
            calc: (v) => (1 / 3) * Math.PI * v.h * (Math.pow(v.R, 2) + (v.R * v.r) + Math.pow(v.r, 2))
        },
        pyramid_sq: {
            name: "Square Pyramid",
            inputs: [{ id: "b", label: "Base Side (b)" }, { id: "h", label: "Height (h)" }],
            formula: "V = ⅓b²h",
            desc: "One-third of base area times height.",
            calc: (v) => (1 / 3) * Math.pow(v.b, 2) * v.h
        },
        pyramid_rect: {
            name: "Rectangular Pyramid",
            inputs: [{ id: "l", label: "Base Length (l)" }, { id: "w", label: "Base Width (w)" }, { id: "h", label: "Height (h)" }],
            formula: "V = ⅓(l × w)h",
            desc: "One-third of rectangular base area times height.",
            calc: (v) => (1 / 3) * (v.l * v.w) * v.h
        },
        prism_tri: {
            name: "Triangular Prism",
            inputs: [{ id: "b", label: "Base Triangle Base (b)" }, { id: "h_tri", label: "Base Triangle Height (h_b)" }, { id: "l", label: "Prism Length (L)" }],
            formula: "V = ½ × b × h_b × L",
            desc: "Area of triangular face times length.",
            calc: (v) => 0.5 * v.b * v.h_tri * v.l
        },
        tetrahedron: {
            name: "Regular Tetrahedron",
            inputs: [{ id: "a", label: "Edge Length (a)" }],
            formula: "V = a³ / (6√2)",
            desc: "Pyramid with 4 triangular faces.",
            calc: (v) => Math.pow(v.a, 3) / (6 * Math.sqrt(2))
        },
        octahedron: {
            name: "Regular Octahedron",
            inputs: [{ id: "a", label: "Edge Length (a)" }],
            formula: "V = (√2/3)a³",
            desc: "Two square pyramids joined at bases.",
            calc: (v) => (Math.sqrt(2) / 3) * Math.pow(v.a, 3)
        },
        ellipsoid: {
            name: "Ellipsoid",
            inputs: [{ id: "a", label: "Axis A" }, { id: "b", label: "Axis B" }, { id: "c", label: "Axis C" }],
            formula: "V = ⁴/₃πabc",
            desc: "Generalization of a sphere.",
            calc: (v) => (4 / 3) * Math.PI * v.a * v.b * v.c
        },
        torus: {
            name: "Torus (Donut)",
            inputs: [{ id: "R", label: "Major Radius (R)" }, { id: "r", label: "Tube Radius (r)" }],
            formula: "V = (πr²)(2πR)",
            desc: "Product of tube area and path circumference.",
            calc: (v) => {
                if (v.r >= v.R) throw new Error("Tube radius (r) must be smaller than Major radius (R).");
                return (Math.PI * Math.pow(v.r, 2)) * (2 * Math.PI * v.R);
            }
        },
        spherical_cap: {
            name: "Spherical Cap",
            inputs: [{ id: "r", label: "Sphere Radius (r)" }, { id: "h", label: "Cap Height (h)" }],
            formula: "V = ⅓πh²(3r - h)",
            desc: "Portion of a sphere cut by a plane.",
            calc: (v) => {
                if (v.h > 2 * v.r) throw new Error("Height cannot exceed sphere diameter.");
                return (1 / 3) * Math.PI * Math.pow(v.h, 2) * ((3 * v.r) - v.h);
            }
        }
    };

    // --- State ---
    let currentShape = "cube";
    let history = [];
    const maxHistory = 5;

    // --- Public Methods ---

    function getHtml() {
        return `
        <div class="vc-wrapper">
            <div class="vc-config-panel">
                <div class="vc-field-group">
                    <label class="vc-label">Select 3D Object</label>
                    <div class="vc-select-wrap">
                        <select id="vc-shape-select" class="vc-select">
                            ${Object.entries(shapes).map(([k, s]) => `<option value="${k}">${s.name}</option>`).join('')}
                        </select>
                        <i class="fas fa-cube vc-select-icon"></i>
                    </div>
                </div>
                <div class="vc-field-group">
                    <label class="vc-label">Output Unit</label>
                    <div class="vc-select-wrap">
                        <select id="vc-output-unit" class="vc-select">
                            ${Object.entries(volumeUnits).map(([k, u]) => `<option value="${k}" ${k === 'm3' ? 'selected' : ''}>${u.label}</option>`).join('')}
                        </select>
                        <i class="fas fa-ruler-combined vc-select-icon"></i>
                    </div>
                </div>
            </div>

            <div class="vc-visual-card">
                <div id="vc-svg-container" class="vc-svg-box"></div>
                
                <div class="vc-formula-section">
                    <button class="vc-formula-toggle" onclick="window.AppCalculators.category_6.volume_geom_calc.toggleFormula()">
                        <i class="fas fa-calculator"></i> View Formula
                    </button>
                    <div id="vc-formula-display" class="vc-formula-content" style="display:none;">
                        <code id="vc-formula-math"></code>
                        <p id="vc-formula-desc"></p>
                    </div>
                </div>
            </div>

            <div id="vc-input-grid" class="vc-input-grid"></div>

            <div class="vc-actions">
                <button id="vc-calc-btn" class="vc-btn vc-btn-primary">Calculate Volume</button>
                <button id="vc-reset-btn" class="vc-btn vc-btn-ghost">Reset</button>
            </div>

            <div id="vc-result-area" class="vc-result-box" style="display:none;">
                <div class="vc-result-header">Calculated Volume</div>
                <div class="vc-result-main">
                    <span id="vc-result-val">0</span>
                    <span id="vc-result-unit">m³</span>
                </div>
                <div class="vc-result-actions">
                    <button class="vc-mini-btn" onclick="window.AppCalculators.category_6.volume_geom_calc.copyResult()">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
            </div>

            <div class="vc-history">
                <div class="vc-history-head">
                    <span><i class="fas fa-history"></i> Recent</span>
                    <button class="vc-clear-hist" onclick="window.AppCalculators.category_6.volume_geom_calc.clearHistory()">Clear</button>
                </div>
                <ul id="vc-history-list" class="vc-history-list">
                    <li class="vc-empty">No calculations yet.</li>
                </ul>
            </div>
        </div>
        `;
    }

    function init() {
        const shapeSelect = document.getElementById('vc-shape-select');
        const calcBtn = document.getElementById('vc-calc-btn');
        const resetBtn = document.getElementById('vc-reset-btn');

        shapeSelect.addEventListener('change', (e) => {
            currentShape = e.target.value;
            updateUI();
            document.getElementById('vc-result-area').style.display = 'none';
        });

        calcBtn.addEventListener('click', calculate);

        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('.vc-input').forEach(inp => inp.value = '');
            document.getElementById('vc-result-area').style.display = 'none';
        });

        loadHistory();
        updateUI();
    }

    // --- UI Update Logic ---

    function updateUI() {
        const shape = shapes[currentShape];
        const container = document.getElementById('vc-input-grid');

        // 1. Render Inputs
        container.innerHTML = shape.inputs.map(inp => `
            <div class="vc-input-wrapper">
                <label>${inp.label}</label>
                <div class="vc-input-row">
                    <input type="number" id="vc-inp-${inp.id}" class="vc-input" placeholder="0" min="0" step="any">
                    <select id="vc-unit-${inp.id}" class="vc-unit-select">
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="m" selected>m</option>
                        <option value="in">in</option>
                        <option value="ft">ft</option>
                    </select>
                </div>
            </div>
        `).join('');

        // 2. Update Formula
        document.getElementById('vc-formula-math').textContent = shape.formula;
        document.getElementById('vc-formula-desc').textContent = shape.desc;

        // 3. Update Visual (SVG)
        renderVisual(currentShape);
    }

    function renderVisual(shapeKey) {
        const box = document.getElementById('vc-svg-container');
        const color = "#4f46e5"; // Primary Theme Color
        const fill = "rgba(79, 70, 229, 0.1)";
        let svg = '';

        // Simple Geometric Representations
        switch (shapeKey) {
            case 'cube':
                svg = `<rect x="60" y="60" width="80" height="80" fill="${fill}" stroke="${color}" stroke-width="2"/>
                       <path d="M60 60 L90 30 L170 30 L140 60 M170 30 L170 110 L140 140" fill="none" stroke="${color}" stroke-width="2"/>`;
                break;
            case 'sphere':
            case 'hemisphere':
            case 'spherical_cap':
                svg = `<circle cx="100" cy="100" r="70" fill="${fill}" stroke="${color}" stroke-width="2"/>
                       <ellipse cx="100" cy="100" rx="70" ry="20" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="4"/>`;
                if (shapeKey === 'hemisphere') svg = `<path d="M30 100 A70 70 0 0 0 170 100 Z" fill="${fill}" stroke="${color}" stroke-width="2"/><ellipse cx="100" cy="100" rx="70" ry="20" fill="none" stroke="${color}" stroke-width="2"/>`;
                break;
            case 'cylinder':
            case 'hollow_cylinder':
                svg = `<ellipse cx="100" cy="40" rx="60" ry="20" fill="${fill}" stroke="${color}" stroke-width="2"/>
                       <path d="M40 40 L40 160 A60 20 0 0 0 160 160 L160 40" fill="${fill}" stroke="${color}" stroke-width="2"/>
                       <ellipse cx="100" cy="160" rx="60" ry="20" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="4"/>`;
                break;
            case 'cone':
            case 'frustum_cone':
                svg = `<ellipse cx="100" cy="160" rx="70" ry="20" fill="${fill}" stroke="${color}" stroke-width="2"/>
                       <path d="M30 160 L100 20 L170 160" fill="none" stroke="${color}" stroke-width="2"/>`;
                break;
            default: // Generic box fallback
                svg = `<rect x="50" y="50" width="100" height="100" fill="${fill}" stroke="${color}" stroke-width="2" rx="10"/>
                       <text x="100" y="110" text-anchor="middle" fill="${color}" font-size="20">3D</text>`;
        }

        box.innerHTML = `<svg viewBox="0 0 200 200" width="100%" height="100%">${svg}</svg>`;
    }

    // --- Calculation Logic ---

    function calculate() {
        const shape = shapes[currentShape];
        let values = {};

        try {
            // 1. Parse and Convert Inputs to Meters (Standard Base Unit)
            shape.inputs.forEach(inp => {
                const valStr = document.getElementById(`vc-inp-${inp.id}`).value;
                const unitStr = document.getElementById(`vc-unit-${inp.id}`).value;

                if (valStr === '' || isNaN(valStr)) throw new Error(`Invalid value for ${inp.label}`);
                let val = parseFloat(valStr);

                if (val < 0) throw new Error(`${inp.label} cannot be negative.`);
                if (val === 0 && !['c'].includes(inp.id)) throw new Error(`${inp.label} should be greater than zero.`); // Basic check

                // Convert linear dimension to meters
                values[inp.id] = val * linearUnits[unitStr];
            });

            // 2. Calculate Volume in Cubic Meters (m³)
            const volInM3 = shape.calc(values);

            // 3. Convert Result to Output Unit
            const outUnitKey = document.getElementById('vc-output-unit').value;
            const outUnitData = volumeUnits[outUnitKey];

            const finalVol = volInM3 * outUnitData.factor;

            // 4. Display Result
            displayResult(finalVol, outUnitData.label);
            addToHistory(shape.name, finalVol, outUnitData.label);

        } catch (err) {
            alert("Error: " + err.message);
        }
    }

    function displayResult(val, unitLabel) {
        const resBox = document.getElementById('vc-result-area');
        const valEl = document.getElementById('vc-result-val');
        const unitEl = document.getElementById('vc-result-unit');

        // Smart formatting for very small/large numbers
        let formatted = (val < 1e-4 || val > 1e6)
            ? val.toExponential(4)
            : val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 });

        valEl.innerText = formatted;
        unitEl.innerText = unitLabel;
        resBox.style.display = 'flex';
        resBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- Helpers ---

    function toggleFormula() {
        const el = document.getElementById('vc-formula-display');
        el.style.display = (el.style.display === 'none') ? 'block' : 'none';
    }

    function copyResult() {
        const val = document.getElementById('vc-result-val').innerText;
        const unit = document.getElementById('vc-result-unit').innerText;
        navigator.clipboard.writeText(`${val} ${unit}`);

        const btn = document.querySelector('.vc-mini-btn');
        const orig = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-check"></i>`;
        setTimeout(() => btn.innerHTML = orig, 1500);
    }

    function addToHistory(name, val, unit) {
        history.unshift({ name, val: (typeof val === 'number' ? val.toPrecision(5) : val), unit, time: new Date().toLocaleTimeString() });
        if (history.length > maxHistory) history.pop();
        saveHistory();
        renderHistory();
    }

    function saveHistory() { localStorage.setItem('vc_history_3d', JSON.stringify(history)); }
    function loadHistory() {
        const d = localStorage.getItem('vc_history_3d');
        if (d) history = JSON.parse(d);
        renderHistory();
    }

    function clearHistory() { history = []; saveHistory(); renderHistory(); }

    function renderHistory() {
        const list = document.getElementById('vc-history-list');
        if (!history.length) { list.innerHTML = '<li class="vc-empty">No calculations yet.</li>'; return; }

        list.innerHTML = history.map(h => `
            <li class="vc-hist-item">
                <div class="vc-h-info"><strong>${h.name}</strong><small>${h.time}</small></div>
                <div class="vc-h-val">${h.val} ${h.unit}</div>
            </li>
        `).join('');
    }

    return { getHtml, init, calculate, toggleFormula, copyResult, clearHistory };

})();