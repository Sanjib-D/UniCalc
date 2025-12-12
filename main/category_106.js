if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_1) window.AppCalculators.category_1 = {};

window.AppCalculators.category_1.percent_calc = {
    // Current Mode Tracker
    currentMode: 'basic',

    getHtml: function () {
        return `
            <div class="percent-calc-container">
                
                <div class="pct-nav">
                    <button class="pct-nav-btn active" data-mode="basic" onclick="window.AppCalculators.category_1.percent_calc.setMode('basic')">% of Number</button>
                    <button class="pct-nav-btn" data-mode="what_percent" onclick="window.AppCalculators.category_1.percent_calc.setMode('what_percent')">What % is...</button>
                    <button class="pct-nav-btn" data-mode="change" onclick="window.AppCalculators.category_1.percent_calc.setMode('change')">% Increase/Decrease</button>
                    <button class="pct-nav-btn" data-mode="reverse" onclick="window.AppCalculators.category_1.percent_calc.setMode('reverse')">Reverse %</button>
                    <button class="pct-nav-btn" data-mode="fraction" onclick="window.AppCalculators.category_1.percent_calc.setMode('fraction')">Fraction to %</button>
                </div>

                <div class="pct-card" id="pct-content-area">
                    </div>

                <div class="pct-result-container" id="pct-result-box">
                    <div style="font-size:0.85rem; text-transform:uppercase; color:#888; letter-spacing:1px;">Result</div>
                    <div class="pct-main-res" id="pct-main-val">--</div>
                    <div id="pct-desc"></div>
                    <div class="pct-formula" id="pct-step"></div>
                </div>

            </div>
        `;
    },

    init: function () {
        // Load default mode
        this.setMode('basic');
    },

    setMode: function (mode) {
        this.currentMode = mode;
        const contentArea = document.getElementById('pct-content-area');
        const resBox = document.getElementById('pct-result-box');
        
        // Update Tabs
        document.querySelectorAll('.pct-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Hide previous result
        if(resBox) resBox.style.display = 'none';

        // Render Content based on Mode
        let html = '';
        
        if (mode === 'basic') {
            html = `
                <div class="pct-question">
                    <span class="pct-text">What is</span>
                    <input type="number" id="p-input-1" class="pct-input" placeholder="20">
                    <span class="pct-text">% &nbsp; of &nbsp;</span>
                    <input type="number" id="p-input-2" class="pct-input" placeholder="150">
                    <span class="pct-text">?</span>
                </div>
                <div class="pct-action-row">
                    <button class="pct-btn" onclick="window.AppCalculators.category_1.percent_calc.calculate()">Calculate</button>
                </div>
            `;
        } 
        else if (mode === 'what_percent') {
            html = `
                <div class="pct-question">
                    <input type="number" id="p-input-1" class="pct-input" placeholder="30">
                    <span class="pct-text">&nbsp; is what % of &nbsp;</span>
                    <input type="number" id="p-input-2" class="pct-input" placeholder="150">
                    <span class="pct-text">?</span>
                </div>
                <div class="pct-action-row">
                    <button class="pct-btn" onclick="window.AppCalculators.category_1.percent_calc.calculate()">Calculate</button>
                </div>
            `;
        }
        else if (mode === 'change') {
            html = `
                <div class="pct-question">
                    <span class="pct-text">From</span>
                    <input type="number" id="p-input-1" class="pct-input" placeholder="Original">
                    <span class="pct-text">&nbsp; to &nbsp;</span>
                    <input type="number" id="p-input-2" class="pct-input" placeholder="New">
                    <span class="pct-text">what is the % change?</span>
                </div>
                <div class="pct-action-row">
                    <button class="pct-btn" onclick="window.AppCalculators.category_1.percent_calc.calculate()">Calculate</button>
                </div>
            `;
        }
        else if (mode === 'reverse') {
            html = `
                <div class="pct-question" style="flex-direction:column; align-items:flex-start;">
                    <div style="margin-bottom:15px;">
                        <span class="pct-text">If a value </span>
                        <select id="p-select-op" class="pct-input" style="width:auto;">
                            <option value="inc">Increases by</option>
                            <option value="dec">Decreases by</option>
                        </select>
                        <input type="number" id="p-input-1" class="pct-input" placeholder="20" style="width:80px;">
                        <span class="pct-text">%</span>
                    </div>
                    <div>
                        <span class="pct-text">To become </span>
                        <input type="number" id="p-input-2" class="pct-input" placeholder="Final Val">
                        <span class="pct-text">, what was the original?</span>
                    </div>
                </div>
                <div class="pct-action-row">
                    <button class="pct-btn" onclick="window.AppCalculators.category_1.percent_calc.calculate()">Find Original</button>
                </div>
            `;
        }
        else if (mode === 'fraction') {
             html = `
                <div class="pct-question">
                    <span class="pct-text">Convert Fraction</span>
                    <input type="number" id="p-input-1" class="pct-input" placeholder="Numerator">
                    <span class="pct-text"> / </span>
                    <input type="number" id="p-input-2" class="pct-input" placeholder="Denominator">
                    <span class="pct-text">to Percentage</span>
                </div>
                <div class="pct-action-row">
                    <button class="pct-btn" onclick="window.AppCalculators.category_1.percent_calc.calculate()">Convert</button>
                </div>
            `;
        }

        contentArea.innerHTML = html;
        
        // Add Enter key support
        const inputs = contentArea.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if(e.key === 'Enter') this.calculate();
            });
        });
    },

    calculate: function () {
        const mode = this.currentMode;
        const v1 = parseFloat(document.getElementById('p-input-1').value);
        const v2 = parseFloat(document.getElementById('p-input-2').value);
        
        const resBox = document.getElementById('pct-result-box');
        const mainVal = document.getElementById('pct-main-val');
        const step = document.getElementById('pct-step');
        const desc = document.getElementById('pct-desc');

        if (isNaN(v1) || (mode !== 'basic' && isNaN(v2))) {
            if(mode === 'basic' && isNaN(v2)) {/* v2 required */}
            else {
                alert("Please enter valid numbers");
                return;
            }
        }

        let result = 0;
        let formula = "";
        let description = "";

        resBox.style.display = 'block';

        switch (mode) {
            case 'basic': // What is X% of Y
                result = (v1 / 100) * v2;
                formula = `(${v1} / 100) × ${v2} = ${result}`;
                description = `${v1}% of ${v2} is:`;
                mainVal.innerHTML = parseFloat(result.toFixed(4));
                break;

            case 'what_percent': // X is what % of Y
                if(v2 === 0) { alert("Cannot divide by zero"); return; }
                result = (v1 / v2) * 100;
                formula = `(${v1} / ${v2}) × 100 = ${result.toFixed(2)}%`;
                description = `${v1} is this percent of ${v2}:`;
                mainVal.innerHTML = `${parseFloat(result.toFixed(2))}%`;
                break;

            case 'change': // Change from X to Y
                if(v1 === 0) { alert("Original value cannot be zero for % change"); return; }
                let diff = v2 - v1;
                result = (diff / v1) * 100;
                let direction = result > 0 ? "Increase" : result < 0 ? "Decrease" : "No Change";
                let sign = result > 0 ? "+" : "";
                
                formula = `((${v2} - ${v1}) / ${v1}) × 100 = ${result.toFixed(2)}%`;
                description = `Total percentage ${direction}:`;
                mainVal.innerHTML = `${sign}${parseFloat(result.toFixed(2))}%`;
                
                // Color coding
                if(result > 0) mainVal.style.color = "#28a745";
                else if(result < 0) mainVal.style.color = "#dc3545";
                else mainVal.style.color = "var(--dark)";
                break;

            case 'reverse': // Find Original
                // v1 is percent, v2 is final value
                // Logic depends on select
                const op = document.getElementById('p-select-op').value;
                if(op === 'inc') {
                    // Original + (Original * P/100) = Final  => Original * (1 + P/100) = Final
                    result = v2 / (1 + (v1 / 100));
                    formula = `${v2} / (1 + ${v1/100}) = ${result.toFixed(2)}`;
                    description = `Original value before ${v1}% increase:`;
                } else {
                    // Original * (1 - P/100) = Final
                    result = v2 / (1 - (v1 / 100));
                    formula = `${v2} / (1 - ${v1/100}) = ${result.toFixed(2)}`;
                    description = `Original value before ${v1}% decrease:`;
                }
                mainVal.innerHTML = parseFloat(result.toFixed(2));
                break;
            
            case 'fraction': // X / Y as %
                if(v2 === 0) { alert("Denominator cannot be zero"); return; }
                result = (v1 / v2) * 100;
                formula = `(${v1} ÷ ${v2}) × 100 = ${result.toFixed(4)}%`;
                description = `Fraction as percentage:`;
                mainVal.innerHTML = `${parseFloat(result.toFixed(4))}%`;
                break;
        }

        step.innerHTML = `<i class="fas fa-calculator" style="margin-right:5px; opacity:0.7;"></i> ${formula}`;
        desc.innerHTML = description;
    }
};