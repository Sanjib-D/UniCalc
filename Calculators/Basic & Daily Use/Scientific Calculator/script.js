let currentInput = "";
let memory = 0;
let angleMode = "DEG"; 
let historyLog = JSON.parse(localStorage.getItem('calcHistory')) || [];

const display = document.getElementById("main-display");
const historyDisplay = document.getElementById("history-display");
const memIndicator = document.getElementById("mem-indicator");
const historyPanel = document.getElementById("history-sidebar");
const histList = document.getElementById("hist-list");

// Related Tools Data (Basic & Daily Use Category)
const relatedTools = [
    { name: "Normal Calculator", url: "../Normal Calculator/index.html" },
    { name: "Scientific Calculator", url: "#", active: true },
    { name: "Age Calculator", url: "../Age Calculator/index.html" },
    { name: "Discount Calculator", url: "../Discount Calculator/index.html" },
    { name: "Percentage Calculator", url: "../Percentage Calculator/index.html" },
    { name: "Simple & Compound Interest", url: "../Interest Calculator/index.html" },
    { name: "EMI Calculator", url: "../EMI Calculator/index.html" },
    { name: "Salary Tax Calculator", url: "../Salary Tax Calculator/index.html" },
    { name: "GST Calculator", url: "../GST Calculator/index.html" }
];

function renderRelatedTools() {
    const container = document.getElementById('related-tools');
    if (!container) return;

    container.innerHTML = relatedTools.map(tool => `
        <a href="${tool.url}" class="side-link ${tool.active ? 'active' : ''}">
            <span>${tool.name}</span>
            <i class="fas fa-chevron-right arrow"></i>
        </a>
    `).join('');
}

// Call render on load
document.addEventListener('DOMContentLoaded', () => {
    renderRelatedTools();
});

function updateDisplay() {
    display.value = currentInput || "0";
}

function append(value) {
    if (currentInput === "Error" || currentInput === "Infinity") fullClear();
    currentInput += value;
    updateDisplay();
}

function appendConstant(constName) {
    if (constName === "PI") currentInput += "Math.PI";
    if (constName === "E") currentInput += "Math.E";
    updateDisplay();
}

function appendFunction(func) {
    if (currentInput === "Error") fullClear();
    switch (func) {
        case 'sin': currentInput += "sin("; break;
        case 'cos': currentInput += "cos("; break;
        case 'tan': currentInput += "tan("; break;
        case 'log': currentInput += "log10("; break; 
        case 'ln':  currentInput += "log("; break;
        case 'sqrt': currentInput += "sqrt("; break;
        case 'sq':   currentInput += "^2"; break;
        case 'exp':  currentInput += "E"; break;
        case 'fact': currentInput += "fact("; break;
        case 'abs':  currentInput += "abs("; break;
        case 'inv':  currentInput = `(1/(${currentInput || 1}))`; break;
        case '^':    currentInput += "^"; break;
    }
    updateDisplay();
}

function toggleSign() {
    if(currentInput.startsWith("-")) {
        currentInput = currentInput.substring(1);
    } else {
        currentInput = "-" + currentInput;
    }
    updateDisplay();
}

function fullClear() {
    currentInput = "";
    historyDisplay.innerText = "";
    updateDisplay();
}

function deleteChar() {
    if (currentInput.toString().match(/Math\.(PI|E)$/)) {
        currentInput = currentInput.replace(/Math\.(PI|E)$/, "");
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function toggleHistory() {
    historyPanel.classList.toggle('active');
    if (historyPanel.classList.contains('active')) {
        renderHistory();
    }
}

function renderHistory() {
    histList.innerHTML = "";
    if (historyLog.length === 0) {
        histList.innerHTML = '<p class="empty-msg" style="text-align:center; color:#aaa; margin-top:20px;">No history yet</p>';
        return;
    }

    historyLog.slice().reverse().forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'hist-item';
        div.onclick = () => loadHistoryItem(item.result);
        div.innerHTML = `
            <small>${item.expression} =</small>
            <strong>${item.result}</strong>
        `;
        histList.appendChild(div);
    });
}

function addToHistory(expr, res) {
    if(historyLog.length > 0 && historyLog[historyLog.length-1].result === res) return;
    
    historyLog.push({ expression: expr, result: res });
    
    if (historyLog.length > 50) historyLog.shift();
    
    localStorage.setItem('calcHistory', JSON.stringify(historyLog));
}

function loadHistoryItem(val) {
    currentInput += val;
    updateDisplay();
    toggleHistory();
}

function clearHistory() {
    historyLog = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
}

function memoryClear() { memory = 0; updateMemInd(); }
function memoryRecall() { currentInput += memory; updateDisplay(); }
function memoryAdd() { try { memory += eval(sanitize(currentInput)); updateMemInd(); } catch(e){} }
function memorySub() { try { memory -= eval(sanitize(currentInput)); updateMemInd(); } catch(e){} }
function memoryStore() { try { memory = eval(sanitize(currentInput)); updateMemInd(); } catch(e){} }
function updateMemInd() { memIndicator.innerText = memory !== 0 ? "M" : ""; }

function setAngleMode(mode) {
    angleMode = mode;
    document.getElementById("deg-btn").className = mode === 'DEG' ? 'mode-btn active' : 'mode-btn';
    document.getElementById("rad-btn").className = mode === 'RAD' ? 'mode-btn active' : 'mode-btn';
}

function sanitize(input) {
    let expr = input;
    expr = expr.replace(/\^/g, "**");
    return expr;
}

function sin(x) { return angleMode === "DEG" ? Math.sin(x * Math.PI / 180) : Math.sin(x); }
function cos(x) { return angleMode === "DEG" ? Math.cos(x * Math.PI / 180) : Math.cos(x); }
function tan(x) { return angleMode === "DEG" ? Math.tan(x * Math.PI / 180) : Math.tan(x); }
const sqrt = Math.sqrt;
const log10 = Math.log10;
const log = Math.log;
const abs = Math.abs;

function fact(num) {
    if (num < 0) return NaN;
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) result *= i;
    return result;
}

function calculate() {
    try {
        const expression = currentInput;
        let executable = sanitize(expression);
        let result = eval(executable);

        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(10)); 
        }

        historyDisplay.innerText = expression + " =";
        addToHistory(expression, result);
        
        currentInput = result.toString();
        updateDisplay();
    } catch (e) {
        historyDisplay.innerText = "Error";
        currentInput = "Error";
        updateDisplay();
    }
}

document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/[0-9]/.test(key)) append(key);
    if (['+', '-', '*', '/', '(', ')', '.', '%'].includes(key)) append(key);
    if (key === 'Enter') calculate();
    if (key === 'Backspace') deleteChar();
    if (key === 'Escape') fullClear();
});