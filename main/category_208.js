if (!window.AppCalculators.category_2) window.AppCalculators.category_2 = {};

window.AppCalculators.category_2.retirement_calc = {
  name: "Retirement Planner",

  init: function() {
    this.syncSlider('ret-current-age', 'range-current-age');
    this.syncSlider('ret-retire-age', 'range-retire-age');
    this.syncSlider('ret-contribution', 'range-contribution');
    this.calculate();
  },

  getHtml: function() {
    return `
      <div class="ret-calc-wrapper">
        
        <div class="ret-grid">
          
          <div class="ret-inputs">
            
            <div class="ret-card">
              <div class="ret-card-header"><i class="fas fa-user-clock"></i> Timeline</div>
              <div class="ret-card-body">
                <div class="input-row">
                    <label>Current Age</label>
                    <div class="input-group">
                        <input type="number" id="ret-current-age" value="30" oninput="window.AppCalculators.category_2.retirement_calc.syncSlider('ret-current-age', 'range-current-age')">
                        <span>Yrs</span>
                    </div>
                </div>
                <input type="range" id="range-current-age" min="18" max="80" value="30" class="styled-slider" oninput="window.AppCalculators.category_2.retirement_calc.syncInput('ret-current-age', 'range-current-age')">

                <div class="input-row mt-3">
                    <label>Retirement Age</label>
                    <div class="input-group">
                        <input type="number" id="ret-retire-age" value="60" oninput="window.AppCalculators.category_2.retirement_calc.syncSlider('ret-retire-age', 'range-retire-age')">
                        <span>Yrs</span>
                    </div>
                </div>
                <input type="range" id="range-retire-age" min="40" max="90" value="60" class="styled-slider" oninput="window.AppCalculators.category_2.retirement_calc.syncInput('ret-retire-age', 'range-retire-age')">
                
                <div class="input-row mt-3">
                    <label>Life Expectancy</label>
                    <div class="input-group">
                        <input type="number" id="ret-life-exp" value="85" oninput="window.AppCalculators.category_2.retirement_calc.calculate()">
                        <span>Yrs</span>
                    </div>
                </div>
              </div>
            </div>

            <div class="ret-card">
              <div class="ret-card-header"><i class="fas fa-coins"></i> Savings & Expenses</div>
              <div class="ret-card-body">
                <div class="form-group">
                    <label>Current Savings Corpus</label>
                    <div class="amount-wrapper">
                        <span class="curr-symbol">$</span>
                        <input type="number" id="ret-corpus" value="50000" oninput="window.AppCalculators.category_2.retirement_calc.calculate()">
                    </div>
                </div>

                <div class="form-group">
                    <label>Monthly Contribution (SIP)</label>
                    <div class="amount-wrapper">
                        <span class="curr-symbol">$</span>
                        <input type="number" id="ret-contribution" value="1000" oninput="window.AppCalculators.category_2.retirement_calc.syncSlider('ret-contribution', 'range-contribution')">
                    </div>
                    <input type="range" id="range-contribution" min="0" max="50000" step="500" value="1000" class="styled-slider mt-2" oninput="window.AppCalculators.category_2.retirement_calc.syncInput('ret-contribution', 'range-contribution')">
                </div>

                <div class="form-group">
                    <label>Required Monthly Expense (Today's Value)</label>
                    <div class="amount-wrapper">
                        <span class="curr-symbol">$</span>
                        <input type="number" id="ret-expenses" value="2000" oninput="window.AppCalculators.category_2.retirement_calc.calculate()">
                    </div>
                    <small style="color:#666; font-size:0.75rem;">How much do you need monthly if you retired today?</small>
                </div>
              </div>
            </div>

            <div class="ret-card collapsed-card">
              <div class="ret-card-header toggle-trigger" onclick="this.parentElement.classList.toggle('open')">
                <span><i class="fas fa-chart-line"></i> Growth & Inflation Rates</span>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="ret-card-body toggled-content">
                <div class="input-row">
                    <label>Pre-Retirement Return</label>
                    <input type="number" id="ret-rate-pre" value="10" class="pct-input" oninput="window.AppCalculators.category_2.retirement_calc.calculate()">
                </div>
                <div class="input-row">
                    <label>Post-Retirement Return</label>
                    <input type="number" id="ret-rate-post" value="7" class="pct-input" oninput="window.AppCalculators.category_2.retirement_calc.calculate()">
                </div>
                <div class="input-row">
                    <label>Inflation Rate</label>
                    <input type="number" id="ret-inflation" value="6" class="pct-input" oninput="window.AppCalculators.category_2.retirement_calc.calculate()">
                </div>
              </div>
            </div>

            <button class="calc-btn-lg ret-btn" onclick="window.AppCalculators.category_2.retirement_calc.calculate()">
                Plan My Retirement
            </button>

          </div>

          <div class="ret-results">
            
            <div class="ret-status-banner" id="ret-status">
                <i class="fas fa-check-circle"></i> On Track!
            </div>

            <div class="ret-summary-grid">
                <div class="ret-stat">
                    <small>Corpus Needed</small>
                    <strong id="val-needed">$0</strong>
                </div>
                <div class="ret-stat">
                    <small>Projected Corpus</small>
                    <strong id="val-projected" style="color:var(--primary);">$0</strong>
                </div>
                <div class="ret-stat">
                    <small>At Retirement</small>
                    <span id="val-monthly-need">Monthly Need: $0</span>
                </div>
            </div>

            <div class="ret-chart-container">
                <h4>Wealth Timeline</h4>
                <div class="chart-wrapper">
                    <svg id="ret-timeline-chart" viewBox="0 0 400 180" preserveAspectRatio="none"></svg>
                    <div id="chart-tooltip" class="chart-tooltip"></div>
                </div>
                <div class="chart-legend">
                    <span class="leg-item"><span class="dot acc"></span> Accumulation</span>
                    <span class="leg-item"><span class="dot dist"></span> Distribution</span>
                </div>
            </div>

            <div class="ret-insight-box" id="ret-insight">
                Calculations...
            </div>

            <button class="schedule-btn-outline" onclick="window.AppCalculators.category_2.retirement_calc.toggleSchedule()">
                View Year-by-Year Plan
            </button>

          </div>
        </div>

        <div id="ret-schedule-wrapper" class="ret-schedule-box">
            <h3>Retirement Roadmap</h3>
            <div class="table-responsive">
                <table class="ret-table">
                    <thead>
                        <tr>
                            <th>Age</th>
                            <th>Year</th>
                            <th>Status</th>
                            <th>Cash Flow</th>
                            <th>Corpus Balance</th>
                        </tr>
                    </thead>
                    <tbody id="ret-table-body"></tbody>
                </table>
            </div>
        </div>

      </div>
    `;
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
    range.style.background = `linear-gradient(90deg, #20bf6b ${percentage}%, #e9ecef ${percentage}%)`;
  },

  toggleSchedule: function() {
    const el = document.getElementById('ret-schedule-wrapper');
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
    if(el.style.display === 'block') el.scrollIntoView({behavior: 'smooth'});
  },

  formatMoney: function(num) {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  },

  calculate: function() {
    // 1. Gather Inputs
    const currentAge = parseFloat(document.getElementById('ret-current-age').value);
    const retireAge = parseFloat(document.getElementById('ret-retire-age').value);
    const lifeExp = parseFloat(document.getElementById('ret-life-exp').value);
    
    const currentCorpus = parseFloat(document.getElementById('ret-corpus').value) || 0;
    const monthlyContrib = parseFloat(document.getElementById('ret-contribution').value) || 0;
    const monthlyExpenseToday = parseFloat(document.getElementById('ret-expenses').value) || 0;

    const rPre = parseFloat(document.getElementById('ret-rate-pre').value) / 100;
    const rPost = parseFloat(document.getElementById('ret-rate-post').value) / 100;
    const inflation = parseFloat(document.getElementById('ret-inflation').value) / 100;

    if (currentAge >= retireAge) {
        document.getElementById('ret-insight').innerHTML = "Current age must be less than retirement age.";
        return;
    }

    const yearsToInvest = retireAge - currentAge;
    const yearsInRetirement = lifeExp - retireAge;
    
    // --- Step 1: Accumulation Phase Calculation ---
    // FV of Current Corpus
    const corpusFromSavings = currentCorpus * Math.pow(1 + rPre, yearsToInvest);
    
    // FV of SIP (Monthly Compounding)
    const monthlyRate = rPre / 12;
    const months = yearsToInvest * 12;
    const corpusFromSIP = monthlyContrib * ( (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate ) * (1 + monthlyRate);
    
    const projectedCorpus = corpusFromSavings + corpusFromSIP;

    // --- Step 2: Requirement Calculation ---
    // Future Value of Monthly Expense at Retirement Age
    const monthlyExpenseAtRetirement = monthlyExpenseToday * Math.pow(1 + inflation, yearsToInvest);
    
    // Corpus needed to sustain this expense for 'yearsInRetirement'
    // This is PV of an Annuity (Inflation Adjusted Return)
    // Real Rate of Return during retirement
    const realRate = (1 + rPost) / (1 + inflation) - 1;
    const nRetMonths = yearsInRetirement * 12;
    
    // Formula: PV = P * [1 - (1+r)^-n] / r
    // Note: We use monthly real rate approximation
    const monthlyRealRate = realRate / 12;
    
    const corpusNeeded = monthlyExpenseAtRetirement * ( (1 - Math.pow(1 + monthlyRealRate, -nRetMonths)) / monthlyRealRate );

    // --- Update UI ---
    document.getElementById('val-needed').innerText = this.formatMoney(corpusNeeded);
    document.getElementById('val-projected').innerText = this.formatMoney(projectedCorpus);
    document.getElementById('val-monthly-need').innerText = `Monthly Need: ${this.formatMoney(monthlyExpenseAtRetirement)}`;

    // Status & Insight
    const statusBanner = document.getElementById('ret-status');
    const insightBox = document.getElementById('ret-insight');
    const difference = projectedCorpus - corpusNeeded;

    if (projectedCorpus >= corpusNeeded) {
        statusBanner.className = "ret-status-banner success";
        statusBanner.innerHTML = `<i class="fas fa-check-circle"></i> Fully Funded!`;
        insightBox.innerHTML = `Great job! You are projected to have a surplus of <b>${this.formatMoney(difference)}</b>. Your retirement is secure with current assumptions.`;
    } else {
        statusBanner.className = "ret-status-banner danger";
        statusBanner.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Shortfall Detected`;
        
        // Suggestion Calculation (Extra SIP needed)
        const shortfall = corpusNeeded - projectedCorpus;
        // PMT formula to find extra SIP
        const extraSIP = shortfall * monthlyRate / ( (Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate) );
        
        insightBox.innerHTML = `You may fall short by <b>${this.formatMoney(shortfall)}</b>. Consider increasing your monthly investment by <b>${this.formatMoney(extraSIP)}</b> to bridge the gap.`;
    }

    // --- Generate Data for Graph & Table ---
    this.generateProjectionData(currentAge, retireAge, lifeExp, currentCorpus, monthlyContrib, rPre, rPost, monthlyExpenseAtRetirement, inflation);
  },

  generateProjectionData: function(age, retAge, lifeExp, corpus, sip, rPre, rPost, expAtRet, infl) {
    let data = [];
    let balance = corpus;
    let currentYear = new Date().getFullYear();
    
    // Accumulation Phase
    for (let a = age; a < retAge; a++) {
        let interest = balance * rPre;
        let contribution = sip * 12;
        let endBal = balance + interest + contribution;
        
        data.push({
            age: a,
            year: currentYear,
            phase: 'Accumulation',
            flow: contribution,
            balance: Math.round(endBal)
        });
        
        balance = endBal;
        currentYear++;
    }

    // Distribution Phase
    let annualExpense = expAtRet * 12;
    let depletesAt = null;

    for (let a = retAge; a <= lifeExp; a++) {
        // Expense grows by inflation
        if (a > retAge) annualExpense = annualExpense * (1 + infl);
        
        let interest = balance * rPost;
        let endBal = balance + interest - annualExpense;
        
        if (endBal < 0 && depletesAt === null) depletesAt = a;
        if (endBal < 0) endBal = 0;

        data.push({
            age: a,
            year: currentYear,
            phase: 'Distribution',
            flow: -annualExpense,
            balance: Math.round(endBal)
        });

        balance = endBal;
        currentYear++;
    }

    this.drawChart(data, retAge);
    this.renderTable(data);
  },

  drawChart: function(data, retAge) {
    const svg = document.getElementById('ret-timeline-chart');
    const w = 400, h = 180, pad = 20;
    
    // Max Balance for scaling
    const maxBal = Math.max(...data.map(d => d.balance));
    
    const getX = (i) => (i / (data.length - 1)) * (w - 2*pad) + pad;
    const getY = (val) => h - pad - ((val / maxBal) * (h - 2*pad));

    // Build Area Path
    let pathD = `M ${pad} ${h - pad} `;
    
    data.forEach((d, i) => {
        pathD += `L ${getX(i)} ${getY(d.balance)} `;
    });
    
    pathD += `L ${w - pad} ${h - pad} Z`;

    // Find Split Point (Retirement Age Index)
    const retIndex = data.findIndex(d => d.age === retAge);
    const splitX = getX(retIndex);

    svg.innerHTML = `
        <defs>
            <linearGradient id="gradAcc" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#20bf6b;stop-opacity:0.6" />
                <stop offset="100%" style="stop-color:#20bf6b;stop-opacity:0.1" />
            </linearGradient>
            <linearGradient id="gradDist" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#eb3b5a;stop-opacity:0.6" />
                <stop offset="100%" style="stop-color:#eb3b5a;stop-opacity:0.1" />
            </linearGradient>
        </defs>
        
        <line x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}" stroke="#ccc" stroke-width="1" />
        <line x1="${splitX}" y1="${pad}" x2="${splitX}" y2="${h-pad}" stroke="#888" stroke-dasharray="4" />
        <text x="${splitX+5}" y="30" font-size="10" fill="#666">Retirement (${retAge})</text>

        <path d="${pathD}" fill="url(#gradAcc)" stroke="#20bf6b" stroke-width="2" />
    `;
  },

  renderTable: function(data) {
    const tbody = document.getElementById('ret-table-body');
    let html = '';
    
    data.forEach(d => {
        const flowClass = d.phase === 'Accumulation' ? 'text-success' : 'text-danger';
        const flowSign = d.phase === 'Accumulation' ? '+' : '-';
        const absFlow = Math.abs(d.flow);
        
        html += `
            <tr class="${d.balance === 0 ? 'bg-danger-light' : ''}">
                <td>${d.age}</td>
                <td>${d.year}</td>
                <td><span class="badge ${d.phase === 'Accumulation' ? 'badge-acc' : 'badge-dist'}">${d.phase}</span></td>
                <td class="${flowClass}">${flowSign}${this.formatMoney(Math.round(absFlow))}</td>
                <td><strong>${this.formatMoney(d.balance)}</strong></td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
  }
};