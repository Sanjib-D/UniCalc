if (!window.AppCalculators.category_2) window.AppCalculators.category_2 = {};

window.AppCalculators.category_2.cc_payoff_calc = {
  name: "Credit Card Payoff Calculator",

  init: function() {
    this.syncSlider('cc-balance', 'range-cc-balance');
    this.syncSlider('cc-apr', 'range-cc-apr');
    this.calculate();
  },

  getHtml: function() {
    return `
      <div class="cc-calc-wrapper">
        
        <div class="cc-strategy-switch">
          <button class="cc-mode-btn active" id="mode-fixed" onclick="window.AppCalculators.category_2.cc_payoff_calc.switchMode('fixed')">
            Fixed Payment
          </button>
          <button class="cc-mode-btn" id="mode-goal" onclick="window.AppCalculators.category_2.cc_payoff_calc.switchMode('goal')">
            Goal Timeline
          </button>
        </div>

        <div class="cc-grid">
          
          <div class="cc-inputs">
            
            <div class="cc-card">
              <div class="cc-card-header"><i class="far fa-credit-card"></i> Card Details</div>
              <div class="cc-card-body">
                <div class="input-card-group">
                    <label>Current Balance</label>
                    <div class="amount-wrapper">
                        <span class="curr-symbol">$</span>
                        <input type="number" id="cc-balance" value="5000" oninput="window.AppCalculators.category_2.cc_payoff_calc.syncSlider('cc-balance', 'range-cc-balance')">
                    </div>
                    <input type="range" id="range-cc-balance" min="100" max="50000" step="100" value="5000" class="styled-slider mt-2" oninput="window.AppCalculators.category_2.cc_payoff_calc.syncInput('cc-balance', 'range-cc-balance')">
                </div>

                <div class="input-card-group mt-3">
                    <label>Interest Rate (APR)</label>
                    <div class="input-group">
                        <input type="number" id="cc-apr" value="18.9" step="0.1" oninput="window.AppCalculators.category_2.cc_payoff_calc.syncSlider('cc-apr', 'range-cc-apr')">
                        <span>%</span>
                    </div>
                    <input type="range" id="range-cc-apr" min="0" max="40" step="0.1" value="18.9" class="styled-slider mt-2" oninput="window.AppCalculators.category_2.cc_payoff_calc.syncInput('cc-apr', 'range-cc-apr')">
                </div>

                <div class="input-card-group mt-3">
                    <label>Minimum Payment</label>
                    <div class="flex-row gap-10">
                        <div class="input-group small">
                            <input type="number" id="cc-min-pct" value="2" oninput="window.AppCalculators.category_2.cc_payoff_calc.calculate()">
                            <span>%</span>
                        </div>
                        <span style="font-size:0.9rem; color:#888;">or min $</span>
                        <div class="input-group small">
                            <input type="number" id="cc-min-abs" value="35" oninput="window.AppCalculators.category_2.cc_payoff_calc.calculate()">
                        </div>
                    </div>
                </div>
              </div>
            </div>

            <div class="cc-card highlight-card">
              <div class="cc-card-header" id="strategy-header"><i class="fas fa-money-bill-wave"></i> Monthly Payment</div>
              <div class="cc-card-body">
                
                <div id="input-fixed-pay">
                    <label>How much can you pay monthly?</label>
                    <div class="amount-wrapper">
                        <span class="curr-symbol">$</span>
                        <input type="number" id="cc-payment" value="200" oninput="window.AppCalculators.category_2.cc_payoff_calc.calculate()">
                    </div>
                    <small id="min-pay-warning" class="warning-text" style="display:none;"><i class="fas fa-exclamation-circle"></i> Must be at least <span id="val-min-req">$0</span></small>
                </div>

                <div id="input-goal-time" style="display:none;">
                    <label>Desired Payoff Time (Months)</label>
                    <input type="number" id="cc-months-goal" value="12" class="cc-input-box" oninput="window.AppCalculators.category_2.cc_payoff_calc.calculate()">
                    <div class="quick-months">
                        <span onclick="document.getElementById('cc-months-goal').value=6; window.AppCalculators.category_2.cc_payoff_calc.calculate()">6 Mo</span>
                        <span onclick="document.getElementById('cc-months-goal').value=12; window.AppCalculators.category_2.cc_payoff_calc.calculate()">1 Yr</span>
                        <span onclick="document.getElementById('cc-months-goal').value=24; window.AppCalculators.category_2.cc_payoff_calc.calculate()">2 Yr</span>
                    </div>
                </div>

              </div>
            </div>

            <button class="calc-btn-lg cc-btn" onclick="window.AppCalculators.category_2.cc_payoff_calc.calculate()">
                Calculate Payoff
            </button>

          </div>

          <div class="cc-results">
            
            <div class="cc-freedom-banner">
                <span>Debt Free By</span>
                <h2 id="val-freedom-date">...</h2>
                <div class="cc-time-badge" id="val-time-total">0 Months</div>
            </div>

            <div class="cc-summary-grid">
                <div class="cc-stat">
                    <small>Total Interest</small>
                    <strong id="val-total-int" class="text-danger">$0</strong>
                </div>
                <div class="cc-stat">
                    <small>Total Repayment</small>
                    <strong id="val-total-pay">$0</strong>
                </div>
            </div>

            <div class="cc-chart-container">
                <h4>Balance Reduction</h4>
                <div class="chart-wrapper">
                    <svg id="cc-payoff-chart" viewBox="0 0 400 180" preserveAspectRatio="none"></svg>
                </div>
                <div class="chart-legend">
                    <span class="leg-item"><span class="dot bal"></span> Balance</span>
                    <span class="leg-item"><span class="dot int"></span> Interest Paid</span>
                </div>
            </div>

            <div class="cc-insight-box" id="cc-insight">
                Calculations...
            </div>

            <button class="schedule-btn-outline" onclick="window.AppCalculators.category_2.cc_payoff_calc.toggleSchedule()">
                View Amortization Schedule
            </button>

          </div>
        </div>

        <div id="cc-schedule-wrapper" class="cc-schedule-box">
            <h3>Payoff Schedule</h3>
            <div class="table-responsive">
                <table class="cc-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Payment</th>
                            <th>Interest</th>
                            <th>Principal</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody id="cc-table-body"></tbody>
                </table>
            </div>
        </div>

      </div>
    `;
  },

  mode: 'fixed', // fixed or goal

  switchMode: function(mode) {
    this.mode = mode;
    document.querySelectorAll('.cc-mode-btn').forEach(b => b.classList.remove('active'));
    
    if (mode === 'fixed') {
        document.getElementById('mode-fixed').classList.add('active');
        document.getElementById('input-fixed-pay').style.display = 'block';
        document.getElementById('input-goal-time').style.display = 'none';
        document.getElementById('strategy-header').innerHTML = '<i class="fas fa-money-bill-wave"></i> Monthly Payment';
    } else {
        document.getElementById('mode-goal').classList.add('active');
        document.getElementById('input-fixed-pay').style.display = 'none';
        document.getElementById('input-goal-time').style.display = 'block';
        document.getElementById('strategy-header').innerHTML = '<i class="fas fa-hourglass-half"></i> Payoff Goal';
    }
    this.calculate();
  },

  syncSlider: function(inputId, rangeId) {
    const val = document.getElementById(inputId).value;
    document.getElementById(rangeId).value = val;
    this.updateSliderFill(rangeId);
    this.calculate();
  },

  syncInput: function(inputId, rangeId) {
    const val = document.getElementById(rangeId).value;
    document.getElementById(inputId).value = val;
    this.updateSliderFill(rangeId);
    this.calculate();
  },

  updateSliderFill: function(rangeId) {
    const range = document.getElementById(rangeId);
    const percentage = ((range.value - range.min) / (range.max - range.min)) * 100;
    range.style.background = `linear-gradient(90deg, #ff6b6b ${percentage}%, #e9ecef ${percentage}%)`;
  },

  toggleSchedule: function() {
    const el = document.getElementById('cc-schedule-wrapper');
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
    if(el.style.display === 'block') el.scrollIntoView({behavior: 'smooth'});
  },

  formatMoney: function(num) {
    return "$" + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  },

  calculate: function() {
    // 1. Gather Inputs
    const balance = parseFloat(document.getElementById('cc-balance').value) || 0;
    const apr = parseFloat(document.getElementById('cc-apr').value) || 0;
    const minPct = parseFloat(document.getElementById('cc-min-pct').value) || 0;
    const minAbs = parseFloat(document.getElementById('cc-min-abs').value) || 0;
    
    // Monthly Rate
    const monthlyRate = (apr / 100) / 12;
    
    // Calculate Minimum Payment for this month
    // Min Payment is usually max(Fixed Amount, % of Balance + Interest) or just % of Balance
    // Simplified: Max(Fixed, % of Bal)
    const currentMinPayment = Math.max(minAbs, (balance * minPct / 100));
    
    document.getElementById('val-min-req').innerText = this.formatMoney(Math.ceil(currentMinPayment));

    let monthlyPayment = 0;

    if (this.mode === 'fixed') {
        monthlyPayment = parseFloat(document.getElementById('cc-payment').value) || 0;
        
        // Validation
        const warning = document.getElementById('min-pay-warning');
        if (monthlyPayment < currentMinPayment) {
            warning.style.display = 'block';
            // Don't stop calc, but warn. Actually, if payment < interest, infinite loop.
            const interestOnly = balance * monthlyRate;
            if (monthlyPayment <= interestOnly) {
                this.showError("Payment too low. It doesn't cover interest.");
                return;
            }
        } else {
            warning.style.display = 'none';
        }
    } else {
        // Goal Mode: Calculate required payment
        const months = parseFloat(document.getElementById('cc-months-goal').value) || 12;
        // PMT Formula: P * r * (1+r)^n / ((1+r)^n - 1)
        if (monthlyRate > 0) {
            monthlyPayment = (balance * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        } else {
            monthlyPayment = balance / months;
        }
    }

    // --- Amortization Loop ---
    let schedule = [];
    let currentBal = balance;
    let totalInterest = 0;
    let monthsCount = 0;
    let totalPaid = 0;

    // Safety break
    const MAX_MONTHS = 600; 

    while (currentBal > 0 && monthsCount < MAX_MONTHS) {
        monthsCount++;
        let interest = currentBal * monthlyRate;
        let principal = monthlyPayment - interest;
        
        // Handle last payment
        if (currentBal + interest < monthlyPayment) {
            monthlyPayment = currentBal + interest;
            principal = currentBal;
        }

        currentBal -= principal;
        totalInterest += interest;
        totalPaid += monthlyPayment;

        if (currentBal < 0.01) currentBal = 0;

        schedule.push({
            month: monthsCount,
            payment: monthlyPayment,
            interest: interest,
            principal: principal,
            balance: currentBal
        });
    }

    if (monthsCount >= MAX_MONTHS) {
        this.showError("Payment too low. Debt will never be paid off.");
        return;
    }

    // --- Update Results ---
    
    // Freedom Date
    const date = new Date();
    date.setMonth(date.getMonth() + monthsCount);
    const options = { month: 'long', year: 'numeric' };
    document.getElementById('val-freedom-date').innerText = date.toLocaleDateString('en-US', options);
    
    // Stats
    const years = Math.floor(monthsCount / 12);
    const m = monthsCount % 12;
    let timeStr = years > 0 ? `${years} Yr ${m} Mo` : `${m} Months`;
    
    document.getElementById('val-time-total').innerText = timeStr;
    document.getElementById('val-total-int').innerText = this.formatMoney(totalInterest);
    document.getElementById('val-total-pay').innerText = this.formatMoney(totalPaid);

    // Insight
    const elInsight = document.getElementById('cc-insight');
    if(this.mode === 'goal') {
        elInsight.innerHTML = `To pay off <b>${this.formatMoney(balance)}</b> in <b>${monthsCount} months</b>, you need to pay <b>${this.formatMoney(schedule[0].payment)}/month</b>.`;
    } else {
        // Compare with Minimum Strategy (Approximate)
        // If they paid just minimum, how much longer?
        // Rough estimate or just stat
        const intPercent = (totalInterest / balance) * 100;
        elInsight.innerHTML = `You will pay <b>${intPercent.toFixed(1)}%</b> of your original balance in interest. Increasing payment by $50 could save months.`;
    }

    // Reset Error UI
    document.querySelector('.cc-results').style.opacity = '1';
    
    this.drawChart(schedule, balance);
    this.renderTable(schedule);
  },

  showError: function(msg) {
    document.getElementById('val-freedom-date').innerText = "Never";
    document.getElementById('val-time-total').innerText = "∞";
    document.getElementById('cc-insight').innerHTML = `<span style="color:#d63031"><i class="fas fa-times-circle"></i> ${msg}</span>`;
    document.querySelector('.chart-wrapper').innerHTML = ""; // clear chart
  },

  drawChart: function(data, startBal) {
    const svg = document.getElementById('cc-payoff-chart');
    const w = 400, h = 180, pad = 20;
    
    const maxVal = startBal;
    
    const getX = (i) => (i / (data.length)) * (w - 2*pad) + pad;
    const getY = (val) => h - pad - ((val / maxVal) * (h - 2*pad));

    // Balance Line
    let pathD = `M ${pad} ${getY(startBal)} `;
    data.forEach((d, i) => {
        pathD += `L ${getX(i+1)} ${getY(d.balance)} `;
    });
    
    // Fill Area
    let fillD = pathD + `L ${getX(data.length)} ${h-pad} L ${pad} ${h-pad} Z`;

    svg.innerHTML = `
        <defs>
            <linearGradient id="gradBal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:0.5" />
                <stop offset="100%" style="stop-color:#ff6b6b;stop-opacity:0.0" />
            </linearGradient>
        </defs>
        
        <line x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}" stroke="#ccc" stroke-width="1" />
        <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h-pad}" stroke="#ccc" stroke-width="1" />

        <path d="${fillD}" fill="url(#gradBal)" />
        <path d="${pathD}" fill="none" stroke="#ff6b6b" stroke-width="3" stroke-linecap="round" />
    `;
  },

  renderTable: function(data) {
    const tbody = document.getElementById('cc-table-body');
    // Limit rows for performance if too long, showing first 12 and summary
    // showing all for now, assuming usually < 60 months
    
    let html = data.map(d => `
        <tr>
            <td>${d.month}</td>
            <td>${this.formatMoney(d.payment)}</td>
            <td style="color:#ff6b6b">${this.formatMoney(d.interest)}</td>
            <td style="color:#20bf6b">${this.formatMoney(d.principal)}</td>
            <td><strong>${this.formatMoney(d.balance)}</strong></td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
  }
};