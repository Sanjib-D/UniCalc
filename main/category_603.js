// Logic for Quadratic Equation Solver (Category 6, Tool 3) - Modern UI
// ID: quadratic_calc

(function() {
    if (!window.AppCalculators.category_6) {
        window.AppCalculators.category_6 = {};
    }

    const toolId = "quadratic_calc";
    const historyKey = "quad_calc_history";

    const toolObj = {
        getHtml: function() {
            return `
                <div class="quad-wrapper">
                    <div class="input-card">
                        <div class="equation-label">Standard Form: ax² + bx + c = 0</div>
                        
                        <div class="coefficients-row">
                            <div class="coeff-group">
                                <input type="number" id="qa" placeholder="a">
                                <span class="coeff-label">x²</span>
                            </div>
                            <span class="coeff-label" style="font-size:1.2rem">+</span>
                            <div class="coeff-group">
                                <input type="number" id="qb" placeholder="b">
                                <span class="coeff-label">x</span>
                            </div>
                            <span class="coeff-label" style="font-size:1.2rem">+</span>
                            <div class="coeff-group">
                                <input type="number" id="qc" placeholder="c">
                            </div>
                            <span class="coeff-label" style="font-size:1.5rem">= 0</span>
                        </div>

                        <div id="equation-display" class="equation-preview">
                            1x² + 0x + 0 = 0
                        </div>

                        <div class="action-row">
                            <button id="action-btn" class="btn-solve"><i class="fas fa-calculator"></i> Solve</button>
                            <button id="reset-quad-btn" class="btn-reset"><i class="fas fa-undo"></i> Reset</button>
                        </div>
                    </div>

                    <div class="history-bar">
                        <h4 style="color:#64748b; font-size:0.9rem; margin-bottom:10px;">Recent Equations:</h4>
                        <div id="quad-history-list" class="history-chips">
                            <span style="color:#999; font-size:0.8rem;">No recent history</span>
                        </div>
                    </div>
                </div>
            `;
        },

        init: function() {
            const inputs = ['qa', 'qb', 'qc'];
            
            inputs.forEach(id => {
                const el = document.getElementById(id);
                // Default placeholders logic for visual guide
                el.addEventListener('input', this.updateEquationDisplay);
            });

            document.getElementById('reset-quad-btn').addEventListener('click', () => {
                inputs.forEach(id => document.getElementById(id).value = '');
                this.updateEquationDisplay();
                document.getElementById('calc-result').style.display = 'none';
            });

            this.renderHistory();

            document.getElementById('action-btn').addEventListener('click', () => {
                setTimeout(() => {
                    const a = parseFloat(document.getElementById('qa').value) || 0;
                    const b = parseFloat(document.getElementById('qb').value) || 0;
                    const c = parseFloat(document.getElementById('qc').value) || 0;
                    
                    if (a !== 0) {
                        this.drawGraph(a, b, c);
                        this.addToHistory(a, b, c);
                        
                        // Toggle Logic
                        const toggle = document.getElementById('steps-header-toggle');
                        if (toggle) {
                            toggle.onclick = () => {
                                const body = document.getElementById('steps-content-body');
                                body.classList.toggle('show');
                                const icon = toggle.querySelector('.toggle-icon');
                                icon.classList.toggle('fa-chevron-down');
                                icon.classList.toggle('fa-chevron-up');
                            };
                        }
                    }
                }, 50);
            });
        },

        updateEquationDisplay: function() {
            const getVal = (id, def) => {
                const v = document.getElementById(id).value;
                return v === '' ? def : v;
            };
            
            const a = getVal('qa', 'a');
            const b = getVal('qb', 'b');
            const c = getVal('qc', 'c');

            const fmt = (val, isFirst = false) => {
                if(isNaN(val)) return isFirst ? val : `+ ${val}`;
                if(val < 0) return `- ${Math.abs(val)}`;
                return isFirst ? val : `+ ${val}`;
            };

            const strA = `${a === 'a' || a === '-' ? a : parseFloat(a)}x²`;
            const strB = `${fmt(b)}x`;
            const strC = `${fmt(c)}`;

            document.getElementById('equation-display').innerText = `${strA} ${strB} ${strC} = 0`;
        },

        calculate: function() {
            const aVal = document.getElementById('qa').value;
            const bVal = document.getElementById('qb').value;
            const cVal = document.getElementById('qc').value;

            if (aVal === '' || bVal === '' || cVal === '') {
                alert("Please fill in all coefficients.");
                return null;
            }

            const a = parseFloat(aVal);
            const b = parseFloat(bVal);
            const c = parseFloat(cVal);

            if (a === 0) {
                return `
                    <div style="text-align:center; color: #ef4444; padding: 20px; background:#fef2f2; border-radius:12px;">
                        <i class="fas fa-exclamation-circle fa-2x"></i>
                        <h3>Not Quadratic</h3>
                        <p>Coefficient <b>'a'</b> cannot be zero.</p>
                    </div>
                `;
            }

            const disc = (b * b) - (4 * a * c);
            const vx = -b / (2 * a);
            const vy = (a * vx * vx) + (b * vx) + c;
            
            let r1, r2, type, r1Str, r2Str;

            if (disc > 0) {
                type = "Two Real Roots";
                r1 = (-b + Math.sqrt(disc)) / (2 * a);
                r2 = (-b - Math.sqrt(disc)) / (2 * a);
                r1Str = this.fmt(r1);
                r2Str = this.fmt(r2);
            } else if (disc === 0) {
                type = "One Repeated Root";
                r1 = -b / (2 * a);
                r1Str = r2Str = this.fmt(r1);
            } else {
                type = "Two Complex Roots";
                const real = -b / (2 * a);
                const imag = Math.sqrt(Math.abs(disc)) / (2 * a);
                r1Str = `${this.fmt(real)} + ${this.fmt(imag)}i`;
                r2Str = `${this.fmt(real)} - ${this.fmt(imag)}i`;
            }

            return `
                <div class="results-container">
                    <div class="roots-card">
                        <div class="roots-title">${type}</div>
                        <div class="roots-display">
                            <div class="root-value">
                                x₁ = ${r1Str} 
                                <i class="far fa-copy copy-icon" onclick="navigator.clipboard.writeText('${r1Str}')"></i>
                            </div>
                            <div class="root-value">
                                x₂ = ${r2Str}
                                <i class="far fa-copy copy-icon" onclick="navigator.clipboard.writeText('${r2Str}')"></i>
                            </div>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-box">
                            <div class="stat-label">Discriminant (Δ)</div>
                            <div class="stat-val" style="color:${disc < 0 ? '#ef4444' : '#10b981'}">${this.fmt(disc)}</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Vertex</div>
                            <div class="stat-val">(${this.fmt(vx)}, ${this.fmt(vy)})</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Direction</div>
                            <div class="stat-val">${a > 0 ? 'Upward ∪' : 'Downward ∩'}</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Axis of Sym.</div>
                            <div class="stat-val">x = ${this.fmt(vx)}</div>
                        </div>
                    </div>

                    <div class="graph-container">
                        <canvas id="quadGraph"></canvas>
                    </div>

                    <div class="steps-wrapper">
                        <div class="steps-toggle" id="steps-header-toggle">
                            <span><i class="fas fa-file-alt"></i> View Step-by-Step Solution</span>
                            <i class="fas fa-chevron-down toggle-icon"></i>
                        </div>
                        <div class="steps-body" id="steps-content-body">
                            <div class="math-step">
                                <strong>Formula:</strong> x = [-b ± √(b² - 4ac)] / 2a
                            </div>
                            <div class="math-step">
                                <strong>1. Discriminant:</strong> Δ = (${b})² - 4(${a})(${c}) = ${this.fmt(disc)}
                            </div>
                            <div class="math-step">
                                <strong>2. Substitute:</strong> x = [${-b} ± √${disc < 0 ? Math.abs(disc) + 'i' : this.fmt(disc)}] / ${2*a}
                            </div>
                            <div class="math-step">
                                <strong>3. Solve:</strong><br>
                                x₁ = ${r1Str}<br>
                                x₂ = ${r2Str}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        fmt: function(n) {
            return parseFloat(n.toFixed(5)).toString();
        },

        drawGraph: function(a, b, c) {
            const canvas = document.getElementById('quadGraph');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            // Handle DPI scaling for sharp text
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            
            const w = rect.width;
            const h = rect.height;

            const vx = -b / (2 * a);
            // Dynamic Zoom
            let range = Math.abs(vx) + 10; 
            const disc = b*b - 4*a*c;
            if (disc > 0) range = Math.max(range, Math.abs((-b+Math.sqrt(disc))/(2*a)) + 2);
            
            const xMin = vx - 10; 
            const xMax = vx + 10;
            
            // Find Y range in this X window
            const calcY = x => a*x*x + b*x + c;
            const vy = calcY(vx);
            const yMin = Math.min(vy, calcY(xMin), calcY(xMax)) - 5;
            const yMax = Math.max(vy, calcY(xMin), calcY(xMax)) + 5;

            const mapX = x => (x - xMin) / (xMax - xMin) * w;
            const mapY = y => h - (y - yMin) / (yMax - yMin) * h;

            // Clear
            ctx.fillStyle = "#fff";
            ctx.fillRect(0,0,w,h);

            // Grid
            ctx.strokeStyle = "#f1f5f9";
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let i=0; i<=20; i++) {
                // simple grid logic
                let x = xMin + (xMax-xMin)*(i/20);
                let y = yMin + (yMax-yMin)*(i/20);
                let px = mapX(x);
                let py = mapY(y);
                ctx.moveTo(px, 0); ctx.lineTo(px, h);
                ctx.moveTo(0, py); ctx.lineTo(w, py);
            }
            ctx.stroke();

            // Axes
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 2;
            ctx.beginPath();
            const y0 = mapY(0);
            const x0 = mapX(0);
            if(y0 >= 0 && y0 <= h) { ctx.moveTo(0, y0); ctx.lineTo(w, y0); }
            if(x0 >= 0 && x0 <= w) { ctx.moveTo(x0, 0); ctx.lineTo(x0, h); }
            ctx.stroke();

            // Parabola
            ctx.strokeStyle = "#4361ee";
            ctx.lineWidth = 3;
            ctx.beginPath();
            for(let px=0; px<=w; px++) {
                let x = xMin + (px/w)*(xMax-xMin);
                let y = a*x*x + b*x + c;
                let py = mapY(y);
                if(px===0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
            
            // Vertex
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(mapX(vx), mapY(vy), 5, 0, Math.PI*2);
            ctx.fill();
        },

        renderHistory: function() {
            const list = document.getElementById('quad-history-list');
            const data = JSON.parse(localStorage.getItem(historyKey)) || [];
            
            if (data.length === 0) return;

            list.innerHTML = data.map((item, idx) => `
                <div class="hist-chip" onclick="window.AppCalculators.category_6.quadratic_calc.loadHistory(${idx})">
                    ${item.a}x² ${item.b>=0?'+':''}${item.b}x ${item.c>=0?'+':''}${item.c}=0
                </div>
            `).join('');
        },

        addToHistory: function(a, b, c) {
            let data = JSON.parse(localStorage.getItem(historyKey)) || [];
            data.unshift({a,b,c});
            if(data.length > 8) data.pop();
            localStorage.setItem(historyKey, JSON.stringify(data));
            this.renderHistory();
        },

        loadHistory: function(idx) {
            const data = JSON.parse(localStorage.getItem(historyKey));
            if(data && data[idx]) {
                const {a,b,c} = data[idx];
                document.getElementById('qa').value = a;
                document.getElementById('qb').value = b;
                document.getElementById('qc').value = c;
                this.updateEquationDisplay();
                document.getElementById('action-btn').click();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    window.AppCalculators.category_6.quadratic_calc = toolObj;
})();