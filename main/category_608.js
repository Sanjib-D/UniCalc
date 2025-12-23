// Logic for Ratio Calculator (Category 6, Tool 8)
// ID: ratio_calc

(function() {
    if (!window.AppCalculators.category_6) {
        window.AppCalculators.category_6 = {};
    }

    const toolId = "ratio_calc";
    const historyKey = "ratio_calc_history";

    const toolObj = {
        state: {
            mode: 'simplify' // 'simplify', 'solve', 'scale'
        },

        getHtml: function() {
            return `
                <div class="rc-wrapper">
                    <div class="rc-tabs">
                        <button class="rc-tab active" onclick="window.AppCalculators.category_6.ratio_calc.switchTab('simplify', this)">Simplify / Analyze</button>
                        <button class="rc-tab" onclick="window.AppCalculators.category_6.ratio_calc.switchTab('solve', this)">Solve Missing (X)</button>
                        <button class="rc-tab" onclick="window.AppCalculators.category_6.ratio_calc.switchTab('scale', this)">Resize / Scale</button>
                    </div>

                    <div class="rc-card">
                        <div id="rc-panel-simplify">
                            <label class="rc-label">Enter Ratio Values</label>
                            <textarea id="rc-input-simple" class="rc-textarea" placeholder="e.g. 4 : 8 : 12  or  15, 30, 45"></textarea>
                            <div class="rc-hint"><i class="fas fa-info-circle"></i> Supports colon (:), comma (,), or space separators.</div>
                        </div>

                        <div id="rc-panel-solve" style="display:none;">
                            <label class="rc-label" style="text-align:center;">Solve Proportion (A : B = C : X)</label>
                            <div class="rc-prop-grid">
                                <div class="rc-prop-box">
                                    <label>A</label>
                                    <input type="number" id="rc-prop-a" class="rc-prop-input" placeholder="A">
                                </div>
                                <div class="rc-symbol">:</div>
                                <div class="rc-prop-box">
                                    <label>B</label>
                                    <input type="number" id="rc-prop-b" class="rc-prop-input" placeholder="B">
                                </div>
                                <div class="rc-symbol">=</div>
                                <div class="rc-prop-box">
                                    <label>C</label>
                                    <input type="number" id="rc-prop-c" class="rc-prop-input" placeholder="C">
                                </div>
                                <div class="rc-symbol">:</div>
                                <div class="rc-prop-box">
                                    <label>X</label>
                                    <input type="text" id="rc-prop-x" class="rc-prop-input" placeholder="?" readonly style="background:#f1f5f9; cursor:not-allowed;">
                                </div>
                            </div>
                            <div class="rc-hint" style="justify-content:center; margin-top:15px;">Leave 'X' empty. Enter any 3 values to find the 4th.</div>
                        </div>

                        <div id="rc-panel-scale" style="display:none;">
                            <div class="rc-input-group">
                                <label class="rc-label">Original Ratio</label>
                                <input type="text" id="rc-scale-ratio" class="rc-textarea" style="min-height:45px; height:45px;" placeholder="e.g. 2 : 3 : 5">
                            </div>
                            <div class="rc-input-group">
                                <label class="rc-label">Scale By</label>
                                <select id="rc-scale-type" class="rc-prop-input" style="width:100%; text-align:left; padding:0 10px; margin-bottom:10px;" onchange="window.AppCalculators.category_6.ratio_calc.updateScaleInputs()">
                                    <option value="factor">Multiplier Factor (e.g. 2x, 0.5x)</option>
                                    <option value="total">New Total Sum</option>
                                </select>
                                <input type="number" id="rc-scale-val" class="rc-textarea" style="min-height:45px; height:45px;" placeholder="Enter multiplier (e.g. 2)">
                            </div>
                        </div>

                        <div id="rc-error-msg" class="rc-error"></div>

                        <div class="rc-actions">
                            <button class="rc-btn rc-btn-primary" id="action-btn">Calculate</button>
                            <button class="rc-btn rc-btn-secondary" id="reset-rc-btn">Reset</button>
                        </div>
                    </div>

                    <div id="rc-result-area" class="rc-result-area" style="display:none;"></div>

                    <div class="rc-history">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <h4 style="margin:0; color:#64748b;">Recent Calculations</h4>
                            <button onclick="window.AppCalculators.category_6.ratio_calc.clearHistory()" style="background:none; border:none; color:#ef4444; cursor:pointer;">Clear</button>
                        </div>
                        <div id="rc-history-list" class="rc-hist-list">
                            <span style="color:#cbd5e1; font-style:italic;">No history yet</span>
                        </div>
                    </div>
                </div>
            `;
        },

        init: function() {
            // Reset listener
            document.getElementById('reset-rc-btn').addEventListener('click', () => {
                this.resetInputs();
            });

            // Input handling for Solve Mode: Allow user to input in X field if they want to solve for another variable?
            // For simplicity, let's keep X as the target visually, but logic can handle "Any 3 inputs".
            const propInputs = ['rc-prop-a', 'rc-prop-b', 'rc-prop-c', 'rc-prop-x'];
            propInputs.forEach(id => {
                const el = document.getElementById(id);
                el.removeAttribute('readonly'); 
                el.style.background = 'white';
                el.style.cursor = 'text';
                
                el.addEventListener('input', () => {
                    // Highlight which one is empty (the target)
                    const filledCount = propInputs.filter(pid => document.getElementById(pid).value !== '').length;
                    if(filledCount === 3) {
                        const emptyId = propInputs.find(pid => document.getElementById(pid).value === '');
                        if(emptyId) {
                            document.getElementById(emptyId).placeholder = "?";
                            document.getElementById(emptyId).style.borderColor = "#4361ee";
                        }
                    } else {
                        propInputs.forEach(pid => document.getElementById(pid).style.borderColor = "#cbd5e1");
                    }
                });
            });

            this.renderHistory();
        },

        resetInputs: function() {
            document.querySelectorAll('input, textarea').forEach(el => el.value = '');
            document.getElementById('rc-result-area').style.display = 'none';
            document.getElementById('rc-error-msg').style.display = 'none';
        },

        switchTab: function(mode, tabEl) {
            this.state.mode = mode;
            document.querySelectorAll('.rc-tab').forEach(t => t.classList.remove('active'));
            tabEl.classList.add('active');

            document.getElementById('rc-panel-simplify').style.display = 'none';
            document.getElementById('rc-panel-solve').style.display = 'none';
            document.getElementById('rc-panel-scale').style.display = 'none';
            document.getElementById(`rc-panel-${mode}`).style.display = 'block';

            document.getElementById('rc-result-area').style.display = 'none';
            document.getElementById('rc-error-msg').style.display = 'none';
        },

        updateScaleInputs: function() {
            const type = document.getElementById('rc-scale-type').value;
            const input = document.getElementById('rc-scale-val');
            if (type === 'factor') {
                input.placeholder = "Enter multiplier (e.g. 2 for double)";
            } else {
                input.placeholder = "Enter new total sum for all parts";
            }
        },

        calculate: function() {
            const mode = this.state.mode;
            document.getElementById('rc-error-msg').style.display = 'none';
            
            if (mode === 'simplify') return this.calcSimplify();
            if (mode === 'solve') return this.calcSolve();
            if (mode === 'scale') return this.calcScale();
        },

        // --- Mode 1: Simplify ---
        calcSimplify: function() {
            const raw = document.getElementById('rc-input-simple').value;
            const nums = this.parseInput(raw);

            if (nums.length < 2) return this.showError("Please enter at least two numbers.");

            // Logic: Find GCD
            // Note: GCD works best for integers. 
            // If decimals, multiply all by power of 10 to make int, then simplify, then divide back?
            // Actually standard ratio simplification for decimals usually means "Make them integers".
            // e.g. 1.5 : 3 -> 15 : 30 -> 1 : 2.
            
            // 1. Find max decimal places
            let maxDec = 0;
            nums.forEach(n => {
                const s = n.toString();
                if (s.includes('.')) {
                    maxDec = Math.max(maxDec, s.split('.')[1].length);
                }
            });

            const factor = Math.pow(10, maxDec);
            const intNums = nums.map(n => Math.round(n * factor));
            
            // 2. Calculate GCD of all ints
            const common = this.findGCDArray(intNums);
            
            // 3. Divide
            const simplified = intNums.map(n => n / common);
            
            // 4. Unit Ratio (1 : n)
            const unitRatio = nums.map(n => n / nums[0]);

            // Render
            const resArea = document.getElementById('rc-result-area');
            const total = nums.reduce((a,b)=>a+b, 0);
            const simpTotal = simplified.reduce((a,b)=>a+b, 0);

            let visualHtml = '<div class="rc-visual-container">';
            simplified.forEach((val, i) => {
                const pct = (val / simpTotal * 100).toFixed(1);
                visualHtml += `
                    <div class="rc-bar-row">
                        <div class="rc-bar-label">${String.fromCharCode(65+i)}</div>
                        <div class="rc-bar-track">
                            <div class="rc-bar-fill" style="width:${pct}%">${pct}%</div>
                        </div>
                    </div>
                `;
            });
            visualHtml += '</div>';

            const steps = [
                `1. Convert to integers (multiply by ${factor}): [${intNums.join(', ')}]`,
                `2. Find Greatest Common Divisor (GCD): ${common}`,
                `3. Divide each term by ${common}: [${simplified.join(', ')}]`
            ];

            const html = `
                <div class="rc-main-res">
                    ${simplified.join(' : ')}
                    <button class="rc-copy-abs" onclick="navigator.clipboard.writeText('${simplified.join(':')}')">Copy</button>
                </div>
                ${visualHtml}
                <div class="rc-details">
                    <div class="rc-detail-box">
                        <div class="rc-detail-title">Total Parts</div>
                        <div class="rc-detail-val">${simpTotal}</div>
                    </div>
                    <div class="rc-detail-box">
                        <div class="rc-detail-title">Unit Ratio (1 : n)</div>
                        <div class="rc-detail-val">1 : ${unitRatio.slice(1).map(n => parseFloat(n.toFixed(4))).join(' : ')}</div>
                    </div>
                </div>
                <div class="rc-steps">
                    <div class="rc-steps-head" onclick="this.nextElementSibling.classList.toggle('show')">
                        <span>Show Calculation Steps</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="rc-steps-body">
                        ${steps.map(s => `<div class="rc-step-line">${s}</div>`).join('')}
                    </div>
                </div>
            `;
            
            resArea.innerHTML = html;
            resArea.style.display = 'block';
            this.addToHistory(`Simplify [${nums.join(':')}]`, simplified.join(':'));
        },

        // --- Mode 2: Solve ---
        calcSolve: function() {
            const aVal = document.getElementById('rc-prop-a').value;
            const bVal = document.getElementById('rc-prop-b').value;
            const cVal = document.getElementById('rc-prop-c').value;
            const xVal = document.getElementById('rc-prop-x').value;

            const vals = { a: aVal, b: bVal, c: cVal, x: xVal };
            const keys = ['a', 'b', 'c', 'x'];
            const emptyKeys = keys.filter(k => vals[k] === '');

            if (emptyKeys.length !== 1) {
                return this.showError("Please enter exactly 3 values to find the 4th.");
            }

            const target = emptyKeys[0];
            const A = parseFloat(vals.a);
            const B = parseFloat(vals.b);
            const C = parseFloat(vals.c);
            const X = parseFloat(vals.x);

            let result, formula;
            
            // Formula: A/B = C/X  =>  A*X = B*C
            if (target === 'x') {
                // X = (B*C)/A
                result = (B * C) / A;
                formula = `X = (B × C) / A = (${B} × ${C}) / ${A}`;
            } else if (target === 'c') {
                // C = (A*X)/B
                result = (A * X) / B;
                formula = `C = (A × X) / B = (${A} × ${X}) / ${B}`;
            } else if (target === 'b') {
                // B = (A*X)/C
                result = (A * X) / C;
                formula = `B = (A × X) / C = (${A} × ${X}) / ${C}`;
            } else if (target === 'a') {
                // A = (B*C)/X
                result = (B * C) / X;
                formula = `A = (B × C) / X = (${B} × ${C}) / ${X}`;
            }

            if (!isFinite(result) || isNaN(result)) {
                return this.showError("Result is undefined (division by zero). Check your inputs.");
            }

            const prettyRes = Number.isInteger(result) ? result : result.toFixed(4);
            const resArea = document.getElementById('rc-result-area');
            
            resArea.innerHTML = `
                <div class="rc-main-res">
                    ${target.toUpperCase()} = ${prettyRes}
                    <button class="rc-copy-abs" onclick="navigator.clipboard.writeText('${prettyRes}')">Copy</button>
                </div>
                <div class="rc-steps" style="margin-top:0;">
                    <div class="rc-steps-body show">
                        <strong>Logic:</strong> Cross-multiply to solve for ${target.toUpperCase()}.<br>
                        ${formula} = <strong>${prettyRes}</strong>
                    </div>
                </div>
            `;
            resArea.style.display = 'block';
            this.addToHistory(`Solve Proportion`, `${target.toUpperCase()} = ${prettyRes}`);
        },

        // --- Mode 3: Scale ---
        calcScale: function() {
            const rawRatio = document.getElementById('rc-scale-ratio').value;
            const scaleVal = parseFloat(document.getElementById('rc-scale-val').value);
            const type = document.getElementById('rc-scale-type').value;

            const nums = this.parseInput(rawRatio);
            if (nums.length < 2) return this.showError("Invalid Ratio format.");
            if (isNaN(scaleVal)) return this.showError("Invalid Scale Value.");

            let scaledNums = [];
            let factor = 1;

            if (type === 'factor') {
                factor = scaleVal;
                scaledNums = nums.map(n => n * factor);
            } else {
                // Scale by Total
                const currentTotal = nums.reduce((a,b) => a+b, 0);
                if (currentTotal === 0) return this.showError("Cannot scale a ratio summing to zero by total.");
                factor = scaleVal / currentTotal;
                scaledNums = nums.map(n => n * factor);
            }

            const formatted = scaledNums.map(n => Number.isInteger(n) ? n : parseFloat(n.toFixed(2)));

            const resArea = document.getElementById('rc-result-area');
            resArea.innerHTML = `
                <div class="rc-main-res">
                    ${formatted.join(' : ')}
                    <button class="rc-copy-abs" onclick="navigator.clipboard.writeText('${formatted.join(':')}')">Copy</button>
                </div>
                <div class="rc-details">
                    <div class="rc-detail-box">
                        <div class="rc-detail-title">Scaling Factor</div>
                        <div class="rc-detail-val">${factor.toFixed(4)}x</div>
                    </div>
                    <div class="rc-detail-box">
                        <div class="rc-detail-title">New Total</div>
                        <div class="rc-detail-val">${formatted.reduce((a,b)=>a+b, 0)}</div>
                    </div>
                </div>
            `;
            resArea.style.display = 'block';
            this.addToHistory(`Scale Ratio`, formatted.join(' : '));
        },

        // --- Helpers ---
        parseInput: function(str) {
            return str.split(/[:,\s]+/)
                .filter(s => s.trim() !== '')
                .map(s => parseFloat(s))
                .filter(n => !isNaN(n));
        },

        findGCD: function(a, b) {
            return b === 0 ? a : this.findGCD(b, a % b);
        },

        findGCDArray: function(arr) {
            let result = arr[0];
            for (let i = 1; i < arr.length; i++) {
                result = this.findGCD(result, arr[i]);
            }
            return result;
        },

        showError: function(msg) {
            const el = document.getElementById('rc-error-msg');
            el.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${msg}`;
            el.style.display = 'block';
        },

        // --- History ---
        renderHistory: function() {
            const list = document.getElementById('rc-history-list');
            const data = JSON.parse(localStorage.getItem(historyKey)) || [];
            
            if (data.length === 0) {
                list.innerHTML = '<span style="color:#cbd5e1; font-style:italic;">No history yet</span>';
                return;
            }

            list.innerHTML = data.map(item => `
                <div class="rc-hist-item" onclick="navigator.clipboard.writeText('${item.res}')">
                    <strong>${item.type}</strong>: ${item.res}
                </div>
            `).join('');
        },

        addToHistory: function(type, res) {
            let data = JSON.parse(localStorage.getItem(historyKey)) || [];
            data.unshift({ type, res });
            if(data.length > 8) data.pop();
            localStorage.setItem(historyKey, JSON.stringify(data));
            this.renderHistory();
        },

        clearHistory: function() {
            localStorage.removeItem(historyKey);
            this.renderHistory();
        }
    };

    window.AppCalculators.category_6.ratio_calc = toolObj;
})();