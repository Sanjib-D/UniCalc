if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_1) window.AppCalculators.category_1 = {};

window.AppCalculators.category_1.gpa_calc = {
    // --- Configuration ---
    rows: [],
    // Grading Scales Data
    scaleMap: {
        '4.0': [
            { l: 'A (4.0)', v: 4.0 }, { l: 'A- (3.7)', v: 3.7 }, 
            { l: 'B+ (3.3)', v: 3.3 }, { l: 'B (3.0)', v: 3.0 }, { l: 'B- (2.7)', v: 2.7 },
            { l: 'C+ (2.3)', v: 2.3 }, { l: 'C (2.0)', v: 2.0 }, { l: 'C- (1.7)', v: 1.7 },
            { l: 'D+ (1.3)', v: 1.3 }, { l: 'D (1.0)', v: 1.0 }, { l: 'F (0.0)', v: 0.0 }
        ],
        '5.0': [
            { l: 'A (5.0)', v: 5.0 }, { l: 'B (4.0)', v: 4.0 }, 
            { l: 'C (3.0)', v: 3.0 }, { l: 'D (2.0)', v: 2.0 }, 
            { l: 'E (1.0)', v: 1.0 }, { l: 'F (0.0)', v: 0.0 }
        ],
        '10.0': [
            { l: 'O (10)', v: 10.0 }, { l: 'A+ (9)', v: 9.0 }, { l: 'A (8)', v: 8.0 },
            { l: 'B+ (7)', v: 7.0 }, { l: 'B (6)', v: 6.0 }, { l: 'C (5)', v: 5.0 },
            { l: 'P (4)', v: 4.0 }, { l: 'F (0)', v: 0.0 }
        ]
    },
    currentScale: '4.0',

    getHtml: function () {
        return `
            <div class="gpa-calc-container">
                
                <div class="gpa-settings-bar">
                    <div class="gpa-settings-group">
                        <label><i class="fas fa-balance-scale"></i> Grading Scale</label>
                        <select id="gpa-scale-select" class="gpa-select">
                            <option value="4.0">4.0 Scale (Standard US)</option>
                            <option value="5.0">5.0 Scale</option>
                            <option value="10.0">10.0 Scale (CGPA/India)</option>
                        </select>
                    </div>
                    <button class="gpa-reset-btn" onclick="window.AppCalculators.category_1.gpa_calc.resetAll()">
                        <i class="fas fa-redo-alt"></i> Reset All
                    </button>
                </div>

                <div class="course-table-wrapper">
                    <table class="gpa-table">
                        <thead>
                            <tr>
                                <th style="width: 40%;">Subject Name</th>
                                <th style="width: 30%;">Grade Achieved</th>
                                <th style="width: 20%;">Credits</th>
                                <th style="width: 10%;"></th>
                            </tr>
                        </thead>
                        <tbody id="gpa-rows-body">
                            </tbody>
                    </table>
                    <button class="gpa-add-btn" onclick="window.AppCalculators.category_1.gpa_calc.addRow()">
                        <i class="fas fa-plus"></i> Add Another Course
                    </button>
                </div>

                <div class="gpa-dashboard" id="gpa-results-area" style="display:none;">
                    
                    <div class="gpa-card">
                        <h4 style="margin:0; color:#888; text-transform:uppercase; font-size:0.8rem; letter-spacing:1px;">Semester GPA</h4>
                        <div class="gpa-score-big" id="res-gpa">0.00</div>
                        
                        <div class="gpa-stat-row">
                            <span>Total Credits</span>
                            <strong id="res-credits">0</strong>
                        </div>
                        <div class="gpa-stat-row">
                            <span>Quality Points</span>
                            <strong id="res-points">0</strong>
                        </div>
                        
                        <div class="gpa-bar-bg">
                            <div class="gpa-bar-fill" id="res-bar"></div>
                        </div>
                    </div>

                    <div class="gpa-card target-card">
                        <h4 style="margin:0 0 20px 0; color:#fd7e14; font-weight:bold; display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-rocket"></i> CGPA Estimator
                        </h4>
                        
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.85rem; font-weight:bold; color:#555; display:block; margin-bottom:5px;">Current CGPA (Before this sem)</label>
                            <input type="number" id="prev-cgpa" class="gpa-input" placeholder="e.g. 3.5" oninput="window.AppCalculators.category_1.gpa_calc.calculateTarget()">
                        </div>
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.85rem; font-weight:bold; color:#555; display:block; margin-bottom:5px;">Credits Earned So Far</label>
                            <input type="number" id="prev-credits" class="gpa-input" placeholder="e.g. 60" oninput="window.AppCalculators.category_1.gpa_calc.calculateTarget()">
                        </div>
                        
                        <div style="margin-top:20px; padding-top:15px; border-top:1px dashed #ddd;">
                            <div class="gpa-stat-row" style="font-size:1.1rem; color:#333;">
                                <span>New Cumulative GPA:</span>
                                <strong id="res-new-cgpa" style="color:#007bff;">--</strong>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    },

    init: function () {
        this.rows = [];
        this.currentScale = '4.0'; // Reset to default on init
        
        // Add 4 initial empty rows
        for(let i=0; i<4; i++) this.addRow(false); 
        this.renderRows();

        // Attach listener for Scale Change
        const scaleSelect = document.getElementById('gpa-scale-select');
        if(scaleSelect) {
            scaleSelect.value = this.currentScale;
            scaleSelect.onchange = (e) => this.handleScaleChange(e.target.value);
        }
    },

    // --- State Management ---
    handleScaleChange: function(newScale) {
        // We warn user because grades might not map 1:1 perfectly
        if(confirm("Switching grading scales will reset the selected grades to blank. Continue?")) {
            this.currentScale = newScale;
            // Clear grades in data model
            this.rows.forEach(r => r.grade = "");
            // Re-render the table with new options
            this.renderRows();
            // Clear results
            this.calculate();
        } else {
            // Revert selection if canceled
            document.getElementById('gpa-scale-select').value = this.currentScale;
        }
    },

    resetAll: function() {
        if(confirm("Are you sure you want to clear all fields?")) {
            this.rows = [];
            for(let i=0; i<4; i++) this.addRow(false);
            this.renderRows();
            document.getElementById('gpa-results-area').style.display = 'none';
            document.getElementById('prev-cgpa').value = '';
            document.getElementById('prev-credits').value = '';
        }
    },

    // --- Row Logic ---
    addRow: function (shouldRender = true) {
        this.rows.push({
            id: Date.now() + Math.random(),
            name: "",
            grade: "", 
            credits: "" 
        });
        if(shouldRender) this.renderRows();
    },

    removeRow: function (id) {
        this.rows = this.rows.filter(r => r.id !== id);
        this.renderRows();
        this.calculate();
    },

    updateRow: function (id, field, val) {
        const row = this.rows.find(r => r.id === id);
        if (row) {
            row[field] = val;
            this.calculate();
        }
    },

    // --- Rendering ---
    renderRows: function () {
        const tbody = document.getElementById('gpa-rows-body');
        tbody.innerHTML = "";

        // Get options for current scale
        const optionsHTML = this.scaleMap[this.currentScale].map(opt => 
            `<option value="${opt.v}">${opt.l}</option>`
        ).join('');

        this.rows.forEach((row, index) => {
            const tr = document.createElement('tr');
            
            // Note: We use placeholders for mobile-friendly inputs
            tr.innerHTML = `
                <td>
                    <input type="text" class="gpa-input" placeholder="Course ${index + 1}" 
                        value="${row.name}" 
                        oninput="window.AppCalculators.category_1.gpa_calc.updateRow(${row.id}, 'name', this.value)">
                </td>
                <td>
                    <select class="gpa-input" 
                        onchange="window.AppCalculators.category_1.gpa_calc.updateRow(${row.id}, 'grade', this.value)">
                        <option value="" disabled ${row.grade === "" ? "selected" : ""}>-- Select --</option>
                        ${optionsHTML}
                    </select>
                </td>
                <td>
                    <input type="number" class="gpa-input" placeholder="e.g. 3" 
                        value="${row.credits}" 
                        oninput="window.AppCalculators.category_1.gpa_calc.updateRow(${row.id}, 'credits', this.value)">
                </td>
                <td>
                    ${this.rows.length > 1 ? `
                    <button class="gpa-btn-icon" onclick="window.AppCalculators.category_1.gpa_calc.removeRow(${row.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>` : ''}
                </td>
            `;
            
            // Sync Select Value
            if(row.grade !== "") {
                const sel = tr.querySelector('select');
                if(sel) sel.value = row.grade;
            }

            tbody.appendChild(tr);
        });
    },

    // --- Calculation ---
    calculate: function () {
        let totalPoints = 0;
        let totalCredits = 0;
        let hasData = false;

        this.rows.forEach(row => {
            const g = parseFloat(row.grade);
            const c = parseFloat(row.credits);

            if (!isNaN(g) && !isNaN(c)) {
                totalPoints += (g * c);
                totalCredits += c;
                hasData = true;
            }
        });

        const resArea = document.getElementById('gpa-results-area');
        
        if (!hasData || totalCredits === 0) {
            // Optional: Hide results if cleared
            // resArea.style.display = 'none';
            return; 
        }

        resArea.style.display = "grid";

        const gpa = totalPoints / totalCredits;
        
        // Update DOM
        document.getElementById('res-gpa').innerText = gpa.toFixed(2);
        document.getElementById('res-credits').innerText = totalCredits;
        document.getElementById('res-points').innerText = totalPoints.toFixed(1);

        // Update Visual Bar
        const maxScale = parseFloat(this.currentScale);
        const pct = (gpa / maxScale) * 100;
        document.getElementById('res-bar').style.width = pct + "%";

        // Update Target Calculation dynamically
        this.calculateTarget(gpa, totalCredits);
    },

    calculateTarget: function (currentSemGPA, currentSemCredits) {
        // Fetch current semester data if not passed directly
        if (currentSemGPA === undefined) {
             let tp = 0, tc = 0;
             this.rows.forEach(r => {
                 const g = parseFloat(r.grade);
                 const c = parseFloat(r.credits);
                 if(!isNaN(g) && !isNaN(c)) { tp += (g*c); tc += c; }
             });
             currentSemGPA = tc > 0 ? tp/tc : 0;
             currentSemCredits = tc;
        }

        const prevCGPA = parseFloat(document.getElementById('prev-cgpa').value);
        const prevCredits = parseFloat(document.getElementById('prev-credits').value);

        const resEl = document.getElementById('res-new-cgpa');

        if (!isNaN(prevCGPA) && !isNaN(prevCredits)) {
            const totalPrevPoints = prevCGPA * prevCredits;
            const currentSemPoints = currentSemGPA * currentSemCredits;
            
            const newTotalPoints = totalPrevPoints + currentSemPoints;
            const newTotalCredits = prevCredits + currentSemCredits;

            if (newTotalCredits > 0) {
                const newCGPA = newTotalPoints / newTotalCredits;
                resEl.innerText = newCGPA.toFixed(2);
            } else {
                resEl.innerText = "--";
            }
        } else {
            resEl.innerText = "--";
        }
    }
};