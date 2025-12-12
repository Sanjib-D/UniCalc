if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_1) window.AppCalculators.category_1 = {};

window.AppCalculators.category_1.age_calc = {
    getHtml: function () {
        return `
            <div class="age-calc-container">
                <div class="age-inputs">
                    <div class="form-group">
                        <label><i class="fas fa-birthday-cake"></i> Date of Birth</label>
                        <input type="date" id="dob-input" title="Select your birth date">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-calendar-check"></i> Calculate Age At</label>
                        <input type="date" id="target-date-input" title="Defaults to today">
                    </div>
                    <button class="calc-btn" id="age-action-btn">Calculate</button>
                </div>

                <div id="age-error-msg" style="
                    background: #ffe3e6; 
                    color: #d63031; 
                    padding: 15px; 
                    border-radius: 8px; 
                    display: none; 
                    margin-bottom: 20px; 
                    border-left: 5px solid #d63031;
                    font-weight: 500;">
                </div>

                <div class="age-results" id="age-results-area">
                    <div class="main-age-card">
                        <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8;">You are exactly</div>
                        <h3 id="exact-age-display">--</h3>
                        <p id="total-days-display" style="font-size: 1.2rem; margin-top: 10px;">Total Days: --</p>
                    </div>

                    <div class="age-grid">
                        <div class="stat-card">
                            <i class="fas fa-calendar-alt" style="color: #ccc; font-size: 1.5rem; margin-bottom: 10px;"></i>
                            <h4>Months</h4>
                            <div class="stat-value" id="res-months">0</div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-calendar-week" style="color: #ccc; font-size: 1.5rem; margin-bottom: 10px;"></i>
                            <h4>Weeks</h4>
                            <div class="stat-value" id="res-weeks">0</div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-clock" style="color: #ccc; font-size: 1.5rem; margin-bottom: 10px;"></i>
                            <h4>Hours</h4>
                            <div class="stat-value" id="res-hours">0</div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-stopwatch" style="color: #ccc; font-size: 1.5rem; margin-bottom: 10px;"></i>
                            <h4>Minutes</h4>
                            <div class="stat-value" id="res-mins">0</div>
                        </div>

                        <div class="stat-card highlight">
                            <i class="fas fa-gift" style="color: #28a745; font-size: 1.5rem; margin-bottom: 10px;"></i>
                            <h4>Next Birthday</h4>
                            <div class="stat-value" id="next-bday-count">--</div>
                            <small id="next-bday-day" style="color: #666; display:block; margin-top:5px;">--</small>
                        </div>
                        
                        <div class="stat-card fun-fact">
                            <i class="fas fa-star" style="color: #ffc107; font-size: 1.5rem; margin-bottom: 10px;"></i>
                            <h4>Zodiac</h4>
                            <div class="stat-value" id="zodiac-sign">--</div>
                        </div>
                        <div class="stat-card fun-fact">
                            <i class="fas fa-gem" style="color: #ffc107; font-size: 1.5rem; margin-bottom: 10px;"></i>
                            <h4>Birthstone</h4>
                            <div class="stat-value" id="birth-stone">--</div>
                        </div>
                        <div class="stat-card fun-fact">
                            <i class="fas fa-sun" style="color: #ffc107; font-size: 1.5rem; margin-bottom: 10px;"></i>
                            <h4>Day Born</h4>
                            <div class="stat-value" id="day-born">--</div>
                        </div>
                    </div>

                    <div style="background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                        <h4 style="border-bottom: 2px solid #f1f1f1; padding-bottom: 15px; margin-bottom: 15px; color: var(--dark);">
                            <i class="fas fa-info-circle" style="color: var(--primary);"></i> Life Insights
                        </h4>
                        <ul style="list-style: none; padding: 0;" id="milestone-list">
                            <li>Loading...</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    init: function () {
        // Set Default Date to Today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('target-date-input').value = today;

        document.getElementById('age-action-btn').onclick = this.calculateAge;
    },

    calculateAge: function () {
        const dobVal = document.getElementById('dob-input').value;
        const targetVal = document.getElementById('target-date-input').value;
        const errDiv = document.getElementById('age-error-msg');
        const resultArea = document.getElementById('age-results-area');

        // Validation
        if (!dobVal) {
            errDiv.style.display = 'block';
            errDiv.innerHTML = "<i class='fas fa-exclamation-circle'></i> Please select your Date of Birth.";
            resultArea.style.display = 'none';
            return;
        }

        const dob = new Date(dobVal);
        const target = targetVal ? new Date(targetVal) : new Date();
        
        // Reset Time to Midnight
        dob.setHours(0,0,0,0);
        target.setHours(0,0,0,0);

        if (dob > target) {
            errDiv.style.display = 'block';
            errDiv.innerHTML = "<i class='fas fa-exclamation-triangle'></i> Date of Birth cannot be in the future relative to the target date.";
            resultArea.style.display = 'none';
            return;
        }

        errDiv.style.display = 'none';
        resultArea.style.display = 'block';

        // --- 1. Exact Age Calculation ---
        let years = target.getFullYear() - dob.getFullYear();
        let months = target.getMonth() - dob.getMonth();
        let days = target.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        document.getElementById('exact-age-display').innerText = 
            `${years} Years, ${months} Months, ${days} Days`;

        // --- 2. Total Time Units ---
        const diffTime = Math.abs(target - dob);
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalHours = totalDays * 24; 
        const totalMins = totalHours * 60;
        const totalMonths = (years * 12) + months;

        document.getElementById('total-days-display').innerText = `Total Days Alive: ${totalDays.toLocaleString()}`;
        document.getElementById('res-months').innerText = totalMonths.toLocaleString();
        document.getElementById('res-weeks').innerText = totalWeeks.toLocaleString();
        document.getElementById('res-hours').innerText = totalHours.toLocaleString();
        document.getElementById('res-mins').innerText = totalMins.toLocaleString();

        // --- 3. Next Birthday Logic ---
        const currentYear = target.getFullYear();
        let nextBday = new Date(dob);
        nextBday.setFullYear(currentYear);

        if (nextBday < target) {
            nextBday.setFullYear(currentYear + 1);
        }

        const diffBday = nextBday - target;
        const daysToBday = Math.ceil(diffBday / (1000 * 60 * 60 * 24));
        
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const bdayDayName = daysOfWeek[nextBday.getDay()];

        document.getElementById('next-bday-count').innerText = daysToBday === 0 ? "Today!" : `${daysToBday} Days`;
        document.getElementById('next-bday-day').innerText = daysToBday === 0 ? "Happy Birthday!" : `turns ${years + 1} on a ${bdayDayName}`;

        // --- 4. Extras ---
        const dayBornName = daysOfWeek[dob.getDay()];
        document.getElementById('day-born').innerText = dayBornName;

        const zodiac = getZodiacSign(dob.getDate(), dob.getMonth() + 1);
        document.getElementById('zodiac-sign').innerText = zodiac;

        const stones = ["Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Pearl", "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise"];
        document.getElementById('birth-stone').innerText = stones[dob.getMonth()];

        // --- 5. Milestones ---
        const milestoneList = document.getElementById('milestone-list');
        milestoneList.innerHTML = "";
        
        const next10k = Math.ceil(totalDays / 10000) * 10000;
        const daysLeft10k = next10k - totalDays;
        const breaths = totalMins * 16; 
        
        const items = [
            `You have taken approx <strong>${breaths.toLocaleString()}</strong> breaths.`,
            `Your next 10,000-day milestone is in <strong>${daysLeft10k}</strong> days (Total ${next10k}).`,
            `You have slept for about <strong>${Math.floor(years / 3)}</strong> years (assuming 8h sleep).`,
            `You have lived through <strong>${Math.floor(years / 4)}</strong> leap years.`
        ];

        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check" style="color:green; margin-right:10px; background:#e8f5e9; padding:5px; border-radius:50%; font-size:0.7rem;"></i> ${item}`;
            li.style.marginBottom = "12px";
            li.style.color = "#555";
            li.style.fontSize = "0.95rem";
            milestoneList.appendChild(li);
        });
    }
};

function getZodiacSign(day, month) {
    if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return "Capricorn";
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces";
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
    return "Unknown";
}