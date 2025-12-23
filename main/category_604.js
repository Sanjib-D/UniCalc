// Logic for Factorial Calculator (Category 6, Tool 4)
// ID: factorial_calc

(function() {
    if (!window.AppCalculators.category_6) {
        window.AppCalculators.category_6 = {};
    }

    const toolId = "factorial_calc";
    const historyKey = "factorial_history";

    const toolObj = {
        state: {
            mode: 'standard', // 'standard', 'double', 'combinatorics'
            maxDisplayDigits: 20
        },

        getHtml: function() {
            return `
                <div class="fc-wrapper">
                    <div class="fc-tabs">
                        <button class="fc-tab active" onclick="window.AppCalculators.category_6.factorial_calc.switchTab('standard', this)">Factorial (n!)</button>
                        <button class="fc-tab" onclick="window.AppCalculators.category_6.factorial_calc.switchTab('double', this)">Double (n!!)</button>
                        <button class="fc-tab" onclick="window.AppCalculators.category_6.factorial_calc.switchTab('combinatorics', this)">nPr & nCr</button>
                    </div>

                    <div class="fc-input-card" id="fc-input-area">
                        <div id="fc-fields-standard">
                            <div class="fc-input-group">
                                <label class="fc-label">Enter Number (n)</label>
                                <input type="number" id="fc-n" class="fc-input" placeholder="e.g. 5" min="0" step="1">
                                <div id="fc-n-warn" class="fc-warning" style="display:none;">
                                    <i class="fas fa-exclamation-triangle"></i> Input must be a non-negative integer.
                                </div>
                            </div>
                        </div>

                        <div id="fc-fields-combinatorics" style="display:none;">
                            <div class="fc-field-row">
                                <div class="fc-input-group" style="flex:1">
                                    <label class="fc-label">Total Items (n)</label>
                                    <input type="number" id="fc-comb-n" class="fc-input" placeholder="n" min="0">
                                </div>
                                <div class="fc-input-group" style="flex:1">
                                    <label class="fc-label">Selection (r)</label>
                                    <input type="number" id="fc-comb-r" class="fc-input" placeholder="r" min="0">
                                </div>
                            </div>
                            <div class="fc-warning" id="fc-comb-warn" style="display:none; font-size:0.85rem;">
                                <i class="fas fa-info-circle"></i> n must be ≥ r
                            </div>
                        </div>

                        <div class="fc-actions">
                            <button class="fc-btn fc-btn-primary" id="action-btn">Calculate</button>
                            <button class="fc-btn fc-btn-secondary" id="reset-fc-btn">Reset</button>
                        </div>
                    </div>

                    <div id="fc-result-area"></div>

                    <div class="fc-history">
                        <div class="fc-res-header">
                            <span>Recent Calculations</span>
                            <button style="border:none; background:none; color:#ef4444; cursor:pointer;" onclick="window.AppCalculators.category_6.factorial_calc.clearHistory()">Clear</button>
                        </div>
                        <div id="fc-history-list" class="fc-hist-list">
                            <span style="color:#94a3b8; font-style:italic;">No history yet.</span>
                        </div>
                    </div>
                </div>
            `;
        },

        init: function() {
            // Event Listeners
            document.getElementById('reset-fc-btn').addEventListener('click', () => {
                this.resetFields();
            });

            // Input Validation Listeners
            ['fc-n', 'fc-comb-n', 'fc-comb-r'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', () => {
                        el.classList.remove('error');
                        document.getElementById('fc-n-warn').style.display = 'none';
                        document.getElementById('fc-comb-warn').style.display = 'none';
                    });
                    // Enter key support
                    el.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') document.getElementById('action-btn').click();
                    });
                }
            });

            this.renderHistory();
        },

        switchTab: function(mode, tabEl) {
            this.state.mode = mode;
            
            // Update UI Tabs
            document.querySelectorAll('.fc-tab').forEach(t => t.classList.remove('active'));
            tabEl.classList.add('active');

            // Update Fields
            const stdFields = document.getElementById('fc-fields-standard');
            const combFields = document.getElementById('fc-fields-combinatorics');
            
            if (mode === 'combinatorics') {
                stdFields.style.display = 'none';
                combFields.style.display = 'block';
            } else {
                stdFields.style.display = 'block';
                combFields.style.display = 'none';
                
                // Update Label for Double Factorial
                const label = stdFields.querySelector('.fc-label');
                label.innerText = mode === 'double' ? 'Enter Number (n) for n!!' : 'Enter Number (n) for n!';
            }

            // Clear Result
            document.getElementById('fc-result-area').innerHTML = '';
        },

        resetFields: function() {
            document.getElementById('fc-n').value = '';
            document.getElementById('fc-comb-n').value = '';
            document.getElementById('fc-comb-r').value = '';
            document.getElementById('fc-result-area').innerHTML = '';
            document.querySelectorAll('.fc-input').forEach(el => el.classList.remove('error'));
        },

        validateInput: function(valStr) {
            if (valStr.trim() === '') return { valid: false, msg: 'Empty' };
            const num = Number(valStr);
            if (isNaN(num)) return { valid: false, msg: 'NaN' };
            if (!Number.isInteger(num)) return { valid: false, msg: 'Decimal' };
            if (num < 0) return { valid: false, msg: 'Negative' };
            return { valid: true, val: num };
        },

        calculate: function() {
            const mode = this.state.mode;
            let resultHtml = '';
            
            if (mode === 'combinatorics') {
                resultHtml = this.calcCombinatorics();
            } else {
                resultHtml = this.calcFactorial(mode);
            }

            return resultHtml;
        },

        calcFactorial: function(mode) {
            const nInput = document.getElementById('fc-n');
            const validation = this.validateInput(nInput.value);

            if (!validation.valid) {
                nInput.classList.add('error');
                document.getElementById('fc-n-warn').style.display = 'block';
                return null;
            }

            const n = validation.val;
            const isDouble = mode === 'double';
            const symbol = isDouble ? '!!' : '!';
            
            // Calculation
            let resultBig = BigInt(1);
            let steps = [];
            const maxStepsShown = 15;
            
            if (isDouble) {
                // Double Factorial Logic: n * (n-2) * ...
                if (n === 0 || n === 1) {
                    resultBig = BigInt(1);
                } else {
                    for (let i = n; i >= 1; i -= 2) {
                        resultBig *= BigInt(i);
                        if (steps.length < maxStepsShown) steps.push(i);
                    }
                }
            } else {
                // Standard Factorial Logic: n * (n-1) * ...
                if (n === 0 || n === 1) {
                    resultBig = BigInt(1);
                } else {
                    // Optimization: For n > 10000, maybe just Stirling? 
                    // JS BigInt is quite fast, but let's cap expansion steps.
                    for (let i = 1; i <= n; i++) {
                        resultBig *= BigInt(i);
                    }
                    // Reverse steps for display
                    for (let i = n; i >= 1 && steps.length < maxStepsShown; i--) {
                        steps.push(i);
                    }
                }
            }

            // Formatting
            const resStr = resultBig.toString();
            const isLarge = resStr.length > 20;
            const displayVal = isLarge ? this.toScientific(resStr) : this.formatNumber(resStr);
            
            // Steps Text
            let stepsHtml = '';
            if (n < 2) {
                stepsHtml = `${n}${symbol} = 1 (By Definition)`;
            } else {
                const stepStr = steps.join(' × ') + (n > maxStepsShown ? ' × ... × 1' : isDouble && n%2===0 ? ' × 2' : ' × 1');
                stepsHtml = `${n}${symbol} = ${stepStr}`;
            }

            // Stirling Approximation for Standard Factorial (if n > 10)
            let stirlingHtml = '';
            if (!isDouble && n > 10) {
                const sVal = this.stirlingApprox(n);
                stirlingHtml = `
                    <div class="fc-detail-box" style="background:#fff7ed; border-color:#ffedd5;">
                        <strong><i class="fas fa-wave-square"></i> Stirling's Approximation:</strong><br>
                        ${sVal}
                        <br><small style="color:#f59e0b">Useful estimation for very large numbers.</small>
                    </div>
                `;
            }

            this.addToHistory(`${n}${symbol}`, displayVal);

            return `
                <div class="fc-result-container">
                    <div class="fc-result-card">
                        <div class="fc-res-header">
                            <span>Result (${n}${symbol})</span>
                            <span>${resStr.length} Digits</span>
                        </div>
                        <div class="fc-main-val">${displayVal}</div>
                        ${isLarge ? `<div class="fc-notation-note">Displayed in scientific notation</div>` : ''}
                        
                        <div class="fc-copy-row">
                            <button class="fc-copy-btn" onclick="navigator.clipboard.writeText('${resStr}')">
                                <i class="far fa-copy"></i> Copy Full Result
                            </button>
                        </div>
                    </div>

                    <div class="fc-steps-toggle" onclick="this.nextElementSibling.classList.toggle('show')">
                        Show Calculation Steps
                    </div>
                    <div class="fc-steps-panel">
                        ${stepsHtml}
                    </div>
                    
                    ${stirlingHtml}
                </div>
            `;
        },

        calcCombinatorics: function() {
            const nInput = document.getElementById('fc-comb-n');
            const rInput = document.getElementById('fc-comb-r');
            
            const vN = this.validateInput(nInput.value);
            const vR = this.validateInput(rInput.value);
            const warn = document.getElementById('fc-comb-warn');

            if (!vN.valid || !vR.valid) {
                if(!vN.valid) nInput.classList.add('error');
                if(!vR.valid) rInput.classList.add('error');
                return null;
            }

            const n = vN.val;
            const r = vR.val;

            if (n < r) {
                warn.style.display = 'block';
                return null;
            } else {
                warn.style.display = 'none';
            }

            // Logic: nPr = n! / (n-r)!
            // Logic: nCr = n! / (r! * (n-r)!)
            
            // Compute iteratively to avoid huge factorials if possible
            const nPr = this.permutations(n, r);
            const nCr = this.combinations(n, r);

            const nPrStr = nPr.toString();
            const nCrStr = nCr.toString();

            const dispP = nPrStr.length > 12 ? this.toScientific(nPrStr) : this.formatNumber(nPrStr);
            const dispC = nCrStr.length > 12 ? this.toScientific(nCrStr) : this.formatNumber(nCrStr);

            this.addToHistory(`P(${n},${r})`, dispP);

            return `
                <div class="fc-result-container">
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                        <div class="fc-result-card" style="margin-bottom:0; border-left-color: #06b6d4;">
                            <div class="fc-res-header">Permutation (nPr)</div>
                            <div class="fc-main-val" style="font-size:1.6rem">${dispP}</div>
                            <small>Order matters</small>
                            <div class="fc-copy-row">
                                <button class="fc-copy-btn" onclick="navigator.clipboard.writeText('${nPrStr}')">Copy</button>
                            </div>
                        </div>

                        <div class="fc-result-card" style="margin-bottom:0; border-left-color: #8b5cf6;">
                            <div class="fc-res-header">Combination (nCr)</div>
                            <div class="fc-main-val" style="font-size:1.6rem">${dispC}</div>
                            <small>Order doesn't matter</small>
                            <div class="fc-copy-row">
                                <button class="fc-copy-btn" onclick="navigator.clipboard.writeText('${nCrStr}')">Copy</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="fc-detail-box">
                        <strong>Formulas:</strong><br>
                        nPr = ${n}! / (${n}-${r})!<br>
                        nCr = ${n}! / [${r}! × (${n}-${r})!]
                    </div>
                </div>
            `;
        },

        // Helper: Permutation Logic P(n, r)
        permutations: function(n, r) {
            if (r < 0 || r > n) return BigInt(0);
            let res = BigInt(1);
            for (let i = 0; i < r; i++) {
                res *= BigInt(n - i);
            }
            return res;
        },

        // Helper: Combination Logic C(n, r)
        combinations: function(n, r) {
            if (r < 0 || r > n) return BigInt(0);
            if (r === 0 || r === n) return BigInt(1);
            if (r > n / 2) r = n - r; // Symmetry
            
            let res = BigInt(1);
            for (let i = 1; i <= r; i++) {
                res = res * BigInt(n - i + 1) / BigInt(i);
            }
            return res;
        },

        // Helper: Stirling's Approximation
        stirlingApprox: function(n) {
            // sqrt(2*pi*n) * (n/e)^n
            // Logarithmic calculation for overflow protection in double precision
            // ln(res) = 0.5*ln(2*pi) + 0.5*ln(n) + n*ln(n) - n
            const lnRes = 0.5 * Math.log(2 * Math.PI) + (n + 0.5) * Math.log(n) - n;
            const log10Res = lnRes / Math.LN10;
            
            const exponent = Math.floor(log10Res);
            const mantissa = Math.pow(10, log10Res - exponent);
            
            return `${mantissa.toFixed(5)} × 10<sup>${exponent}</sup>`;
        },

        // Formats normal string with commas
        formatNumber: function(str) {
            return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        // Converts long string to scientific notation
        toScientific: function(str) {
            if (str.length <= 15) return str;
            const mantissa = str.slice(0, 1) + '.' + str.slice(1, 6);
            const exponent = str.length - 1;
            return `${mantissa} × 10<sup>${exponent}</sup>`;
        },

        // History Management
        renderHistory: function() {
            const list = document.getElementById('fc-history-list');
            const data = JSON.parse(localStorage.getItem(historyKey)) || [];
            
            if (data.length === 0) {
                list.innerHTML = '<span style="color:#94a3b8; font-style:italic;">No history yet.</span>';
                return;
            }

            list.innerHTML = data.map(item => `
                <div class="fc-hist-item" onclick="navigator.clipboard.writeText('${item.result.replace(/,/g,'').replace(/× 10/,'e')}')">
                    <strong>${item.query}</strong> = ${item.display}
                </div>
            `).join('');
        },

        addToHistory: function(query, display) {
            let data = JSON.parse(localStorage.getItem(historyKey)) || [];
            // Remove duplicates of same query
            data = data.filter(d => d.query !== query);
            data.unshift({ query, display, result: display }); // Simplified result storage
            if (data.length > 8) data.pop();
            localStorage.setItem(historyKey, JSON.stringify(data));
            this.renderHistory();
        },

        clearHistory: function() {
            localStorage.removeItem(historyKey);
            this.renderHistory();
        }
    };

    window.AppCalculators.category_6.factorial_calc = toolObj;
})();