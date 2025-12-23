/**
 * Area Calculator (Shapes) - Category 6, Tool 1
 * Strictly implements requirements for:
 * - 10+ Shapes (Square, Rectangle, Circle, Triangle, Polygon, etc.)
 * - Unit Conversion (mm, cm, m, km, in, ft, yd, ac, ha)
 * - Real-time Validation & Error Handling
 * - SVG Visualization & Formula Display
 * - History Management
 */

if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_6) window.AppCalculators.category_6 = {};

window.AppCalculators.category_6.area_shape_calc = (function() {
    
    // --- Configuration & Data ---
    const config = {
        precision: 4,
        maxHistory: 5
    };

    // Shape Definitions: Inputs, Formulas, and Descriptions
    const shapes = {
        square: { 
            name: "Square", 
            inputs: [{ id: "s", label: "Side Length (a)", min: 0 }],
            formula: "A = a²",
            desc: "Area is the side length squared."
        },
        rectangle: { 
            name: "Rectangle", 
            inputs: [{ id: "l", label: "Length (l)", min: 0 }, { id: "w", label: "Width (w)", min: 0 }],
            formula: "A = l × w",
            desc: "Area is the product of length and width."
        },
        circle: { 
            name: "Circle", 
            inputs: [{ id: "r", label: "Radius (r)", min: 0 }],
            formula: "A = πr²",
            desc: "Area is π times the radius squared."
        },
        triangle: { 
            name: "Triangle (Base & Height)", 
            inputs: [{ id: "b", label: "Base (b)", min: 0 }, { id: "h", label: "Height (h)", min: 0 }],
            formula: "A = ½ × b × h",
            desc: "Area is half the base times the height."
        },
        triangle_heron: { 
            name: "Triangle (3 Sides - Heron's)", 
            inputs: [{ id: "s1", label: "Side A", min: 0 }, { id: "s2", label: "Side B", min: 0 }, { id: "s3", label: "Side C", min: 0 }],
            formula: "A = √[s(s-a)(s-b)(s-c)]",
            desc: "Calculated using Heron's Formula where s is semi-perimeter."
        },
        parallelogram: { 
            name: "Parallelogram", 
            inputs: [{ id: "b", label: "Base (b)", min: 0 }, { id: "h", label: "Vertical Height (h)", min: 0 }],
            formula: "A = b × h",
            desc: "Area is base times vertical height."
        },
        trapezium: { 
            name: "Trapezium / Trapezoid", 
            inputs: [{ id: "a", label: "Base A (a)", min: 0 }, { id: "b", label: "Base B (b)", min: 0 }, { id: "h", label: "Height (h)", min: 0 }],
            formula: "A = ½(a + b)h",
            desc: "Area is the average of the bases times height."
        },
        rhombus: { 
            name: "Rhombus", 
            inputs: [{ id: "p", label: "Diagonal 1 (p)", min: 0 }, { id: "q", label: "Diagonal 2 (q)", min: 0 }],
            formula: "A = ½ × p × q",
            desc: "Area is half the product of the diagonals."
        },
        kite: { 
            name: "Kite", 
            inputs: [{ id: "p", label: "Diagonal 1 (p)", min: 0 }, { id: "q", label: "Diagonal 2 (q)", min: 0 }],
            formula: "A = ½ × p × q",
            desc: "Similar to a rhombus, area is half the product of diagonals."
        },
        ellipse: { 
            name: "Ellipse", 
            inputs: [{ id: "a", label: "Semi-major Axis (a)", min: 0 }, { id: "b", label: "Semi-minor Axis (b)", min: 0 }],
            formula: "A = π × a × b",
            desc: "Area is π times the product of the two semi-axes."
        },
        regular_polygon: { 
            name: "Regular Polygon", 
            inputs: [{ id: "n", label: "Number of Sides (n)", min: 3, step: 1 }, { id: "s", label: "Side Length (s)", min: 0 }],
            formula: "A = (n × s²) / (4 × tan(π/n))",
            desc: "Standard formula for any regular n-sided polygon."
        },
        annulus: { 
            name: "Annulus (Ring)", 
            inputs: [{ id: "R", label: "Outer Radius (R)", min: 0 }, { id: "r", label: "Inner Radius (r)", min: 0 }],
            formula: "A = π(R² - r²)",
            desc: "Area is the difference between the outer and inner circles."
        },
        sector: { 
            name: "Sector of Circle", 
            inputs: [{ id: "r", label: "Radius (r)", min: 0 }, { id: "theta", label: "Angle (degrees)", min: 0, max: 360 }],
            formula: "A = (θ/360) × πr²",
            desc: "Area is a fraction of the full circle."
        }
    };

    // Conversion factors relative to Square Meters (m²)
    const units = {
        sq_mm: { label: "mm²", factor: 0.000001 },
        sq_cm: { label: "cm²", factor: 0.0001 },
        sq_m:  { label: "m²",  factor: 1 },
        sq_km: { label: "km²", factor: 1000000 },
        sq_in: { label: "in²", factor: 0.00064516 },
        sq_ft: { label: "ft²", factor: 0.09290304 },
        sq_yd: { label: "yd²", factor: 0.83612736 },
        acre:  { label: "ac",  factor: 4046.8564224 },
        hectare: { label: "ha", factor: 10000 }
    };

    // --- State Management ---
    let currentShape = 'square';
    let history = [];

    // --- Public Methods ---

    function getHtml() {
        return `
        <div class="area-calc-wrapper">
            <div class="ac-controls">
                <div class="ac-group">
                    <label class="ac-label">Select Shape</label>
                    <div class="ac-select-wrapper">
                        <select id="ac-shape-select" class="ac-select">
                            ${Object.keys(shapes).map(k => `<option value="${k}">${shapes[k].name}</option>`).join('')}
                        </select>
                        <i class="fas fa-chevron-down ac-select-icon"></i>
                    </div>
                </div>
                <div class="ac-group">
                    <label class="ac-label">Output Unit</label>
                    <div class="ac-select-wrapper">
                        <select id="ac-unit-select" class="ac-select">
                            ${Object.keys(units).map(k => `<option value="${k}" ${k === 'sq_m' ? 'selected' : ''}>${units[k].label}</option>`).join('')}
                        </select>
                        <i class="fas fa-chevron-down ac-select-icon"></i>
                    </div>
                </div>
            </div>

            <div class="ac-visual-container">
                <div id="ac-visual-canvas" class="ac-canvas">
                    </div>
                <div class="ac-formula-overlay">
                    <button class="ac-toggle-btn" onclick="window.AppCalculators.category_6.area_shape_calc.toggleFormula()">
                        <i class="fas fa-square-root-alt"></i> Show Formula
                    </button>
                    <div id="ac-formula-box" class="ac-formula-content" style="display:none;">
                        <code id="ac-formula-text">A = a²</code>
                        <small id="ac-formula-desc">Area is the side length squared.</small>
                    </div>
                </div>
            </div>

            <div id="ac-inputs-container" class="ac-inputs-grid">
                </div>

            <div class="ac-actions">
                <button id="ac-calc-btn" class="ac-btn ac-btn-primary">Calculate Area</button>
                <button id="ac-reset-btn" class="ac-btn ac-btn-secondary">Reset</button>
            </div>

            <div id="ac-result-container" class="ac-result-box" style="display:none;">
                <span class="ac-result-label">Calculated Area</span>
                <div class="ac-result-value-row">
                    <span id="ac-result-value" class="ac-result-number">0.00</span>
                    <span id="ac-result-unit" class="ac-result-unit">m²</span>
                </div>
                <button class="ac-copy-btn" onclick="window.AppCalculators.category_6.area_shape_calc.copyResult()">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>

            <div class="ac-history-section">
                <div class="ac-history-header">
                    <h4><i class="fas fa-history"></i> Recent Calculations</h4>
                    <button class="ac-clear-history" onclick="window.AppCalculators.category_6.area_shape_calc.clearHistory()">Clear</button>
                </div>
                <ul id="ac-history-list" class="ac-history-list">
                    <li class="ac-empty-msg">No history yet.</li>
                </ul>
            </div>
        </div>
        `;
    }

    function init() {
        // Event Listeners
        document.getElementById('ac-shape-select').addEventListener('change', (e) => {
            currentShape = e.target.value;
            renderInputs();
            renderVisual();
            hideResult();
        });

        document.getElementById('ac-calc-btn').addEventListener('click', calculate);
        
        document.getElementById('ac-reset-btn').addEventListener('click', () => {
            document.querySelectorAll('.ac-input').forEach(i => i.value = '');
            hideResult();
        });

        // Load History
        loadHistory();

        // Initial Render
        renderInputs();
        renderVisual();
    }

    // --- UI Rendering ---

    function renderInputs() {
        const container = document.getElementById('ac-inputs-container');
        const shapeData = shapes[currentShape];
        
        // Update Formula Text (hidden or shown)
        document.getElementById('ac-formula-text').textContent = shapeData.formula;
        document.getElementById('ac-formula-desc').textContent = shapeData.desc;

        let html = '';
        shapeData.inputs.forEach(inp => {
            html += `
            <div class="ac-input-group">
                <label for="ac-inp-${inp.id}">${inp.label}</label>
                <div class="ac-input-wrapper">
                    <input type="number" id="ac-inp-${inp.id}" class="ac-input" placeholder="0" step="any" min="${inp.min || 0}">
                    <select id="ac-unit-${inp.id}" class="ac-unit-mini">
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="m" selected>m</option>
                        <option value="in">in</option>
                        <option value="ft">ft</option>
                    </select>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    }

    function renderVisual() {
        const canvas = document.getElementById('ac-visual-canvas');
        let svgContent = '';
        const color = "#007bff";
        const fill = "rgba(0, 123, 255, 0.1)";
        const strokeWidth = 2;

        switch(currentShape) {
            case 'square':
                svgContent = `<rect x="50" y="50" width="100" height="100" stroke="${color}" fill="${fill}" stroke-width="${strokeWidth}"/>`; break;
            case 'rectangle':
                svgContent = `<rect x="30" y="60" width="140" height="80" stroke="${color}" fill="${fill}" stroke-width="${strokeWidth}"/>`; break;
            case 'circle':
                svgContent = `<circle cx="100" cy="100" r="60" stroke="${color}" fill="${fill}" stroke-width="${strokeWidth}"/>`; break;
            case 'triangle':
            case 'triangle_heron':
                svgContent = `<polygon points="100,30 170,150 30,150" stroke="${color}" fill="${fill}" stroke-width="${strokeWidth}"/>`; break;
            case 'parallelogram':
                svgContent = `<polygon points="60,150 160,150 140,50 40,50" stroke="${color}" fill="${fill}" stroke-width="${strokeWidth}"/>`; break;
            case 'trapezium':
                svgContent = `<polygon points="40,150 160,150 130,50 70,50" stroke="${color}" fill="${fill}" stroke-width="${strokeWidth}"/>`; break;
            case 'rhombus':
            case 'kite':
                svgContent = `<polygon points="100,30 150,100 100,170 50,100" stroke="${color}" fill="${fill}" stroke-width="${strokeWidth}"/>`; break;
            case 'ellipse':
                svgContent = `<ellipse cx="100" cy="100" rx="80" ry="50" stroke="${color}" fill="${fill}" stroke-width="${strokeWidth}"/>`; break;
            case 'regular_polygon':
                svgContent = `<polygon points="100,30 160,65 160,135 100,170 40,135 40,65" stroke="${color}" fill="${fill}" stroke-width="${strokeWidth}"/>`; break;
            case 'sector':
                svgContent = `<path d="M100,100 L160,100 A60,60 0 0,0 142.4,57.6 Z" stroke="${color}" fill="${fill}" stroke-width="${strokeWidth}"/><circle cx="100" cy="100" r="2" fill="${color}"/>`; break;
            case 'annulus':
                svgContent = `<circle cx="100" cy="100" r="70" stroke="${color}" fill="${fill}" stroke-width="${strokeWidth}"/><circle cx="100" cy="100" r="40" stroke="${color}" fill="white" stroke-width="${strokeWidth}"/>`; break;
        }

        canvas.innerHTML = `<svg width="200" height="200" viewBox="0 0 200 200">${svgContent}</svg>`;
    }

    // --- Calculation Logic ---

    // Standardize input length to meters
    function toMeters(val, unit) {
        const factorsToM = { 'mm': 0.001, 'cm': 0.01, 'm': 1.0, 'in': 0.0254, 'ft': 0.3048 };
        return val * (factorsToM[unit] || 1);
    }

    function calculate() {
        const shape = shapes[currentShape];
        let areaSqM = 0;
        let inputs = {};

        try {
            shape.inputs.forEach(def => {
                const el = document.getElementById(`ac-inp-${def.id}`);
                const unitEl = document.getElementById(`ac-unit-${def.id}`);
                const rawVal = parseFloat(el.value);
                const unit = unitEl.value;

                if (isNaN(rawVal)) throw new Error(`Please enter a valid number for ${def.label}`);
                if (rawVal < 0) throw new Error(`${def.label} cannot be negative.`);
                if (def.id === 'n' && (!Number.isInteger(rawVal) || rawVal < 3)) throw new Error("Number of sides must be an integer >= 3.");

                if (def.id === 'theta' || def.id === 'n') {
                    inputs[def.id] = rawVal;
                } else {
                    inputs[def.id] = toMeters(rawVal, unit);
                }
            });
        } catch (e) {
            alert(e.message);
            return;
        }

        const PI = Math.PI;
        
        switch(currentShape) {
            case 'square': areaSqM = Math.pow(inputs.s, 2); break;
            case 'rectangle': areaSqM = inputs.l * inputs.w; break;
            case 'circle': areaSqM = PI * Math.pow(inputs.r, 2); break;
            case 'triangle': areaSqM = 0.5 * inputs.b * inputs.h; break;
            case 'triangle_heron':
                const s = (inputs.s1 + inputs.s2 + inputs.s3) / 2;
                if (s <= inputs.s1 || s <= inputs.s2 || s <= inputs.s3) { alert("Invalid Triangle: Check side lengths."); return; }
                areaSqM = Math.sqrt(s * (s - inputs.s1) * (s - inputs.s2) * (s - inputs.s3)); break;
            case 'parallelogram': areaSqM = inputs.b * inputs.h; break;
            case 'trapezium': areaSqM = 0.5 * (inputs.a + inputs.b) * inputs.h; break;
            case 'rhombus':
            case 'kite': areaSqM = 0.5 * inputs.p * inputs.q; break;
            case 'ellipse': areaSqM = PI * inputs.a * inputs.b; break;
            case 'regular_polygon': areaSqM = (inputs.n * Math.pow(inputs.s, 2)) / (4 * Math.tan(PI / inputs.n)); break;
            case 'annulus':
                if (inputs.r >= inputs.R) { alert("Inner radius (r) must be smaller than outer radius (R)."); return; }
                areaSqM = PI * (Math.pow(inputs.R, 2) - Math.pow(inputs.r, 2)); break;
            case 'sector': areaSqM = (inputs.theta / 360) * PI * Math.pow(inputs.r, 2); break;
        }

        const outUnitKey = document.getElementById('ac-unit-select').value;
        const outFactor = units[outUnitKey].factor;
        const finalVal = areaSqM / outFactor;

        showResult(finalVal, units[outUnitKey].label);
        addToHistory(currentShape, finalVal, units[outUnitKey].label);
    }

    function showResult(val, unitLabel) {
        const resultBox = document.getElementById('ac-result-container');
        const valSpan = document.getElementById('ac-result-value');
        const unitSpan = document.getElementById('ac-result-unit');
        
        let formatted = val < 1e-4 || val > 1e6 ? val.toExponential(4) : val.toLocaleString(undefined, { maximumFractionDigits: 4 });

        valSpan.textContent = formatted;
        unitSpan.textContent = unitLabel;
        resultBox.style.display = "block";
        resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function hideResult() {
        document.getElementById('ac-result-container').style.display = "none";
    }

    function toggleFormula() {
        const box = document.getElementById('ac-formula-box');
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }

    function copyResult() {
        const val = document.getElementById('ac-result-value').textContent;
        const unit = document.getElementById('ac-result-unit').textContent;
        navigator.clipboard.writeText(`${val} ${unit}`).then(() => {
            const btn = document.querySelector('.ac-copy-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied';
            setTimeout(() => btn.innerHTML = originalText, 2000);
        });
    }

    function addToHistory(shapeKey, val, unit) {
        const shapeName = shapes[shapeKey].name;
        const entry = {
            shape: shapeName,
            val: val < 1e-4 || val > 1e6 ? val.toExponential(3) : val.toFixed(3),
            unit: unit,
            time: new Date().toLocaleTimeString()
        };
        history.unshift(entry);
        if (history.length > config.maxHistory) history.pop();
        saveHistory();
        renderHistory();
    }

    function saveHistory() { localStorage.setItem('ac_area_history', JSON.stringify(history)); }
    function loadHistory() {
        const saved = localStorage.getItem('ac_area_history');
        if (saved) history = JSON.parse(saved);
        renderHistory();
    }

    function renderHistory() {
        const list = document.getElementById('ac-history-list');
        if (history.length === 0) { list.innerHTML = '<li class="ac-empty-msg">No recent calculations.</li>'; return; }
        list.innerHTML = history.map(item => `
            <li class="ac-history-item">
                <div class="ac-hist-info"><strong>${item.shape}</strong><small>${item.time}</small></div>
                <div class="ac-hist-val">${item.val} <span class="ac-hist-unit">${item.unit}</span></div>
            </li>`).join('');
    }

    function clearHistory() { history = []; saveHistory(); renderHistory(); }

    return { getHtml, init, calculate, toggleFormula, copyResult, clearHistory };
})();