if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_1) window.AppCalculators.category_1 = {};

window.AppCalculators.category_1.date_diff_calc = {
    getHtml: function () {
        return `
            <div class="date-diff-container">
                
                <div class="diff-inputs-wrapper">
                    <div class="date-card">
                        <label><i class="far fa-calendar-alt"></i> Start Date</label>
                        <input type="date" id="diff-start">
                    </div>

                    <div class="swap-btn-container">
                        <button class="swap-btn" id="btn-swap-dates" title="Swap Dates">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>

                    <div class="date-card end-date">
                        <label><i class="far fa-calendar-check"></i> End Date</label>
                        <input type="date" id="diff-end">
                    </div>
                </div>

                <div class="action-bar">
                    <button class="calculate-btn-large" id="diff-action-btn">
                        Calculate Difference
                    </button>
                    <div id="diff-error" style="color: red; margin-top: 10px; display: none;"></div>
                </div>

                <div class="diff-results" id="diff-results-area">
                    
                    <div class="summary-banner">
                        <div style="text-transform: uppercase; font-size: 0.8rem; letter-spacing: 2px; margin-bottom: 5px;">Time Duration</div>
                        <h2 id="diff-main-text">--</h2>
                        <p id="diff-sub-text">Total Days: --</p>
                    </div>

                    <h4 style="color: #555; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                        <i class="fas fa-briefcase"></i> Work & Time Breakdown
                    </h4>
                    
                    <div class="diff-grid">
                        <div class="diff-stat-card work-days">
                            <h5>Working Days (Mon-Fri)</h5>
                            <div class="val" id="res-work-days">0</div>
                            <small style="color:#aaa; font-size:0.7rem;">Excludes Sat/Sun</small>
                        </div>
                        <div class="diff-stat-card weekends">
                            <h5>Weekend Days</h5>
                            <div class="val" id="res-weekends">0</div>
                            <small style="color:#aaa; font-size:0.7rem;">Sat + Sun</small>
                        </div>
                        <div class="diff-stat-card">
                            <h5>Total Weeks</h5>
                            <div class="val" id="res-diff-weeks">0</div>
                        </div>
                    </div>

                    <h4 style="color: #555; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 20px;">
                        <i class="fas fa-clock"></i> Total Units
                    </h4>
                    
                    <div class="diff-grid">
                        <div class="diff-stat-card total-hours">
                            <h5>Total Hours</h5>
                            <div class="val" id="res-diff-hours">0</div>
                        </div>
                        <div class="diff-stat-card">
                            <h5>Total Minutes</h5>
                            <div class="val" id="res-diff-mins">0</div>
                        </div>
                        <div class="diff-stat-card">
                            <h5>Total Seconds</h5>
                            <div class="val" id="res-diff-secs">0</div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    },

    init: function () {
        // Set Defaults: Start = Today, End = Today + 7 Days
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        document.getElementById('diff-start').value = today.toISOString().split('T')[0];
        document.getElementById('diff-end').value = nextWeek.toISOString().split('T')[0];

        // Event Listeners
        document.getElementById('diff-action-btn').onclick = this.calculateDiff;
        document.getElementById('btn-swap-dates').onclick = this.swapDates;
    },

    swapDates: function () {
        const startEl = document.getElementById('diff-start');
        const endEl = document.getElementById('diff-end');
        const temp = startEl.value;
        startEl.value = endEl.value;
        endEl.value = temp;
        
        // Optional: Trigger calc automatically if results are already open
        const resultArea = document.getElementById('diff-results-area');
        if (resultArea.style.display === 'block') {
            window.AppCalculators.category_1.date_diff_calc.calculateDiff();
        }
    },

    calculateDiff: function () {
        const startVal = document.getElementById('diff-start').value;
        const endVal = document.getElementById('diff-end').value;
        const errDiv = document.getElementById('diff-error');
        const resArea = document.getElementById('diff-results-area');

        if (!startVal || !endVal) {
            errDiv.style.display = 'block';
            errDiv.innerText = "Please select both dates.";
            resArea.style.display = 'none';
            return;
        }

        errDiv.style.display = 'none';
        resArea.style.display = 'block';

        let d1 = new Date(startVal);
        let d2 = new Date(endVal);

        // Ensure d1 is always the earlier date for math, but we track if we swapped
        let isNegative = false;
        if (d1 > d2) {
            const temp = d1;
            d1 = d2;
            d2 = temp;
            isNegative = true; 
        }

        // --- 1. Y/M/D Calculation ---
        let years = d2.getFullYear() - d1.getFullYear();
        let months = d2.getMonth() - d1.getMonth();
        let days = d2.getDate() - d1.getDate();

        if (days < 0) {
            months--;
            // Days in previous month of d2
            const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // Construct Main String
        let mainStr = "";
        if (years > 0) mainStr += `${years} Year${years > 1 ? 's' : ''}, `;
        if (months > 0) mainStr += `${months} Month${months > 1 ? 's' : ''}, `;
        mainStr += `${days} Day${days !== 1 ? 's' : ''}`;
        
        // Handle "0 days"
        if (years === 0 && months === 0 && days === 0) mainStr = "Same Day";
        
        // Add "Ago" or "From now" context if desired, or just duration
        if (isNegative) mainStr += " (Swapped)";

        document.getElementById('diff-main-text').innerText = mainStr;

        // --- 2. Total Units ---
        const diffMs = Math.abs(d2 - d1);
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalWeeks = (totalDays / 7).toFixed(1);
        const totalHours = totalDays * 24;
        const totalMins = totalHours * 60;
        const totalSecs = totalMins * 60;

        document.getElementById('diff-sub-text').innerText = `Total Duration: ${totalDays.toLocaleString()} Days`;
        document.getElementById('res-diff-weeks').innerText = totalWeeks;
        document.getElementById('res-diff-hours').innerText = totalHours.toLocaleString();
        document.getElementById('res-diff-mins').innerText = totalMins.toLocaleString();
        document.getElementById('res-diff-secs').innerText = totalSecs.toLocaleString();

        // --- 3. Working Days Calculation (Loop Method for accuracy) ---
        let workingDays = 0;
        let weekends = 0;
        
        // Clone d1 to not mess up references
        let tempDate = new Date(d1);
        
        // Loop from start to end
        while (tempDate < d2) {
            const day = tempDate.getDay();
            // 0 = Sun, 6 = Sat
            if (day === 0 || day === 6) {
                weekends++;
            } else {
                workingDays++;
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }

        document.getElementById('res-work-days').innerText = workingDays.toLocaleString();
        document.getElementById('res-weekends').innerText = weekends.toLocaleString();
    }
};