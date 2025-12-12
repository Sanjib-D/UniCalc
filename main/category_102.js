if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_1) window.AppCalculators.category_1 = {};

window.AppCalculators.category_1.sci_calc = {
    getHtml: function () {
        return `
            <div class="calc-wrapper">
                <div class="calculator-card scientific-card">
                    
                    <div class="calc-display">
                        <div class="previous-operand" id="sci-prev-display" style="min-height:20px;"></div>
                        <div class="current-operand" id="sci-curr-display">0</div>
                    </div>

                    <div class="memory-row">
                        <button class="mem-btn mode-active" id="btn-deg">DEG</button>
                        <button class="mem-btn" id="btn-rad">RAD</button>
                        <span style="width:10px"></span>
                        <button class="mem-btn" data-mem="mc">MC</button>
                        <button class="mem-btn" data-mem="mr">MR</button>
                        <button class="mem-btn" data-mem="m+">M+</button>
                        <button class="mem-btn" data-mem="m-">M-</button>
                    </div>

                    <div class="calc-grid sci-grid">
                        <button class="btn fn-btn sci-btn" id="btn-shift" title="Access Secondary Functions (Yellow)">2nd</button>
                        <button class="btn fn-btn sci-btn" data-func="pi">π</button>
                        <button class="btn fn-btn sci-btn" data-func="e">e</button>
                        <button class="btn fn-btn sci-btn" data-action="ce">CE</button>
                        <button class="btn fn-btn sci-btn" data-action="ac" style="color:#d63384;">AC</button>

                        <button class="btn fn-btn sci-btn shiftable" data-orig="sin" data-shift="asin">sin</button>
                        <button class="btn fn-btn sci-btn shiftable" data-orig="cos" data-shift="acos">cos</button>
                        <button class="btn fn-btn sci-btn shiftable" data-orig="tan" data-shift="atan">tan</button>
                        <button class="btn fn-btn sci-btn" data-func="exp">EXP</button>
                        <button class="btn fn-btn sci-btn" data-val="%">mod</button>

                        <button class="btn fn-btn sci-btn shiftable" data-orig="pow2" data-shift="pow3">x²</button>
                        <button class="btn fn-btn sci-btn shiftable" data-orig="sqrt" data-shift="cbrt">√</button>
                        <button class="btn fn-btn sci-btn shiftable" data-orig="log" data-shift="pow10">log</button>
                        <button class="btn fn-btn sci-btn shiftable" data-orig="ln" data-shift="powe">ln</button>
                        <button class="btn fn-btn sci-btn" data-func="fact">n!</button>

                        <button class="btn fn-btn sci-btn" data-val="(">(</button>
                        <button class="btn fn-btn sci-btn" data-val=")">)</button>
                        <button class="btn fn-btn sci-btn" data-func="inv">1/x</button>
                        <button class="btn fn-btn sci-btn" data-action="del">DEL</button>
                        <button class="btn op-btn sci-btn" data-val="/">÷</button>

                        <button class="btn fn-btn sci-btn" data-val="^">xʸ</button>
                        <button class="btn num-btn sci-btn" data-val="7">7</button>
                        <button class="btn num-btn sci-btn" data-val="8">8</button>
                        <button class="btn num-btn sci-btn" data-val="9">9</button>
                        <button class="btn op-btn sci-btn" data-val="*">×</button>

                        <button class="btn fn-btn sci-btn" data-func="abs">|x|</button>
                        <button class="btn num-btn sci-btn" data-val="4">4</button>
                        <button class="btn num-btn sci-btn" data-val="5">5</button>
                        <button class="btn num-btn sci-btn" data-val="6">6</button>
                        <button class="btn op-btn sci-btn" data-val="-">−</button>

                        <button class="btn fn-btn sci-btn" data-func="rand">Rnd</button>
                        <button class="btn num-btn sci-btn" data-val="1">1</button>
                        <button class="btn num-btn sci-btn" data-val="2">2</button>
                        <button class="btn num-btn sci-btn" data-val="3">3</button>
                        <button class="btn op-btn sci-btn" data-val="+">+</button>

                        <button class="btn num-btn sci-btn" data-action="sign">+/-</button>
                        <button class="btn num-btn sci-btn" data-val="0">0</button>
                        <button class="btn num-btn sci-btn" data-val=".">.</button>
                        <button class="btn equals-btn sci-btn" id="sci-equal" style="grid-column: span 2;">=</button>
                    </div>
                </div>

                <div class="history-panel">
                    <div class="history-header">
                        <h3>Tape</h3>
                        <i class="fas fa-trash-alt" id="sci-clear-hist"></i>
                    </div>
                    <div class="history-list" id="sci-history-list">
                        <div class="empty-msg">No history</div>
                    </div>
                </div>
            </div>
        `;
    },

    init: function () {
        // --- State ---
        let currentExp = "";     // The internal math string (e.g., "Math.sin(30)")
        let displayExp = "";     // What the user sees (e.g., "sin(30")
        let isDegree = true;     // Mode: Degree or Radian
        let isShift = false;     // Shift/2nd key toggle
        let memory = 0;
        let lastResult = null;

        // --- DOM ---
        const dispCurr = document.getElementById("sci-curr-display");
        const dispPrev = document.getElementById("sci-prev-display");
        const btnDeg = document.getElementById("btn-deg");
        const btnRad = document.getElementById("btn-rad");
        const btnShift = document.getElementById("btn-shift");
        const histList = document.getElementById("sci-history-list");

        // --- Helpers ---
        const updateDisplay = () => {
            // If empty, show 0
            dispCurr.innerText = displayExp === "" ? "0" : displayExp;
            // Auto-scroll to end
            dispCurr.scrollLeft = dispCurr.scrollWidth;
        };

        const updateShiftButtons = () => {
            const shiftables = document.querySelectorAll(".shiftable");
            shiftables.forEach(btn => {
                if (isShift) {
                    const func = btn.dataset.shift;
                    // Update Label based on function
                    if(func === 'asin') btn.innerText = "sin⁻¹";
                    if(func === 'acos') btn.innerText = "cos⁻¹";
                    if(func === 'atan') btn.innerText = "tan⁻¹";
                    if(func === 'pow10') btn.innerHTML = "10<sup>x</sup>";
                    if(func === 'powe') btn.innerHTML = "e<sup>x</sup>";
                    if(func === 'cbrt') btn.innerHTML = "∛";
                    if(func === 'pow3') btn.innerHTML = "x³";
                } else {
                    const func = btn.dataset.orig;
                    if(func === 'sin') btn.innerText = "sin";
                    if(func === 'cos') btn.innerText = "cos";
                    if(func === 'tan') btn.innerText = "tan";
                    if(func === 'log') btn.innerText = "log";
                    if(func === 'ln') btn.innerText = "ln";
                    if(func === 'sqrt') btn.innerHTML = "√";
                    if(func === 'pow2') btn.innerHTML = "x²";
                }
            });
            btnShift.classList.toggle("shift-active", isShift);
        };

        const addToHistory = (expression, result) => {
            const item = document.createElement("div");
            item.className = "history-item";
            item.innerHTML = `<span class="hist-exp">${expression} =</span><span class="hist-res">${result}</span>`;
            item.onclick = () => {
                displayExp += result.toString();
                updateDisplay();
            };
            // Remove empty msg
            if (histList.querySelector(".empty-msg")) histList.innerHTML = "";
            histList.prepend(item);
        };

        // --- Math Functions for Eval Scope ---
        const mathScope = {
            sin: (x) => isDegree ? Math.sin(x * Math.PI / 180) : Math.sin(x),
            cos: (x) => isDegree ? Math.cos(x * Math.PI / 180) : Math.cos(x),
            tan: (x) => isDegree ? Math.tan(x * Math.PI / 180) : Math.tan(x),
            asin: (x) => isDegree ? Math.asin(x) * 180 / Math.PI : Math.asin(x),
            acos: (x) => isDegree ? Math.acos(x) * 180 / Math.PI : Math.acos(x),
            atan: (x) => isDegree ? Math.atan(x) * 180 / Math.PI : Math.atan(x),
            log: (x) => Math.log10(x),
            ln: (x) => Math.log(x),
            sqrt: (x) => Math.sqrt(x),
            cbrt: (x) => Math.cbrt(x),
            abs: (x) => Math.abs(x),
            fact: (n) => {
                if (n < 0) return NaN;
                if (n === 0 || n === 1) return 1;
                let r = 1;
                for (let i = 2; i <= n; i++) r *= i;
                return r;
            },
            pow: (b, e) => Math.pow(b, e)
        };

        // --- Core Logic ---
        const processCalculation = () => {
            try {
                // 1. Pre-process display string to valid JS
                // Replace constants
                let evalStr = displayExp
                    .replace(/×/g, "*")
                    .replace(/÷/g, "/")
                    .replace(/π/g, "Math.PI")
                    .replace(/e/g, "Math.E")
                    .replace(/mod/g, "%");

                // Replace ^ with Math.pow. (Basic implementation for x^y)
                // Note: handling "2^3^4" strictly requires a parser, but split/join works for simple cases
                if (evalStr.includes("^")) {
                    const parts = evalStr.split("^");
                    evalStr = `Math.pow(${parts[0]}, ${parts[1]})`; 
                    // Note: This simple replace only works for single powers. 
                    // For robust nesting, we'd need a recursive parser. 
                    // For this demo, let's assume simple usage or use ** (ES6)
                    evalStr = displayExp.replace(/×/g, "*").replace(/÷/g, "/").replace(/\^/g, "**")
                        .replace(/π/g, "Math.PI").replace(/e/g, "Math.E").replace(/mod/g, "%");
                }

                // Identify functions like sin(30) -> mathScope.sin(30)
                // We will wrap the eval in a function with 'with' block or explicit calls
                // A safer way without 'with' is prepending "mathScope." to known functions
                const funcs = ["sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "cbrt", "abs", "fact"];
                funcs.forEach(f => {
                    // Regex lookbehind/ahead to ensure we don't replace inside other words if they existed
                    // Simple global replace for unique function names
                    const regex = new RegExp(`\\b${f}\\(`, 'g');
                    evalStr = evalStr.replace(regex, `mathScope.${f}(`);
                });

                // 2. Evaluate
                // We use a Function constructor to access the mathScope closure
                const resultFunc = new Function("mathScope", "Math", `return ${evalStr}`);
                const res = resultFunc(mathScope, Math);

                // 3. Rounding (avoid 0.000000004 errors)
                let finalRes = parseFloat(res.toPrecision(12)); 
                // Remove trailing zeros if integer
                finalRes = parseFloat(finalRes.toString());

                if (isNaN(finalRes)) throw "Error";

                // Update UI
                dispPrev.innerText = `${displayExp} =`;
                addToHistory(displayExp, finalRes);
                displayExp = finalRes.toString();
                lastResult = finalRes;
                updateDisplay();

            } catch (e) {
                dispCurr.innerText = "Error";
                console.error(e);
                setTimeout(() => {
                    displayExp = "";
                    updateDisplay();
                }, 1500);
            }
        };

        // --- Event Listeners ---

        // 1. Mode Toggles
        btnDeg.onclick = () => { isDegree = true; btnDeg.classList.add("mode-active"); btnRad.classList.remove("mode-active"); };
        btnRad.onclick = () => { isDegree = false; btnRad.classList.add("mode-active"); btnDeg.classList.remove("mode-active"); };

        // 2. Shift Toggle
        btnShift.onclick = () => {
            isShift = !isShift;
            updateShiftButtons();
        };

        // 3. Grid Buttons
        document.querySelectorAll(".sci-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const val = btn.dataset.val;
                const action = btn.dataset.action;
                const func = btn.dataset.func;
                const orig = btn.dataset.orig; // for shiftable buttons

                // Handle Shiftable Logic First
                if (orig) {
                    const op = isShift ? btn.dataset.shift : orig;
                    
                    if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'cbrt'].includes(op)) {
                        displayExp += `${op}(`;
                    } else if (op === 'pow2') {
                        displayExp += `^2`; // Simplified display
                    } else if (op === 'pow3') {
                        displayExp += `^3`;
                    } else if (op === 'pow10') {
                        displayExp += `10^`;
                    } else if (op === 'powe') {
                        displayExp += `e^`;
                    }
                    updateDisplay();
                    return;
                }

                // Handle Standard Actions
                if (val) {
                    displayExp += val;
                    updateDisplay();
                } 
                else if (func) {
                    // Standard functions
                    if (func === 'pi') displayExp += "π";
                    if (func === 'e') displayExp += "e";
                    if (func === 'exp') displayExp += "e"; // Scientific notation 5e2
                    if (func === 'fact') displayExp += "fact("; // We insert the function wrapper
                    if (func === 'inv') displayExp += "1/("; 
                    if (func === 'abs') displayExp += "abs(";
                    if (func === 'rand') displayExp += Math.random().toFixed(4);
                    updateDisplay();
                }
                else if (action === 'ac') {
                    displayExp = "";
                    dispPrev.innerText = "";
                    updateDisplay();
                }
                else if (action === 'ce') {
                    displayExp = "";
                    updateDisplay();
                }
                else if (action === 'del') {
                    displayExp = displayExp.toString().slice(0, -1);
                    updateDisplay();
                }
                else if (action === 'sign') {
                    // Simple toggle: wrap in -() or remove it. 
                    // Complex approach: find last number. 
                    // Simplest: just append * -1
                    if (displayExp) displayExp = `-(${displayExp})`;
                    updateDisplay();
                }
            });
        });

        // 4. Equals
        document.getElementById("sci-equal").onclick = processCalculation;

        // 5. Memory
        const memBtns = document.querySelectorAll(".mem-btn[data-mem]");
        memBtns.forEach(b => {
            b.onclick = () => {
                const type = b.dataset.mem;
                const currentVal = parseFloat(displayExp) || 0; 
                // Note: Ideally calculate first if expression
                
                if (type === 'mc') {
                    memory = 0;
                    alert("Memory Cleared");
                }
                else if (type === 'mr') {
                    displayExp += memory;
                    updateDisplay();
                }
                else if (type === 'm+') {
                    // We need the result of current screen to add
                    if(lastResult !== null) memory += lastResult;
                    else memory += currentVal;
                    // Visual feedback could be added here
                }
                else if (type === 'm-') {
                     if(lastResult !== null) memory -= lastResult;
                     else memory -= currentVal;
                }
            };
        });

        // 6. Clear History
        document.getElementById("sci-clear-hist").onclick = () => {
            histList.innerHTML = '<div class="empty-msg">No history</div>';
        };
    }
};