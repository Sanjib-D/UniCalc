if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_1) window.AppCalculators.category_1 = {};

window.AppCalculators.category_1.normal_calc = {
  getHtml: function () {
    return `
            <div class="calc-wrapper">
                <div class="calculator-card">
                    <div class="calc-display">
                        <div class="previous-operand" id="prev-display"></div>
                        <div class="current-operand" id="curr-display">0</div>
                    </div>

                    <div class="memory-row">
                        <button class="mem-btn" id="mc">MC</button>
                        <button class="mem-btn" id="mr">MR</button>
                        <button class="mem-btn" id="m-plus">M+</button>
                        <button class="mem-btn" id="m-minus">M-</button>
                        <button class="mem-btn" id="ms">MS</button>
                    </div>

                    <div class="calc-grid">
                        <button class="btn fn-btn" data-action="percent">%</button>
                        <button class="btn fn-btn" data-action="ce">CE</button>
                        <button class="btn fn-btn" data-action="ac">AC</button>
                        <button class="btn fn-btn" data-action="del"><i class="fas fa-backspace"></i></button>

                        <button class="btn fn-btn" data-action="inverse">1/x</button>
                        <button class="btn fn-btn" data-action="square">x²</button>
                        <button class="btn fn-btn" data-action="sqrt">√x</button>
                        <button class="btn op-btn" data-key="/">÷</button>

                        <button class="btn num-btn" data-key="7">7</button>
                        <button class="btn num-btn" data-key="8">8</button>
                        <button class="btn num-btn" data-key="9">9</button>
                        <button class="btn op-btn" data-key="*">×</button>

                        <button class="btn num-btn" data-key="4">4</button>
                        <button class="btn num-btn" data-key="5">5</button>
                        <button class="btn num-btn" data-key="6">6</button>
                        <button class="btn op-btn" data-key="-">−</button>

                        <button class="btn num-btn" data-key="1">1</button>
                        <button class="btn num-btn" data-key="2">2</button>
                        <button class="btn num-btn" data-key="3">3</button>
                        <button class="btn op-btn" data-key="+">+</button>

                        <button class="btn num-btn" data-action="sign">+/-</button>
                        <button class="btn num-btn" data-key="0">0</button>
                        <button class="btn num-btn" data-key=".">.</button>
                        <button class="btn equals-btn" data-key="Enter">=</button>
                    </div>
                </div>

                <div class="history-panel">
                    <div class="history-header">
                        <h3>History</h3>
                        <i class="fas fa-trash-alt" id="clear-history" title="Clear History"></i>
                    </div>
                    <div class="history-list" id="history-list">
                        <div class="empty-msg">No history yet</div>
                    </div>
                </div>
            </div>
            `;
  },
  init: function () {
    let currentOperand = "0";
    let previousOperand = "";
    let operation = undefined;
    let memoryValue = 0;
    let shouldResetScreen = false;

    const currentDisplayEl = document.getElementById("curr-display");
    const previousDisplayEl = document.getElementById("prev-display");
    const historyListEl = document.getElementById("history-list");

    if (!currentDisplayEl) return;

    const updateDisplay = () => {
      currentDisplayEl.innerText = currentOperand;
      if (operation != null) {
        let displayOp =
          operation === "*" ? "×" : operation === "/" ? "÷" : operation;
        previousDisplayEl.innerText = `${previousOperand} ${displayOp}`;
      } else {
        previousDisplayEl.innerText = "";
      }
    };

    const appendNumber = (number) => {
      if (currentOperand === "0" || shouldResetScreen) {
        currentOperand = number;
        shouldResetScreen = false;
      } else {
        if (number === "." && currentOperand.includes(".")) return;
        currentOperand = currentOperand.toString() + number.toString();
      }
      updateDisplay();
    };

    const chooseOperation = (op) => {
      if (currentOperand === "") return;
      if (previousOperand !== "") compute();
      operation = op;
      previousOperand = currentOperand;
      shouldResetScreen = true;
      updateDisplay();
    };

    const compute = () => {
      let computation;
      const prev = parseFloat(previousOperand);
      const current = parseFloat(currentOperand);
      if (isNaN(prev) || isNaN(current)) return;

      switch (operation) {
        case "+":
          computation = prev + current;
          break;
        case "-":
          computation = prev - current;
          break;
        case "*":
          computation = prev * current;
          break;
        case "/":
          if (current === 0) {
            alert("Cannot divide by zero");
            clearAll();
            return;
          }
          computation = prev / current;
          break;
        default:
          return;
      }

      computation = Math.round(computation * 1000000000) / 1000000000;
      addToHistory(previousOperand, operation, currentOperand, computation);

      currentOperand = computation;
      operation = undefined;
      previousOperand = "";
      shouldResetScreen = true;
      updateDisplay();
    };

    const clearAll = () => {
      currentOperand = "0";
      previousOperand = "";
      operation = undefined;
      updateDisplay();
    };

    const deleteNumber = () => {
      if (shouldResetScreen) return;
      currentOperand = currentOperand.toString().slice(0, -1);
      if (currentOperand === "") currentOperand = "0";
      updateDisplay();
    };

    const specialFunction = (type) => {
      let current = parseFloat(currentOperand);
      if (isNaN(current)) return;
      let result;
      switch (type) {
        case "percent":
          result = current / 100;
          break;
        case "square":
          result = Math.pow(current, 2);
          break;
        case "sqrt":
          result = Math.sqrt(current);
          break;
        case "inverse":
          result = 1 / current;
          break;
        case "sign":
          result = current * -1;
          break;
      }
      currentOperand = Math.round(result * 1000000000) / 1000000000;
      shouldResetScreen = true;
      updateDisplay();
    };

    const addToHistory = (prev, op, curr, result) => {
      let displayOp = op === "*" ? "×" : op === "/" ? "÷" : op;
      const div = document.createElement("div");
      div.className = "history-item";
      div.innerHTML = `<span class="hist-exp">${prev} ${displayOp} ${curr} =</span><span class="hist-res">${result}</span>`;
      div.onclick = () => {
        currentOperand = result;
        updateDisplay();
      };

      const empty = historyListEl.querySelector(".empty-msg");
      if (empty) empty.remove();
      historyListEl.prepend(div);
    };

    const calcCard = document.querySelector(".calculator-card");

    calcCard.querySelectorAll(".num-btn").forEach((btn) => {
      btn.onclick = () => {
        if (btn.dataset.action === "sign") specialFunction("sign");
        else appendNumber(btn.dataset.key);
      };
    });

    calcCard.querySelectorAll(".op-btn").forEach((btn) => {
      btn.onclick = () => chooseOperation(btn.dataset.key);
    });

    const eqBtn = calcCard.querySelector(".equals-btn");
    if (eqBtn) eqBtn.onclick = compute;

    calcCard.querySelectorAll(".fn-btn").forEach((btn) => {
      btn.onclick = () => {
        const action = btn.dataset.action;
        if (action === "ac") clearAll();
        else if (action === "ce") {
          currentOperand = "0";
          updateDisplay();
        } else if (action === "del") deleteNumber();
        else specialFunction(action);
      };
    });

    const memRow = document.querySelector(".memory-row");
    if (memRow) {
      memRow.querySelector("#mc").onclick = () => (memoryValue = 0);
      memRow.querySelector("#mr").onclick = () => {
        currentOperand = memoryValue;
        shouldResetScreen = true;
        updateDisplay();
      };
      memRow.querySelector("#m-plus").onclick = () => {
        memoryValue += parseFloat(currentOperand);
        shouldResetScreen = true;
      };
      memRow.querySelector("#m-minus").onclick = () => {
        memoryValue -= parseFloat(currentOperand);
        shouldResetScreen = true;
      };
      memRow.querySelector("#ms").onclick = () => {
        memoryValue = parseFloat(currentOperand);
        shouldResetScreen = true;
      };
    }

    const clearHistBtn = document.getElementById("clear-history");
    if (clearHistBtn) {
      clearHistBtn.onclick = () => {
        historyListEl.innerHTML = '<div class="empty-msg">No history yet</div>';
      };
    }

    const handleKey = (e) => {
      if (!document.getElementById("curr-display")) return;
      if ((e.key >= 0 && e.key <= 9) || e.key === ".") appendNumber(e.key);
      if (e.key === "=" || e.key === "Enter") compute();
      if (e.key === "Backspace") deleteNumber();
      if (e.key === "Escape") clearAll();
      if (["+", "-", "*", "/"].includes(e.key)) chooseOperation(e.key);
    };
    document.addEventListener("keydown", handleKey);
  },
};
