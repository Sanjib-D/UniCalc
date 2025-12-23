// Logic for GCD & LCM Finder (Category 6, Tool 6)
// ID: gcd_lcm_calc

(function() {
    if (!window.AppCalculators.category_6) {
        window.AppCalculators.category_6 = {};
    }

    const toolId = "gcd_lcm_calc";
    const historyKey = "gcd_lcm_history";

    const toolObj = {
        getHtml: function() {
            return `
                <div class="gl-wrapper">
                    <div class="gl-input-card">
                        <label class="gl-label">Enter Numbers</label>
                        <textarea id="gl-input" class="gl-textarea" placeholder="e.g. 24, 36, 48"></textarea>
                        
                        <div class="gl-hint">
                            <i class="fas fa-info-circle"></i> 
                            Separate numbers with commas, spaces, or new lines.
                        </div>

                        <div class="gl-actions">
                            <button class="gl-btn gl-btn-primary" id="action-btn">Calculate</button>
                            <button class="gl-btn gl-btn-secondary" id="reset-gl-btn">Reset</button>
                            <button class="gl-btn gl-btn-secondary" id="clear-gl-btn">Clear</button>
                        </div>
                    </div>

                    <div id="gl-result-area" class="gl-results-container" style="display:none;"></div>

                    <div class="gl-history">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <h4 style="margin:0; color:#64748b;">Recent Calculations</h4>
                            <button onclick="window.AppCalculators.category_6.gcd_lcm_calc.clearHistory()" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.85rem;">Clear History</button>
                        </div>
                        <div id="gl-history-list" class="gl-hist-list">
                            <span style="color:#cbd5e1; font-style:italic; padding:10px; text-align:center;">No history yet</span>
                        </div>
                    </div>
                </div>
            `;
        },

        init: function() {
            // Event Listeners
            const inputEl = document.getElementById('gl-input');
            
            // Allow submission on Enter (if not holding Shift)
            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    document.getElementById('action-btn').click();
                }
            });

            // Input Validation (Real-time char blocking)
            inputEl.addEventListener('input', (e) => {
                // Allow digits, spaces, commas, newlines, and minus sign
                const validChars = /^[0-9\s,\-\n]*$/;
                if (!validChars.test(inputEl.value)) {
                    // Strip invalid chars
                    inputEl.value = inputEl.value.replace(/[^0-9\s,\-\n]/g, '');
                }
            });

            document.getElementById('reset-gl-btn').addEventListener('click', () => {
                inputEl.value = '';
                document.getElementById('gl-result-area').style.display = 'none';
                inputEl.focus();
            });

            document.getElementById('clear-gl-btn').addEventListener('click', () => {
                inputEl.value = '';
                inputEl.focus();
            });

            this.renderHistory();
        },

        calculate: function() {
            const rawInput = document.getElementById('gl-input').value;
            const nums = this.parseInput(rawInput);
            const resArea = document.getElementById('gl-result-area');

            if (nums.length < 2) {
                if (nums.length === 1) {
                    // Trivial case
                    this.renderOutput(nums[0], nums[0], nums, "Single number entered. GCD and LCM are the number itself.");
                    resArea.style.display = 'block';
                    return;
                }
                alert("Please enter at least two valid numbers.");
                return;
            }

            // Calculation
            const gcdVal = this.calculateGCDArray(nums);
            const lcmVal = this.calculateLCMArray(nums);
            
            // Render
            this.renderOutput(gcdVal, lcmVal, nums);
            resArea.style.display = 'block';

            // History
            this.addToHistory(nums, gcdVal, lcmVal);
        },

        parseInput: function(str) {
            // Split by comma, space, newline
            return str.split(/[\s,]+/)
                .filter(s => s.trim() !== '' && s !== '-') // Remove empty and lone minus
                .map(s => {
                    try {
                        // Use BigInt for precision, but work with absolute values
                        // Negative GCD/LCM usually defined as positive in elementary contexts
                        let n = BigInt(s);
                        return n < 0n ? -n : n;
                    } catch(e) { return null; }
                })
                .filter(n => n !== null);
        },

        // --- Core Math (BigInt) ---

        gcd: function(a, b) {
            // Euclidean Algorithm
            while (b > 0n) {
                let temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        },

        lcm: function(a, b) {
            if (a === 0n || b === 0n) return 0n;
            return (a * b) / this.gcd(a, b);
        },

        calculateGCDArray: function(arr) {
            let result = arr[0];
            for (let i = 1; i < arr.length; i++) {
                result = this.gcd(result, arr[i]);
            }
            return result;
        },

        calculateLCMArray: function(arr) {
            let result = arr[0];
            for (let i = 1; i < arr.length; i++) {
                result = this.lcm(result, arr[i]);
            }
            return result;
        },

        // --- UI Rendering ---

        renderOutput: function(gcdVal, lcmVal, nums, note = null) {
            const area = document.getElementById('gl-result-area');
            
            // Check for co-prime (GCD is 1)
            const isCoprime = gcdVal === 1n;
            
            // Format numbers for display
            const gcdStr = gcdVal.toString();
            const lcmStr = lcmVal.toString();

            // Simplified Ratio (if exactly 2 numbers)
            let ratioHtml = '';
            if (nums.length === 2 && nums[1] !== 0n) {
                const simp1 = nums[0] / gcdVal;
                const simp2 = nums[1] / gcdVal;
                ratioHtml = `
                    <div class="gl-tag" title="Simplified Ratio">
                        <i class="fas fa-balance-scale"></i> Ratio ${simp1}:${simp2}
                    </div>
                `;
            }

            // Steps generation
            const stepsHtml = this.generateSteps(nums, gcdVal, lcmVal);

            area.innerHTML = `
                <div class="gl-result-grid">
                    <div class="gl-card gl-card-gcd">
                        <div class="gl-card-title">Greatest Common Divisor (GCD)</div>
                        <div class="gl-card-value">${gcdStr.length > 15 ? this.formatBig(gcdStr) : gcdStr}</div>
                        <button class="gl-copy-btn" onclick="navigator.clipboard.writeText('${gcdStr}')">Copy GCD</button>
                    </div>
                    <div class="gl-card gl-card-lcm">
                        <div class="gl-card-title">Least Common Multiple (LCM)</div>
                        <div class="gl-card-value">${lcmStr.length > 15 ? this.formatBig(lcmStr) : lcmStr}</div>
                        <button class="gl-copy-btn" onclick="navigator.clipboard.writeText('${lcmStr}')">Copy LCM</button>
                    </div>
                </div>

                <div class="gl-properties">
                    ${isCoprime ? '<div class="gl-tag"><i class="fas fa-link"></i> Numbers are Co-prime</div>' : ''}
                    <div class="gl-tag"><i class="fas fa-list-ol"></i> Count: ${nums.length} numbers</div>
                    ${ratioHtml}
                </div>

                ${note ? `<div style="text-align:center; color:#64748b; margin-bottom:20px;">${note}</div>` : ''}

                <div class="gl-steps-wrapper">
                    <div class="gl-steps-header" onclick="this.nextElementSibling.classList.toggle('show');">
                        <span><i class="fas fa-graduation-cap"></i> Show Calculation Steps</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="gl-steps-content">
                        ${stepsHtml}
                    </div>
                </div>
            `;
        },

        generateSteps: function(nums, gcdFinal, lcmFinal) {
            // Limit educational output for massive lists
            if (nums.length > 5) {
                return `<div class="gl-step-block">There are too many numbers to display detailed step-by-step factorization. <br>The method involves finding the GCD of the first two numbers, then the result with the next, and so on.</div>`;
            }

            // 1. Prime Factorization Method Display
            let factorsHtml = '';
            nums.forEach(n => {
                const factors = this.getPrimeFactors(n);
                const fStr = factors.length > 0 ? factors.join(' × ') : (n === 1n ? '1' : '0');
                factorsHtml += `<div><strong>${n}</strong> = ${fStr}</div>`;
            });

            // 2. Euclidean Steps for the first pair (if exists)
            let euclideanHtml = '';
            if (nums.length >= 2) {
                euclideanHtml = `<br><span class="gl-step-title">Euclidean Algorithm (First Pair: ${nums[0]} & ${nums[1]})</span>`;
                let a = nums[0] > nums[1] ? nums[0] : nums[1];
                let b = nums[0] > nums[1] ? nums[1] : nums[0];
                
                if (b === 0n) {
                     euclideanHtml += `<div>GCD(${a}, 0) = ${a}</div>`;
                } else {
                    let steps = [];
                    let safety = 0;
                    while (b > 0n && safety < 10) {
                        let r = a % b;
                        let q = a / b;
                        steps.push(`${a} = ${b} × ${q} + ${r}`);
                        a = b;
                        b = r;
                        safety++;
                    }
                    if (safety >= 10) steps.push('...');
                    euclideanHtml += steps.join('<br>');
                    euclideanHtml += `<br><strong>GCD is ${a}</strong>`;
                }
            }

            return `
                <div class="gl-step-block">
                    <span class="gl-step-title">Prime Factorization Method</span>
                    ${factorsHtml}
                </div>
                <div class="gl-step-block">
                    ${euclideanHtml}
                </div>
                <div class="gl-step-block">
                    <span class="gl-step-title">LCM Formula</span>
                    For two numbers a and b: <br>
                    LCM(a, b) = (a × b) / GCD(a, b)
                </div>
            `;
        },

        getPrimeFactors: function(n) {
            if (n === 0n) return [];
            if (n === 1n) return [];
            
            // Limit size for factorization to avoid browser hang on huge inputs
            if (n > 1000000000000n) return ["(Large number - factorization omitted)"];

            let factors = [];
            let d = 2n;
            let temp = n;
            
            while (d * d <= temp) {
                while (temp % d === 0n) {
                    factors.push(d.toString());
                    temp /= d;
                }
                d += (d === 2n) ? 1n : 2n;
            }
            if (temp > 1n) factors.push(temp.toString());
            return factors;
        },

        formatBig: function(str) {
            return str.slice(0, 10) + '...' + str.slice(-4) + ` (e+${str.length-1})`;
        },

        // --- History ---

        renderHistory: function() {
            const list = document.getElementById('gl-history-list');
            const data = JSON.parse(localStorage.getItem(historyKey)) || [];
            
            if (data.length === 0) {
                list.innerHTML = '<span style="color:#cbd5e1; font-style:italic; padding:10px; text-align:center;">No history yet</span>';
                return;
            }

            list.innerHTML = data.map((item, idx) => `
                <div class="gl-hist-item" onclick="window.AppCalculators.category_6.gcd_lcm_calc.loadHistory(${idx})">
                    <div class="gl-hist-nums" title="${item.nums}">${item.nums}</div>
                    <div class="gl-hist-res">GCD: ${this.truncate(item.gcd, 6)} | LCM: ${this.truncate(item.lcm, 6)}</div>
                </div>
            `).join('');
        },

        addToHistory: function(numsArr, gcd, lcm) {
            let data = JSON.parse(localStorage.getItem(historyKey)) || [];
            const numStr = numsArr.join(', ');
            
            // Prevent duplicate at top
            if (data.length > 0 && data[0].nums === numStr) return;

            data.unshift({ 
                nums: numStr, 
                gcd: gcd.toString(), 
                lcm: lcm.toString() 
            });
            
            if (data.length > 8) data.pop();
            localStorage.setItem(historyKey, JSON.stringify(data));
            this.renderHistory();
        },

        loadHistory: function(idx) {
            const data = JSON.parse(localStorage.getItem(historyKey));
            if (data && data[idx]) {
                document.getElementById('gl-input').value = data[idx].nums;
                document.getElementById('action-btn').click();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        clearHistory: function() {
            localStorage.removeItem(historyKey);
            this.renderHistory();
        },

        truncate: function(str, len) {
            return str.length > len ? str.substring(0, len) + '..' : str;
        }
    };

    window.AppCalculators.category_6.gcd_lcm_calc = toolObj;
})();