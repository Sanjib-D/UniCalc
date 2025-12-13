if (!window.AppCalculators.category_2) window.AppCalculators.category_2 = {};

window.AppCalculators.category_2.currency_calc = {
  name: "Live Currency Converter",
  
  // State
  state: {
    amount: 1,
    from: "USD",
    to: "EUR",
    rates: {},
    lastUpdated: null,
    targetSelector: null // Tracks if we are changing 'from' or 'to'
  },

  // Enhanced Data for Search (Code, Name, Country Keywords)
  currencyData: [
    { code: "USD", name: "US Dollar", country: "United States, America, USA" },
    { code: "EUR", name: "Euro", country: "European Union, Germany, France, Italy, Spain" },
    { code: "GBP", name: "British Pound", country: "United Kingdom, UK, England" },
    { code: "INR", name: "Indian Rupee", country: "India" },
    { code: "JPY", name: "Japanese Yen", country: "Japan" },
    { code: "AUD", name: "Australian Dollar", country: "Australia" },
    { code: "CAD", name: "Canadian Dollar", country: "Canada" },
    { code: "CHF", name: "Swiss Franc", country: "Switzerland" },
    { code: "CNY", name: "Chinese Yuan", country: "China" },
    { code: "SGD", name: "Singapore Dollar", country: "Singapore" },
    { code: "AED", name: "UAE Dirham", country: "United Arab Emirates, Dubai" },
    { code: "SAR", name: "Saudi Riyal", country: "Saudi Arabia" },
    { code: "KWD", name: "Kuwaiti Dinar", country: "Kuwait" },
    { code: "RUB", name: "Russian Ruble", country: "Russia" },
    { code: "BRL", name: "Brazilian Real", country: "Brazil" },
    { code: "ZAR", name: "South African Rand", country: "South Africa" },
    { code: "NZD", name: "New Zealand Dollar", country: "New Zealand" },
    { code: "MXN", name: "Mexican Peso", country: "Mexico" },
    { code: "HKD", name: "Hong Kong Dollar", country: "Hong Kong" },
    { code: "SEK", name: "Swedish Krona", country: "Sweden" },
    { code: "KRW", name: "South Korean Won", country: "South Korea" },
    { code: "TRY", name: "Turkish Lira", country: "Turkey" }
  ],

  // Fallback Rates (Snapshot)
  fallbackRates: {
    "USD": 1, "EUR": 0.92, "GBP": 0.79, "INR": 83.5, "JPY": 151.2, "AUD": 1.52, 
    "CAD": 1.36, "CHF": 0.91, "CNY": 7.23, "SGD": 1.35, "AED": 3.67, "SAR": 3.75, 
    "KWD": 0.31, "RUB": 92.5, "BRL": 5.15, "ZAR": 18.8, "NZD": 1.66, "MXN": 16.7, 
    "HKD": 7.83, "SEK": 10.8, "KRW": 1375, "TRY": 32.2
  },

  init: function() {
    this.fetchRates().then(() => {
        this.updateUI();
        this.calculate();
    });
  },

  getHtml: function() {
    return `
      <div class="curr-calc-wrapper">
        
        <div class="curr-main-card">
            
            <div class="curr-header">
                <span id="curr-last-update">Updating...</span>
                <button class="refresh-btn" onclick="window.AppCalculators.category_2.currency_calc.refreshRates()">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>

            <div class="curr-input-section">
                <label>Amount</label>
                <div class="amount-wrapper">
                    <span class="curr-symbol" id="input-symbol">$</span>
                    <input type="number" id="curr-amount" value="1" oninput="window.AppCalculators.category_2.currency_calc.calculate()">
                </div>
            </div>

            <div class="curr-selector-row">
                
                <div class="curr-select-box">
                    <label>From</label>
                    <div class="custom-select-trigger" onclick="window.AppCalculators.category_2.currency_calc.openModal('from')">
                        <img src="" id="flag-from" class="curr-flag" alt="flag">
                        <span id="code-from" class="curr-code-display">USD</span>
                        <i class="fas fa-chevron-down" style="font-size: 0.8rem; color: #adb5bd;"></i>
                    </div>
                    <span class="curr-name-label" id="name-from">US Dollar</span>
                </div>

                <button class="curr-swap-btn" onclick="window.AppCalculators.category_2.currency_calc.swapCurrencies()">
                    <i class="fas fa-exchange-alt"></i>
                </button>

                <div class="curr-select-box">
                    <label>To</label>
                    <div class="custom-select-trigger" onclick="window.AppCalculators.category_2.currency_calc.openModal('to')">
                        <img src="" id="flag-to" class="curr-flag" alt="flag">
                        <span id="code-to" class="curr-code-display">EUR</span>
                        <i class="fas fa-chevron-down" style="font-size: 0.8rem; color: #adb5bd;"></i>
                    </div>
                    <span class="curr-name-label" id="name-to">Euro</span>
                </div>

            </div>

            <div class="curr-result-box">
                <div class="curr-conversion-rate" id="curr-rate-text">...</div>
                <div class="curr-final-val" id="curr-result">...</div>
                <div class="curr-fee-toggle" onclick="document.getElementById('fee-panel').classList.toggle('show')">
                    Add Bank Fee? <i class="fas fa-chevron-down"></i>
                </div>
                
                <div id="fee-panel" class="fee-options">
                    <label>Bank Fee (%)</label>
                    <input type="number" id="curr-fee" value="0" placeholder="0" oninput="window.AppCalculators.category_2.currency_calc.calculate()">
                </div>
            </div>

        </div>

        <div class="curr-secondary-grid">
            <div class="curr-chart-card">
                <h4>30 Day Trend</h4>
                <div class="chart-placeholder">
                    <svg id="curr-trend-chart" viewBox="0 0 300 100" preserveAspectRatio="none"></svg>
                </div>
                <div class="chart-labels">
                    <span>30 days ago</span>
                    <span>Today</span>
                </div>
            </div>

            <div class="curr-multi-card">
                <h4>Popular Conversions</h4>
                <div id="multi-curr-list" class="multi-list"></div>
            </div>
        </div>

        <div id="curr-modal" class="curr-modal-overlay" style="display:none;" onclick="if(event.target === this) this.style.display='none'">
            <div class="curr-modal-content">
                <div class="curr-modal-header">
                    <h3>Select Currency</h3>
                    <button class="close-modal" onclick="document.getElementById('curr-modal').style.display='none'">&times;</button>
                </div>
                <div class="curr-search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="curr-search-input" placeholder="Search Country (e.g., India) or Currency..." oninput="window.AppCalculators.category_2.currency_calc.filterCurrencies()">
                </div>
                <div class="curr-list-container" id="curr-list">
                    </div>
            </div>
        </div>

      </div>
    `;
  },

  async fetchRates() {
    try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        this.state.rates = data.rates;
        this.state.lastUpdated = new Date(data.date).toLocaleDateString();
        document.getElementById('curr-last-update').innerText = "Rates: Live";
    } catch (e) {
        console.warn("Currency API failed, using fallback.");
        this.state.rates = this.fallbackRates;
        document.getElementById('curr-last-update').innerText = "Rates: Offline";
    }
  },

  refreshRates: function() {
    const btn = document.querySelector('.refresh-btn');
    btn.classList.add('spin');
    document.getElementById('curr-last-update').innerText = "Fetching...";
    
    this.fetchRates().then(() => {
        setTimeout(() => {
            btn.classList.remove('spin');
            this.calculate();
        }, 800);
    });
  },

  // Updates flags, names, and codes based on current state
  updateUI: function() {
    const from = this.state.from;
    const to = this.state.to;
    
    // Update Codes
    document.getElementById('code-from').innerText = from;
    document.getElementById('code-to').innerText = to;
    
    // Update Names
    const fromObj = this.currencyData.find(c => c.code === from) || { name: from };
    const toObj = this.currencyData.find(c => c.code === to) || { name: to };
    document.getElementById('name-from').innerText = fromObj.name;
    document.getElementById('name-to').innerText = toObj.name;

    // Update Flags
    const getCountryCode = (code) => {
       // Simple map for codes that don't match country codes exactly
       const map = { 'USD':'us', 'EUR':'eu', 'GBP':'gb', 'INR':'in', 'JPY':'jp', 'AUD':'au', 'CAD':'ca', 'CHF':'ch', 'CNY':'cn', 'SGD':'sg', 'AED':'ae', 'RUB':'ru', 'BRL':'br' };
       return map[code] || code.slice(0, 2).toLowerCase(); 
    };

    document.getElementById('flag-from').src = `https://flagcdn.com/w40/${getCountryCode(from)}.png`;
    document.getElementById('flag-to').src = `https://flagcdn.com/w40/${getCountryCode(to)}.png`;
  },

  calculate: function() {
    const amount = parseFloat(document.getElementById('curr-amount').value) || 0;
    const from = this.state.from;
    const to = this.state.to;
    const feePct = parseFloat(document.getElementById('curr-fee').value) || 0;

    const fromRate = this.state.rates[from] || 1;
    const toRate = this.state.rates[to] || 1;

    const feeMultiplier = 1 - (feePct / 100);
    const result = (amount / fromRate) * toRate * feeMultiplier;
    const oneUnit = (1 / fromRate) * toRate;

    document.getElementById('curr-result').innerText = result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + to;
    document.getElementById('curr-rate-text').innerText = `1 ${from} = ${oneUnit.toFixed(4)} ${to}`;

    this.updateMultiList(amount, fromRate);
    this.drawChart();
  },

  updateMultiList: function(amount, fromRate) {
    const list = document.getElementById('multi-curr-list');
    const popular = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];
    
    let html = '';
    popular.forEach(curr => {
        if(curr !== this.state.from) {
            const rate = this.state.rates[curr] || 1;
            const val = (amount / fromRate) * rate;
            html += `
                <div class="multi-item">
                    <span class="m-code">${curr}</span>
                    <span class="m-val">${val.toFixed(2)}</span>
                </div>
            `;
        }
    });
    list.innerHTML = html;
  },

  swapCurrencies: function() {
    const temp = this.state.from;
    this.state.from = this.state.to;
    this.state.to = temp;
    this.updateUI();
    this.calculate();
  },

  // --- SEARCH MODAL LOGIC ---

  openModal: function(type) {
    this.state.targetSelector = type;
    document.getElementById('curr-modal').style.display = 'flex';
    document.getElementById('curr-search-input').value = '';
    document.getElementById('curr-search-input').focus();
    this.renderCurrencyList(this.currencyData); // Show all
  },

  renderCurrencyList: function(list) {
    const container = document.getElementById('curr-list');
    
    if(list.length === 0) {
        container.innerHTML = `<div class="no-results" style="padding:15px; text-align:center; color:#999;">No results found</div>`;
        return;
    }

    container.innerHTML = list.map(item => `
        <div class="curr-list-item" onclick="window.AppCalculators.category_2.currency_calc.selectCurrency('${item.code}')">
            <img src="https://flagcdn.com/w40/${item.code.slice(0,2).toLowerCase()}.png" class="list-flag" onerror="this.style.display='none'">
            <div class="list-info">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="list-code">${item.code}</span>
                    <span class="list-name">${item.name}</span>
                </div>
                <span class="list-country">${item.country}</span>
            </div>
        </div>
    `).join('');
  },

  filterCurrencies: function() {
    const term = document.getElementById('curr-search-input').value.toLowerCase();
    
    // Filter by Code, Name, or Country
    const filtered = this.currencyData.filter(item => {
        return item.code.toLowerCase().includes(term) || 
               item.name.toLowerCase().includes(term) || 
               item.country.toLowerCase().includes(term);
    });

    this.renderCurrencyList(filtered);
  },

  selectCurrency: function(code) {
    if (this.state.targetSelector === 'from') {
        this.state.from = code;
    } else {
        this.state.to = code;
    }
    
    document.getElementById('curr-modal').style.display = 'none';
    this.updateUI();
    this.calculate();
  },

  drawChart: function() {
    // Simple simulated SVG chart
    const svg = document.getElementById('curr-trend-chart');
    const w = 300, h = 100;
    let points = [];
    for(let i=0; i<10; i++) points.push(Math.random() * 60 + 20);
    
    const getX = (i) => (i / 9) * w;
    const getY = (v) => h - v;

    let d = `M 0 ${getY(points[0])} `;
    for (let i = 1; i < points.length; i++) d += `L ${getX(i)} ${getY(points[i])} `;
    
    let fillD = d + `L ${w} ${h} L 0 ${h} Z`;

    svg.innerHTML = `
        <defs>
            <linearGradient id="currGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:var(--primary);stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:var(--primary);stop-opacity:0" />
            </linearGradient>
        </defs>
        <path d="${fillD}" fill="url(#currGrad)" />
        <path d="${d}" fill="none" stroke="var(--primary)" stroke-width="2" />
    `;
  }
};