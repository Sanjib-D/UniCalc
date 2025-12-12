if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_1) window.AppCalculators.category_1 = {};

window.AppCalculators.category_1.time_calc = {
    // State to hold dynamic rows
    rows: [
        { op: 'add', h: 0, m: 0, s: 0, id: 1 }
    ],

    getHtml: function () {
        return `
            <div class="time-calc-container">
                
                <div class="mode-toggle-container">
                    <button class="mode-btn active-mode" id="mode-duration" onclick="window.AppCalculators.category_1.time_calc.switchMode('duration')">
                        <i class="fas fa-stopwatch"></i> Add / Subtract Duration
                    </button>
                    <button class="mode-btn" id="mode-span" onclick="window.AppCalculators.category_1.time_calc.switchMode('span')">
                        <i class="fas fa-arrows-alt-h"></i> Time Between
                    </button>
                </div>

                <div id="view-duration">
                    <div id="time-rows-container"></div>
                    
                    <button class="add-time-btn" id="btn-add-row">
                        <i class="fas fa-plus"></i> Add Another Time Line
                    </button>

                    <div style="text-align:right;">
                         <button class="calc-btn" id="btn-calc-duration" style="width: auto; padding: 10px 30px;">Calculate Result</button>
                         <button style="background:none; border:none; color:#666; cursor:pointer; text-decoration:underline; margin-left:10px;" id="btn-reset-dur">Reset</button>
                    </div>
                </div>

                <div id="view-span" style="display: none;">
                    <div class="span-card">
                        <div class="form-group">
                            <label>Start Time</label>
                            <input type="time" id="span-start" step="1" class="time-input" style="text-align:left;">
                        </div>
                        <div class="form-group">
                            <label>End Time</label>
                            <input type="time" id="span-end" step="1" class="time-input" style="text-align:left;">
                        </div>
                        <button class="calc-btn" id="btn-calc-span" style="flex:1;">Calculate Difference</button>
                    </div>
                    <div style="text-align:center; font-size:0.9rem; color:#666;">
                        <input type="checkbox" id="next-day-check"> <label for="next-day-check">End time is next day</label>
                    </div>
                </div>

                <div class="time-result-box" id="time-result-area" style="display:none;">
                    <div class="main-time-result">
                        <small>RESULT</small>
                        <h2 id="main-res-display">0h 0m 0s</h2>
                        <span id="res-msg" style="color: #adb5bd;"></span>
                    </div>
                    
                    <div class="time-stats-grid">
                        <div class="time-stat">
                            <h4>Total Hours</h4>
                            <div class="val" id="res-total-hrs">0</div>
                        </div>
                        <div class="time-stat">
                            <h4>Total Minutes</h4>
                            <div class="val" id="res-total-mins">0</div>
                        </div>
                        <div class="time-stat">
                            <h4>Total Seconds</h4>
                            <div class="val" id="res-total-secs">0</div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    },

    init: function () {
        // Render Initial Rows for Duration Mode
        this.renderRows();

        // Event Listeners for Duration Mode
        document.getElementById('btn-add-row').onclick = () => {
            this.rows.push({ op: 'add', h: 0, m: 0, s: 0, id: Date.now() });
            this.renderRows();
        };

        document.getElementById('btn-calc-duration').onclick = () => this.calculateDuration();
        
        document.getElementById('btn-reset-dur').onclick = () => {
            this.rows = [{ op: 'add', h: 0, m: 0, s: 0, id: Date.now() }];
            this.renderRows();
            document.getElementById('time-result-area').style.display = 'none';
        };

        // Event Listeners for Span Mode
        document.getElementById('btn-calc-span').onclick = () => this.calculateSpan();
    },

    // --- Switch UI Modes ---
    switchMode: function (mode) {
        document.getElementById('view-duration').style.display = mode === 'duration' ? 'block' : 'none';
        document.getElementById('view-span').style.display = mode === 'span' ? 'block' : 'none';
        
        document.getElementById('mode-duration').classList.toggle('active-mode', mode === 'duration');
        document.getElementById('mode-span').classList.toggle('active-mode', mode === 'span');
        
        document.getElementById('time-result-area').style.display = 'none';
    },

    // --- Render Dynamic Rows ---
    renderRows: function () {
        const container = document.getElementById('time-rows-container');
        container.innerHTML = '';

        this.rows.forEach((row, index) => {
            const div = document.createElement('div');
            div.className = 'time-row';
            div.innerHTML = `
                <select class="op-select" onchange="window.AppCalculators.category_1.time_calc.updateRow(${index}, 'op', this.value)">
                    <option value="add" ${row.op === 'add' ? 'selected' : ''}>+</option>
                    <option value="sub" ${row.op === 'sub' ? 'selected' : ''}>-</option>
                </select>
                
                <div class="time-input-group">
                    <input type="number" placeholder="0" class="time-input" value="${row.h || ''}" 
                        oninput="window.AppCalculators.category_1.time_calc.updateRow(${index}, 'h', this.value)">
                    <span class="unit-label">h</span>
                </div>
                
                <div class="time-input-group">
                    <input type="number" placeholder="0" class="time-input" value="${row.m || ''}"
                        oninput="window.AppCalculators.category_1.time_calc.updateRow(${index}, 'm', this.value)">
                    <span class="unit-label">m</span>
                </div>
                
                <div class="time-input-group">
                    <input type="number" placeholder="0" class="time-input" value="${row.s || ''}"
                        oninput="window.AppCalculators.category_1.time_calc.updateRow(${index}, 's', this.value)">
                    <span class="unit-label">s</span>
                </div>

                ${this.rows.length > 1 ? `<button class="remove-row-btn" onclick="window.AppCalculators.category_1.time_calc.removeRow(${index})"><i class="fas fa-times"></i></button>` : ''}
            `;
            container.appendChild(div);
        });
    },

    updateRow: function (index, field, value) {
        if (field === 'op') this.rows[index].op = value;
        else this.rows[index][field] = parseInt(value) || 0;
    },

    removeRow: function (index) {
        this.rows.splice(index, 1);
        this.renderRows();
    },

    // --- CALCULATION LOGIC: DURATION ---
    calculateDuration: function () {
        let totalSeconds = 0;

        this.rows.forEach(row => {
            let rowSecs = (row.h * 3600) + (row.m * 60) + row.s;
            if (row.op === 'add') totalSeconds += rowSecs;
            else totalSeconds -= rowSecs;
        });

        this.displayResults(totalSeconds);
    },

    // --- CALCULATION LOGIC: SPAN ---
    calculateSpan: function () {
        const startStr = document.getElementById('span-start').value; // "HH:MM" or "HH:MM:SS"
        const endStr = document.getElementById('span-end').value;
        const nextDay = document.getElementById('next-day-check').checked;

        if (!startStr || !endStr) {
            alert("Please enter both Start and End times.");
            return;
        }

        // Helper to parse time string to seconds
        const toSeconds = (str) => {
            const parts = str.split(':').map(Number);
            let s = 0;
            if (parts.length >= 1) s += parts[0] * 3600; // Hours
            if (parts.length >= 2) s += parts[1] * 60;   // Mins
            if (parts.length >= 3) s += parts[2];        // Secs
            return s;
        };

        let startSec = toSeconds(startStr);
        let endSec = toSeconds(endStr);

        let diff = endSec - startSec;

        // Handle Rollover (Midnight)
        if (nextDay || diff < 0) {
            diff += (24 * 3600); // Add 24 hours
        }

        this.displayResults(diff);
    },

    // --- DISPLAY HELPER ---
    displayResults: function (totalSeconds) {
        const isNegative = totalSeconds < 0;
        let absSeconds = Math.abs(totalSeconds);

        const days = Math.floor(absSeconds / 86400);
        let rem = absSeconds % 86400;
        const hours = Math.floor(rem / 3600);
        rem %= 3600;
        const mins = Math.floor(rem / 60);
        const secs = rem % 60;

        // Formatted String
        let resultStr = "";
        if (isNegative) resultStr += "- ";
        if (days > 0) resultStr += `${days}d `;
        if (hours > 0 || days > 0) resultStr += `${hours}h `;
        resultStr += `${mins}m ${secs}s`;

        document.getElementById('time-result-area').style.display = 'block';
        document.getElementById('main-res-display').innerText = resultStr;
        
        // Stats
        document.getElementById('res-total-hrs').innerText = (totalSeconds / 3600).toFixed(2);
        document.getElementById('res-total-mins').innerText = (totalSeconds / 60).toFixed(1);
        document.getElementById('res-total-secs').innerText = totalSeconds.toLocaleString();

        document.getElementById('res-msg').innerText = isNegative ? "Result is negative (subtraction exceeded total)" : "";
    }
};