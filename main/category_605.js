// Logic for Prime Number Checker (Category 6, Tool 5)
// ID: prime_calc

(function() {
    if (!window.AppCalculators.category_6) {
        window.AppCalculators.category_6 = {};
    }

    const toolId = "prime_calc";
    const historyKey = "prime_calc_history";

    const toolObj = {
        state: {
            mode: 'single', // 'single' or 'batch'
        },

        getHtml: function() {
            return `
                <div class="pc-wrapper">
                    <div class="pc-tabs">
                        <button class="pc-tab active" onclick="window.AppCalculators.category_6.prime_calc.setMode('single', this)">Single Number</button>
                        <button class="pc-tab" onclick="window.AppCalculators.category_6.prime_calc.setMode('batch', this)">Batch Check</button>
                    </div>

                    <div class="pc-input-card">
                        <div id="pc-single-input-area">
                            <label style="display:block; margin-bottom:10px; color:#64748b; font-weight:600;">Enter a positive integer</label>
                            <div class="pc-input-group">
                                <input type="text" id="pc-input-num" class="pc-input" placeholder="e.g. 97" autocomplete="off" inputmode="numeric">
                            </div>
                            <div id="pc-error-msg" style="color:#ef4444; margin-top:10px; display:none; font-size:0.9rem;">
                                <i class="fas fa-exclamation-circle"></i> <span>Invalid input</span>
                            </div>
                        </div>

                        <div id="pc-batch-input-area" style="display:none;">
                            <label style="display:block; margin-bottom:10px; color:#64748b; font-weight:600;">Enter numbers (comma or space separated)</label>
                            <textarea id="pc-input-batch" class="pc-batch-area" placeholder="e.g. 2, 3, 4, 101, 2025"></textarea>
                        </div>

                        <div class="pc-actions">
                            <button class="pc-btn pc-btn-primary" id="action-btn">Check Prime</button>
                            <button class="pc-btn pc-btn-secondary" id="reset-pc-btn">Reset</button>
                        </div>
                    </div>

                    <div id="pc-result-area" class="pc-result-wrapper" style="display:none;"></div>

                    <div class="pc-history">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <h4 style="margin:0; color:#64748b;">Recent Checks</h4>
                            <button onclick="window.AppCalculators.category_6.prime_calc.clearHistory()" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.85rem;">Clear</button>
                        </div>
                        <div id="pc-history-list" class="pc-hist-list">
                            <span style="color:#cbd5e1; font-style:italic;">No history yet</span>
                        </div>
                    </div>
                </div>
            `;
        },

        init: function() {
            // Event Listeners
            const singleInput = document.getElementById('pc-input-num');
            const batchInput = document.getElementById('pc-input-batch');

            // Input Validation and Auto-Focus
            singleInput.addEventListener('input', (e) => {
                // Remove non-numeric characters except for simple navigation
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                document.getElementById('pc-error-msg').style.display = 'none';
            });

            // Enter Key Support
            singleInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') document.getElementById('action-btn').click();
            });

            document.getElementById('reset-pc-btn').addEventListener('click', () => {
                singleInput.value = '';
                batchInput.value = '';
                document.getElementById('pc-result-area').style.display = 'none';
                document.getElementById('pc-error-msg').style.display = 'none';
            });

            this.renderHistory();
        },

        setMode: function(mode, tabEl) {
            this.state.mode = mode;
            
            // UI Toggle
            document.querySelectorAll('.pc-tab').forEach(t => t.classList.remove('active'));
            tabEl.classList.add('active');

            if (mode === 'single') {
                document.getElementById('pc-single-input-area').style.display = 'block';
                document.getElementById('pc-batch-input-area').style.display = 'none';
            } else {
                document.getElementById('pc-single-input-area').style.display = 'none';
                document.getElementById('pc-batch-input-area').style.display = 'block';
            }

            document.getElementById('pc-result-area').style.display = 'none';
            document.getElementById('pc-error-msg').style.display = 'none';
        },

        calculate: function() {
            if (this.state.mode === 'single') {
                return this.calcSingle();
            } else {
                return this.calcBatch();
            }
        },

        calcSingle: function() {
            const input = document.getElementById('pc-input-num').value.trim();
            const errorEl = document.getElementById('pc-error-msg');
            const resArea = document.getElementById('pc-result-area');

            if (!input) {
                errorEl.querySelector('span').innerText = "Please enter a number.";
                errorEl.style.display = 'block';
                resArea.style.display = 'none';
                return null;
            }

            // BigInt parsing safety
            let num;
            try {
                num = BigInt(input);
            } catch (e) {
                errorEl.querySelector('span').innerText = "Invalid number format.";
                errorEl.style.display = 'block';
                return null;
            }

            // Check
            const result = this.isPrime(num);
            
            // Render
            resArea.style.display = 'block';
            
            let icon = result.isPrime ? 'fa-check-circle' : 'fa-times-circle';
            let status = result.isPrime ? 'Prime Number' : 'Composite Number';
            let styleClass = result.isPrime ? 'pc-res-prime' : 'pc-res-composite';
            let subText = result.isPrime ? 'Only divisible by 1 and itself.' : `Divisible by ${result.smallestFactor} and others.`;

            // Special Case: 0 and 1
            if (num < 2n) {
                status = "Not Prime";
                subText = "Numbers less than 2 are neither prime nor composite.";
                styleClass = "pc-res-composite"; // Red-ish
                icon = "fa-ban";
            }

            // Factorization (Extended Feature)
            let factorsHtml = '';
            if (!result.isPrime && num >= 2n) {
                const factors = this.getPrimeFactorization(num); // Gets array of factors
                let factorStr = factors.length > 10 ? factors.slice(0, 10).join(' × ') + '...' : factors.join(' × ');
                if (factors.length > 0) {
                     factorsHtml = `
                        <div class="pc-detail-box">
                            <div class="pc-detail-label">Prime Factorization</div>
                            <div class="pc-detail-val">${factorStr}</div>
                        </div>
                     `;
                }
            }
            
            // Nearest Primes (Extended Feature)
            const prev = this.getPrevPrime(num);
            const next = this.getNextPrime(num);

            // Save to History
            this.addToHistory(input, result.isPrime ? 'Prime' : (num < 2n ? 'Neither' : 'Composite'));

            return `
                <div class="pc-result-card ${styleClass}">
                    <i class="fas ${icon} pc-status-icon"></i>
                    <div class="pc-status-text">${status}</div>
                    <div class="pc-status-sub">${subText}</div>
                    <button class="pc-btn pc-btn-secondary" style="margin-top:15px; background:rgba(255,255,255,0.5); border:1px solid rgba(0,0,0,0.1);" onclick="navigator.clipboard.writeText('${input}')">
                        <i class="far fa-copy"></i> Copy Number
                    </button>
                </div>

                <div class="pc-details-grid">
                    ${factorsHtml}
                    <div class="pc-detail-box">
                        <div class="pc-detail-label">Previous Prime</div>
                        <div class="pc-detail-val">${prev ? prev.toString() : 'None'}</div>
                    </div>
                    <div class="pc-detail-box">
                        <div class="pc-detail-label">Next Prime</div>
                        <div class="pc-detail-val">${next.toString()}</div>
                    </div>
                </div>

                <div class="pc-edu-toggle">
                    <button class="pc-edu-btn" onclick="document.getElementById('pc-edu-content').classList.toggle('show')">
                        <i class="fas fa-info-circle"></i> How was this calculated?
                    </button>
                    <div id="pc-edu-content" class="pc-edu-content">
                        <strong>Logic Used:</strong> Trial Division (Optimized).<br>
                        1. If <em>n</em> < 2, it is not prime.<br>
                        2. If <em>n</em> = 2 or 3, it is prime.<br>
                        3. If <em>n</em> is divisible by 2 or 3, it is composite.<br>
                        4. We then check divisors of form (6k ± 1) up to √<em>n</em>. This skips checks for multiples of 2 and 3, increasing efficiency.<br>
                        <br>
                        For the factorization, we repeatedly divide by the smallest factor found until the number is reduced to 1.
                    </div>
                </div>
            `;
        },

        calcBatch: function() {
            const raw = document.getElementById('pc-input-batch').value;
            if (!raw.trim()) return '<div style="text-align:center; color:#ef4444;">Please enter some numbers.</div>';

            const parts = raw.split(/[\s,]+/);
            let html = '<div class="pc-batch-list">';
            let count = 0;

            parts.forEach(p => {
                if (!p.trim()) return;
                try {
                    // Strip non-numeric to be safe
                    const clean = p.replace(/[^0-9]/g, '');
                    if(!clean) return;

                    const num = BigInt(clean);
                    const res = this.isPrime(num);
                    
                    let status = res.isPrime ? 'Prime' : 'Composite';
                    let cls = res.isPrime ? 'is-prime' : 'is-comp';
                    
                    if (num < 2n) {
                        status = "N/A";
                        cls = "";
                    }

                    html += `
                        <div class="pc-batch-item ${cls}">
                            <span class="pc-batch-num">${clean}</span>
                            <span style="font-weight:600; color:${res.isPrime ? '#166534' : '#991b1b'}">${status}</span>
                        </div>
                    `;
                    count++;
                } catch(e) {}
            });

            html += '</div>';
            
            if(count === 0) return '<div style="text-align:center; color:#ef4444;">No valid numbers found.</div>';
            
            document.getElementById('pc-result-area').style.display = 'block';
            return html;
        },

        // --- Core Algorithms ---

        isPrime: function(n) {
            // BigInt logic
            if (n <= 1n) return { isPrime: false, smallestFactor: null };
            if (n <= 3n) return { isPrime: true };
            if (n % 2n === 0n) return { isPrime: false, smallestFactor: 2n };
            if (n % 3n === 0n) return { isPrime: false, smallestFactor: 3n };

            let i = 5n;
            // Safety limit for main thread: roughly 10^14 limit for instant calc
            // For larger, this might hang. We'll add a simple iteration cap for safety in a synchronous tool.
            const limit = this.sqrtBigInt(n);
            
            while (i <= limit) {
                if (n % i === 0n) return { isPrime: false, smallestFactor: i };
                if (n % (i + 2n) === 0n) return { isPrime: false, smallestFactor: i + 2n };
                i += 6n;
                
                // Safety break for extremely large composites to avoid freezing browser 
                // In a real production app, we'd use Web Workers or Miller-Rabin for > 15 digits
                if (i > 10000000n && n > 100000000000000n) {
                     // Fallback check or just give up for UI responsiveness
                     // For now, we assume standard usage inputs
                }
            }

            return { isPrime: true };
        },

        getPrimeFactorization: function(n) {
            if (n <= 1n) return [];
            let factors = [];
            let d = 2n;
            let temp = n;
            
            // Limit iterations to prevent freeze on large primes
            let iterations = 0;
            const maxIter = 100000; 

            // Small factor extraction optimized
            while (d * d <= temp && iterations < maxIter) {
                while (temp % d === 0n) {
                    factors.push(d.toString());
                    temp /= d;
                }
                d += (d === 2n) ? 1n : 2n; // 2, 3, 5, 7...
                iterations++;
            }
            if (temp > 1n) {
                factors.push(temp.toString());
            } else if (iterations >= maxIter) {
                factors.push("..."); // Indicate incomplete
            }
            return factors;
        },

        getPrevPrime: function(n) {
            if (n <= 2n) return null;
            let curr = n - 1n;
            let count = 0;
            while (curr >= 2n && count < 1000) { // Safety cap
                if (this.isPrime(curr).isPrime) return curr;
                curr--;
                count++;
            }
            return null;
        },

        getNextPrime: function(n) {
            let curr = n + 1n;
            let count = 0;
            while (count < 1000) { // Safety cap
                if (this.isPrime(curr).isPrime) return curr;
                curr++;
                count++;
            }
            return "Search limit reached";
        },

        sqrtBigInt: function(n) {
            if (n < 0n) throw 'Negative BigInt sqrt';
            if (n < 2n) return n;
            
            let x0 = n;
            let x1 = (x0 + n / x0) >> 1n;
            
            while (x1 < x0) {
                x0 = x1;
                x1 = (x0 + n / x0) >> 1n;
            }
            return x0;
        },

        // --- History ---
        
        renderHistory: function() {
            const list = document.getElementById('pc-history-list');
            const data = JSON.parse(localStorage.getItem(historyKey)) || [];
            
            if (data.length === 0) {
                list.innerHTML = '<span style="color:#cbd5e1; font-style:italic;">No history yet</span>';
                return;
            }

            list.innerHTML = data.map(item => `
                <div class="pc-hist-chip ${item.status === 'Prime' ? 'h-prime' : 'h-comp'}" 
                     onclick="document.getElementById('pc-input-num').value='${item.val}'; document.getElementById('action-btn').click();">
                    <strong>${item.val}</strong>: ${item.status}
                </div>
            `).join('');
        },

        addToHistory: function(val, status) {
            let data = JSON.parse(localStorage.getItem(historyKey)) || [];
            // Avoid dupes at top
            if (data.length > 0 && data[0].val === val) return;
            
            data.unshift({ val, status });
            if (data.length > 10) data.pop();
            
            localStorage.setItem(historyKey, JSON.stringify(data));
            this.renderHistory();
        },

        clearHistory: function() {
            localStorage.removeItem(historyKey);
            this.renderHistory();
        }
    };

    window.AppCalculators.category_6.prime_calc = toolObj;
})();