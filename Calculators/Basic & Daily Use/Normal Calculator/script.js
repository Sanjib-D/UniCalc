let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let memoryValue = 0;
let shouldResetScreen = false;

const currentDisplayEl = document.getElementById('curr-display');
const previousDisplayEl = document.getElementById('prev-display');
const historyListEl = document.getElementById('history-list');

function appendNumber(number) {
    if (currentOperand === '0' || shouldResetScreen) {
        currentOperand = number;
        shouldResetScreen = false;
    } else {
        if (number === '.' && currentOperand.includes('.')) return;
        currentOperand = currentOperand.toString() + number.toString();
    }
    updateDisplay();
}

function chooseOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        compute();
    }
    operation = op;
    previousOperand = currentOperand;
    shouldResetScreen = true;
    updateDisplay();
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '*': computation = prev * current; break;
        case '/': 
            if (current === 0) {
                alert("Cannot divide by zero");
                clearAll();
                return;
            }
            computation = prev / current; 
            break;
        default: return;
    }

    computation = Math.round(computation * 1000000000) / 1000000000;

    addToHistory(previousOperand, operation, currentOperand, computation);
    
    currentOperand = computation;
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
    updateDisplay();
}

function appendFunction(type) {
    let current = parseFloat(currentOperand);
    if (isNaN(current)) return;
    
    let result;
    switch(type) {
        case 'percent': result = current / 100; break;
        case 'square': result = Math.pow(current, 2); break;
        case 'sqrt': result = Math.sqrt(current); break;
        case 'inverse': result = 1 / current; break;
    }
    
    result = Math.round(result * 1000000000) / 1000000000;
    
    currentOperand = result;
    shouldResetScreen = true;
    updateDisplay();
}

function toggleSign() {
    if (currentOperand === '0') return;
    currentOperand = currentOperand * -1;
    updateDisplay();
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function clearEntry() {
    currentOperand = '0';
    updateDisplay();
}

function deleteNumber() {
    if (shouldResetScreen) return;
    if (currentOperand.toString().length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.toString().slice(0, -1);
    }
    updateDisplay();
}

function getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

function updateDisplay() {
    if (currentOperand.toString().length > 10) {
        currentDisplayEl.style.fontSize = '1.8rem';
    } else if (currentOperand.toString().length > 7) {
        currentDisplayEl.style.fontSize = '2.2rem';
    } else {
        currentDisplayEl.style.fontSize = '2.5rem';
    }

    currentDisplayEl.innerText = getDisplayNumber(currentOperand);
    
    if (operation != null) {
        let displayOp = operation === '*' ? '×' : operation === '/' ? '÷' : operation;
        previousDisplayEl.innerText = `${getDisplayNumber(previousOperand)} ${displayOp}`;
    } else {
        previousDisplayEl.innerText = '';
    }
}

function addToHistory(prev, op, curr, result) {
    let displayOp = op === '*' ? '×' : op === '/' ? '÷' : op;
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.innerHTML = `
        <span class="hist-exp">${prev} ${displayOp} ${curr} =</span>
        <span class="hist-res">${result}</span>
    `;
    
    historyItem.onclick = () => {
        currentOperand = result;
        updateDisplay();
    };

    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    historyListEl.prepend(historyItem);
}

function clearHistory() {
    historyListEl.innerHTML = '<div class="empty-msg">No history yet</div>';
}

function memoryAdd() { memoryValue += parseFloat(currentOperand); shouldResetScreen = true; }
function memorySub() { memoryValue -= parseFloat(currentOperand); shouldResetScreen = true; }
function memoryRecall() { currentOperand = memoryValue; shouldResetScreen = true; updateDisplay(); }
function memoryClear() { memoryValue = 0; }
function memoryStore() { memoryValue = parseFloat(currentOperand); shouldResetScreen = true; }

document.addEventListener('keydown', (e) => {
    if ((e.key >= 0 && e.key <= 9) || e.key === '.') appendNumber(e.key);
    if (e.key === '=' || e.key === 'Enter') compute();
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clearAll();
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') chooseOperation(e.key);
});