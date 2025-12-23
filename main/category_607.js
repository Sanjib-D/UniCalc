// Logic for Fraction Calculator (Category 6, Tool 7)
// ID: fraction_calc

(function() {
    if (!window.AppCalculators.category_6) {
        window.AppCalculators.category_6 = {};
    }

    const toolId = "fraction_calc";
    const historyKey = "fraction_calc_history";

    const toolObj = {
        getHtml: function() {
            return `
                <div class="fr-wrapper">
                    <div class="fr-calculator-card">
                        
                        <div class="fr-calc-row">
                            <div>
                                <div class="fr-input-label">Fraction 1</div>
                                <div class="fr-input-group">
                                    <input type="number" id="fr-a-whole" class="fr-whole-input" placeholder="0">
                                    <div class="fr-fraction-part">
                                        <input type="number" id="fr-a-num" class="fr-part-input" placeholder="Num">
                                        <div class="fr-divider"></div>
                                        <input type="number" id="fr-a-den" class="fr-part-input" placeholder="Den">
                                    </div>
                                </div>
                            </div>

                            <select id="fr-op" class="fr-operator-select">
                                <option value="+">+</option>
                                <option value="-">-</option>
                                <option value="*">×</option>
                                <option value="/">÷</option>
                            </select>

                            <div>
                                <div class="fr-input-label">Fraction 2</div>
                                <div class="fr-input-group">
                                    <input type="number" id="fr-b-whole" class="fr-whole-input" placeholder="0">
                                    <div class="fr-fraction-part">
                                        <input type="number" id="fr-b-num" class="fr-part-input" placeholder="Num">
                                        <div class="fr-divider"></div>
                                        <input type="number" id="fr-b-den" class="fr-part-input" placeholder="Den">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="fr-error-msg" class="fr-error">
                            <i class="fas fa-exclamation-circle"></i> <span>Invalid Input</span>
                        </div>

                        <div class="fr-actions">
                            <button class="fr-btn fr-btn-primary" id="action-btn">Calculate</button>
                            <button class="fr-btn fr-btn-secondary" id="reset-fr-btn">Reset</button>
                            <button class="fr-btn fr-btn-secondary" id="clear-fr-btn">Clear Inputs</button>
                        </div>
                    </div>

                    <div id="fr-result-area" class="fr-result-container" style="display:none;"></div>

                    <div class="fr-history">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <h4 style="margin:0; color:#64748b;">History</h4>
                            <button onclick="window.AppCalculators.category_6.fraction_calc.clearHistory()" style="background:none; border:none; color:#ef4444; cursor:pointer;">Clear</button>
                        </div>
                        <div id="fr-history-list" class="fr-hist-list">
                            <span style="color:#cbd5e1; text-align:center;">No history yet</span>
                        </div>
                    </div>
                </div>
            `;
        },

        init: function() {
            // Event Listeners
            document.getElementById('reset-fr-btn').addEventListener('click', () => {
                this.clearInputs();
                document.getElementById('fr-result-area').style.display = 'none';
                document.getElementById('fr-error-msg').style.display = 'none';
            });
            
            document.getElementById('clear-fr-btn').addEventListener('click', () => {
                this.clearInputs();
            });

            this.renderHistory();
        },

        clearInputs: function() {
            ['fr-a-whole', 'fr-a-num', 'fr-a-den', 'fr-b-whole', 'fr-b-num', 'fr-b-den'].forEach(id => {
                document.getElementById(id).value = '';
            });
            document.getElementById('fr-op').value = '+';
        },

        calculate: function() {
            const errorEl = document.getElementById('fr-error-msg');
            errorEl.style.display = 'none';

            // Get Inputs
            const f1 = this.getFractionInput('fr-a');
            const f2 = this.getFractionInput('fr-b');
            const op = document.getElementById('fr-op').value;

            // Validate
            if (!f1.valid || !f2.valid) {
                errorEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please check your inputs. Denominators cannot be zero.';
                errorEl.style.display = 'block';
                return;
            }

            if (f1.isZero && f2.isZero) {
                 errorEl.innerHTML = '<i class="fas fa-info-circle"></i> Please enter at least one value.';
                 errorEl.style.display = 'block';
                 return;
            }

            // Perform Calculation
            const result = this.computeFraction(f1, f2, op);
            
            if (!result.valid) {
                errorEl.innerHTML = '<i class="fas fa-ban"></i> ' + result.msg;
                errorEl.style.display = 'block';
                return;
            }

            // Render
            this.renderResult(f1, f2, op, result);
            this.addToHistory(f1, f2, op, result);
        },

        getFractionInput: function(prefix) {
            let w = parseInt(document.getElementById(`${prefix}-whole`).value) || 0;
            let n = parseInt(document.getElementById(`${prefix}-num`).value) || 0;
            let d = document.getElementById(`${prefix}-den`).value;

            // Default denominator to 1 if empty, but if user typed 0 it's invalid
            if (d === '') d = 1;
            else d = parseInt(d);

            if (d === 0) return { valid: false };

            // Normalize Sign
            // If whole is negative, the fraction part is subtracted: -1 1/2 = -1.5 = -3/2
            // We convert everything to improper fraction: top / bottom
            let top;
            if (w < 0) {
                top = (w * d) - n; // e.g. -1 * 2 - 1 = -3
            } else if (w > 0) {
                top = (w * d) + n;
            } else {
                // If whole is 0, sign is on numerator
                top = n;
            }

            return {
                valid: true,
                isZero: (w === 0 && n === 0),
                w: w,
                n: n,
                d: d,
                improper: { n: top, d: d }
            };
        },

        computeFraction: function(f1, f2, op) {
            let n1 = f1.improper.n;
            let d1 = f1.improper.d;
            let n2 = f2.improper.n;
            let d2 = f2.improper.d;

            let resN, resD;
            let steps = [];

            if (op === '+' || op === '-') {
                // Find LCD
                const lcd = this.lcm(d1, d2);
                const m1 = lcd / d1;
                const m2 = lcd / d2;
                
                steps.push(`1. Convert to improper fractions: ${n1}/${d1} and ${n2}/${d2}`);
                steps.push(`2. Find Least Common Denominator (LCD) of ${d1} and ${d2}: <strong>${lcd}</strong>`);
                
                const adjN1 = n1 * m1;
                const adjN2 = n2 * m2;
                
                steps.push(`3. Adjust fractions: ${n1}/${d1} = ${adjN1}/${lcd} and ${n2}/${d2} = ${adjN2}/${lcd}`);

                if (op === '+') resN = adjN1 + adjN2;
                else resN = adjN1 - adjN2;

                resD = lcd;
                
                steps.push(`4. Perform operation: (${adjN1} ${op} ${adjN2}) / ${lcd} = <strong>${resN}/${resD}</strong>`);

            } else if (op === '*') {
                resN = n1 * n2;
                resD = d1 * d2;
                steps.push(`1. Multiply numerators: ${n1} × ${n2} = ${resN}`);
                steps.push(`2. Multiply denominators: ${d1} × ${d2} = ${resD}`);
                steps.push(`Result: ${resN}/${resD}`);

            } else if (op === '/') {
                if (n2 === 0) return { valid: false, msg: "Cannot divide by zero." };
                // Flip second fraction
                resN = n1 * d2;
                resD = d1 * n2;
                steps.push(`1. Flip second fraction (reciprocal): ${n2}/${d2} becomes ${d2}/${n2}`);
                steps.push(`2. Multiply: ${n1}/${d1} × ${d2}/${n2}`);
                steps.push(`Result: ${resN}/${resD}`);
            }

            // Normalize sign (denominator always positive)
            if (resD < 0) {
                resN = -resN;
                resD = -resD;
            }

            // Simplify
            const common = this.gcd(Math.abs(resN), resD);
            const simpN = resN / common;
            const simpD = resD / common;

            if (common > 1) {
                steps.push(`Simplify: Divide top and bottom by GCD(${Math.abs(resN)}, ${resD}) = ${common}`);
                steps.push(`Final Simplified Fraction: <strong>${simpN}/${simpD}</strong>`);
            }

            return {
                valid: true,
                n: simpN,
                d: simpD,
                decimal: simpN / simpD,
                steps: steps
            };
        },

        renderResult: function(f1, f2, op, res) {
            const area = document.getElementById('fr-result-area');
            
            // Mixed Number Calculation
            const isNegative = res.n < 0;
            const absN = Math.abs(res.n);
            const whole = Math.floor(absN / res.d);
            const rem = absN % res.d;
            
            let mixedHtml = '';
            if (whole > 0 && rem > 0) {
                mixedHtml = `${isNegative ? '-' : ''}${whole} <sup style="font-size:0.6em">${rem}</sup>&frasl;<sub style="font-size:0.6em">${res.d}</sub>`;
            } else if (whole > 0 && rem === 0) {
                mixedHtml = `${isNegative ? '-' : ''}${whole}`;
            } else if (whole === 0 && rem > 0) {
                mixedHtml = `${isNegative ? '-' : ''}${rem}/${res.d}`;
            } else {
                mixedHtml = "0";
            }

            // Main Display Logic
            // If Result is integer, just show integer
            let mainDisplay = '';
            if (rem === 0) {
                mainDisplay = `<div class="fr-res-whole">${isNegative && whole!==0 ? '-' : ''}${whole}</div>`;
            } else {
                // Proper display
                if (whole !== 0) {
                    mainDisplay = `
                        <div class="fr-res-whole">${isNegative ? '-' : ''}${whole}</div>
                        <div class="fr-res-fract">
                            <div class="fr-res-num">${rem}</div>
                            <div class="fr-res-line"></div>
                            <div class="fr-res-den">${res.d}</div>
                        </div>
                    `;
                } else {
                     mainDisplay = `
                         <div style="font-size:1.5rem; margin-right:5px;">${isNegative ? '-' : ''}</div>
                        <div class="fr-res-fract">
                            <div class="fr-res-num">${rem}</div>
                            <div class="fr-res-line"></div>
                            <div class="fr-res-den">${res.d}</div>
                        </div>
                    `;
                }
            }

            // Input Representation string
            const formatInput = (f) => {
                // e.g. 1 1/2 or 3/4
                if (f.w !== 0 && f.n !== 0) return `${f.w} ${f.n}/${f.d}`;
                if (f.w !== 0) return `${f.w}`;
                return `${f.n}/${f.d}`;
            };
            
            const eqStr = `${formatInput(f1)} ${op} ${formatInput(f2)}`;

            // Visuals (Simple Pie Charts if whole number < 10)
            let visualHtml = '';
            const totalVal = Math.abs(res.decimal);
            if (totalVal <= 10 && totalVal > 0) {
                visualHtml = this.generateVisuals(totalVal);
            }

            area.style.display = 'block';
            area.innerHTML = `
                <div class="fr-result-header">
                   <h3 style="margin:0; color:#64748b; font-weight:400;">${eqStr}</h3>
                </div>

                <div style="display:flex; justify-content:center; align-items:center; margin-bottom:25px;">
                   <div class="fr-main-result">
                        <span style="font-size:1.2rem; font-weight:bold; margin-right:15px;">=</span>
                        ${mainDisplay}
                   </div>
                </div>

                <div class="fr-conversions">
                    <div class="fr-conv-box">
                        <div class="fr-conv-label">Decimal</div>
                        <div class="fr-conv-val">${res.decimal % 1 !== 0 ? res.decimal.toFixed(4) : res.decimal}</div>
                        <button class="fr-btn fr-btn-secondary" style="padding:4px 10px; font-size:0.8rem; margin-top:5px;" onclick="navigator.clipboard.writeText('${res.decimal}')">Copy</button>
                    </div>
                    <div class="fr-conv-box">
                        <div class="fr-conv-label">Improper Fraction</div>
                        <div class="fr-conv-val">${res.n}/${res.d}</div>
                    </div>
                    <div class="fr-conv-box">
                        <div class="fr-conv-label">Percentage</div>
                        <div class="fr-conv-val">${(res.decimal * 100).toFixed(2)}%</div>
                    </div>
                </div>

                ${visualHtml ? `
                    <div class="fr-visual-container">
                        <div style="width:100%; text-align:center; color:#94a3b8; font-size:0.8rem; margin-bottom:10px;">VISUAL REPRESENTATION (Approx)</div>
                        ${visualHtml}
                    </div>
                ` : ''}

                <div class="fr-steps-wrapper">
                    <div class="fr-steps-header" onclick="this.nextElementSibling.classList.toggle('show')">
                        <span><i class="fas fa-list-ol"></i> Show Step-by-Step Solution</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="fr-steps-content">
                        ${res.steps.map(s => `<div class="fr-step-row">${s}</div>`).join('')}
                    </div>
                </div>
            `;
        },

        generateVisuals: function(val) {
            let html = '';
            const whole = Math.floor(val);
            const part = val - whole;

            // Full Circles
            for(let i=0; i<whole; i++) {
                html += `<div class="fr-pie"><div class="fr-pie-fill"></div></div>`;
            }

            // Partial Circle
            if (part > 0.01) { // tolerance
                const deg = part * 360;
                // CSS conic-gradient is perfect here
                html += `
                    <div class="fr-pie" style="background: conic-gradient(#4361ee ${deg}deg, #e2e8f0 0deg); border:none;"></div>
                `;
            }
            return html;
        },

        // --- Math Helpers ---
        gcd: function(a, b) {
            return b === 0 ? a : this.gcd(b, a % b);
        },

        lcm: function(a, b) {
            return (a * b) / this.gcd(a, b);
        },

        // --- History ---
        renderHistory: function() {
            const list = document.getElementById('fr-history-list');
            const data = JSON.parse(localStorage.getItem(historyKey)) || [];
            
            if (data.length === 0) {
                list.innerHTML = '<span style="color:#cbd5e1; text-align:center;">No history yet</span>';
                return;
            }

            list.innerHTML = data.map((item) => `
                <div class="fr-hist-item" onclick="window.AppCalculators.category_6.fraction_calc.loadHistory('${item.raw}')">
                    ${item.display}
                </div>
            `).join('');
        },

        addToHistory: function(f1, f2, op, res) {
            let data = JSON.parse(localStorage.getItem(historyKey)) || [];
            
            const fmt = (f) => {
                if(f.w !== 0) return `${f.w} ${f.n}/${f.d}`;
                return `${f.n}/${f.d}`;
            }

            const displayStr = `${fmt(f1)} ${op} ${fmt(f2)} = ${res.n}/${res.d}`;
            
            // Raw string to reload (json encoded)
            const rawObj = encodeURIComponent(JSON.stringify({
                a: { w: f1.w, n: f1.n, d: f1.d },
                b: { w: f2.w, n: f2.n, d: f2.d },
                op: op
            }));

            // Avoid dupes
            if (data.length > 0 && data[0].display === displayStr) return;

            data.unshift({ display: displayStr, raw: rawObj });
            if (data.length > 10) data.pop();
            
            localStorage.setItem(historyKey, JSON.stringify(data));
            this.renderHistory();
        },

        loadHistory: function(raw) {
            try {
                const item = JSON.parse(decodeURIComponent(raw));
                
                document.getElementById('fr-a-whole').value = item.a.w === 0 ? '' : item.a.w;
                document.getElementById('fr-a-num').value = item.a.n;
                document.getElementById('fr-a-den').value = item.a.d;
                
                document.getElementById('fr-b-whole').value = item.b.w === 0 ? '' : item.b.w;
                document.getElementById('fr-b-num').value = item.b.n;
                document.getElementById('fr-b-den').value = item.b.d;

                document.getElementById('fr-op').value = item.op;
                
                document.getElementById('action-btn').click();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch(e) { console.error(e); }
        },

        clearHistory: function() {
            localStorage.removeItem(historyKey);
            this.renderHistory();
        }
    };

    window.AppCalculators.category_6.fraction_calc = toolObj;
})();