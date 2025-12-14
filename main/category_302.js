// category_302.js - Advanced BMR & TDEE Calculator
window.AppCalculators.category_3 = window.AppCalculators.category_3 || {};

window.AppCalculators.category_3.bmr_calc = {
  // 1. HTML Structure
  getHtml: function () {
    return `
      <div class="bmr-calc-wrapper">
        
        <div class="bmr-top-bar">
          <div class="bmr-setting-group">
            <label>Formula</label>
            <select id="bmr-formula-select" class="bmr-select">
              <option value="mifflin">Mifflin-St Jeor (Recommended)</option>
              <option value="harris_orig">Harris-Benedict (Original)</option>
              <option value="harris_rev">Harris-Benedict (Revised)</option>
              <option value="katch">Katch-McArdle (Requires Body Fat %)</option>
            </select>
          </div>
          
          <div class="bmr-setting-group">
            <label>Units</label>
            <div class="bmr-toggle-pill">
              <span id="bmr-unit-metric" class="active">Metric</span>
              <span id="bmr-unit-imperial">Imperial</span>
            </div>
          </div>
        </div>

        <div class="bmr-grid-layout">
          <div class="bmr-input-panel">
            
            <div class="bmr-row">
              <div class="bmr-input-group">
                <label>Gender</label>
                <div class="bmr-gender-switch">
                  <div class="gender-btn active" data-val="male"><i class="fas fa-mars"></i> Male</div>
                  <div class="gender-btn" data-val="female"><i class="fas fa-venus"></i> Female</div>
                </div>
              </div>
              <div class="bmr-input-group">
                <label>Age</label>
                <input type="number" id="bmr-age" value="30" class="bmr-input">
              </div>
            </div>

            <div class="bmr-input-group">
              <label>Height</label>
              <div id="bmr-height-metric" class="bmr-dual-input">
                <input type="number" id="bmr-h-cm" placeholder="175" value="175">
                <span class="suffix">cm</span>
              </div>
              <div id="bmr-height-imperial" class="bmr-dual-input" style="display:none;">
                <input type="number" id="bmr-h-ft" placeholder="5"> <span class="suffix">ft</span>
                <input type="number" id="bmr-h-in" placeholder="9"> <span class="suffix">in</span>
              </div>
            </div>

            <div class="bmr-input-group">
              <label>Weight</label>
              <div class="bmr-dual-input">
                <input type="number" id="bmr-weight" value="75">
                <span class="suffix" id="bmr-w-unit">kg</span>
              </div>
            </div>

            <div class="bmr-input-group" id="bmr-bf-group" style="display:none; animation: fadeIn 0.3s;">
               <label>Body Fat Percentage (%) <i class="fas fa-info-circle" title="Required for Katch-McArdle"></i></label>
               <div class="bmr-dual-input">
                 <input type="number" id="bmr-bf" placeholder="20">
                 <span class="suffix">%</span>
               </div>
            </div>

            <div class="bmr-input-group">
              <label>Activity Level</label>
              <select id="bmr-activity" class="bmr-select-activity">
                <option value="1.2">Sedentary (Little or no exercise)</option>
                <option value="1.375">Lightly Active (Exercise 1-3 days/week)</option>
                <option value="1.55" selected>Moderately Active (Exercise 3-5 days/week)</option>
                <option value="1.725">Very Active (Hard exercise 6-7 days/week)</option>
                <option value="1.9">Super Active (Physical job or training 2x/day)</option>
              </select>
            </div>

            <button id="bmr-calc-btn" class="bmr-action-btn">Calculate Plan</button>
          </div>

          <div class="bmr-result-panel" id="bmr-results-area" style="display:none;">
            
            <div class="bmr-main-values">
               <div class="bmr-val-box">
                 <span class="lbl">BMR (Basal Rate)</span>
                 <h2 id="res-bmr">0</h2>
                 <small>Calories/Day</small>
               </div>
               <div class="bmr-val-box highlight">
                 <span class="lbl">TDEE (Maintenance)</span>
                 <h2 id="res-tdee">0</h2>
                 <small>Calories/Day</small>
               </div>
            </div>

            <div class="bmr-goal-section">
              <label>Choose Your Goal</label>
              <div class="bmr-goal-tabs">
                <button class="goal-btn" data-mod="0.85">Lose Fat</button>
                <button class="goal-btn active" data-mod="1.0">Maintain</button>
                <button class="goal-btn" data-mod="1.15">Build Muscle</button>
              </div>
              
              <div class="daily-target-display">
                <span class="target-label">Daily Calorie Target</span>
                <div class="target-number" id="res-target-cals">0</div>
                <div class="target-diff" id="res-target-diff">0 cal change</div>
              </div>
            </div>

            <div class="bmr-macro-section">
               <div class="macro-header">
                 <span>Macronutrients</span>
                 <select id="macro-split-select" class="macro-select-sm">
                   <option value="balanced">Balanced (30/35/35)</option>
                   <option value="lowcarb">Low Carb (40/40/20)</option>
                   <option value="highcarb">High Carb (25/20/55)</option>
                 </select>
               </div>

               <div class="macro-viz-container">
                  <div class="macro-pie" id="macro-pie-chart"></div>
                  
                  <div class="macro-legend">
                    <div class="m-item">
                      <div class="dot p"></div>
                      <div class="m-det">
                        <span class="m-name">Protein</span>
                        <span class="m-val" id="val-protein">0g</span>
                      </div>
                    </div>
                    <div class="m-item">
                      <div class="dot f"></div>
                      <div class="m-det">
                        <span class="m-name">Fats</span>
                        <span class="m-val" id="val-fats">0g</span>
                      </div>
                    </div>
                    <div class="m-item">
                      <div class="dot c"></div>
                      <div class="m-det">
                        <span class="m-name">Carbs</span>
                        <span class="m-val" id="val-carbs">0g</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  // 2. Initialization
  init: function () {
    const $ = (id) => document.getElementById(id);
    const qa = (sel) => document.querySelectorAll(sel);

    let state = {
      gender: 'male',
      unit: 'metric',
      formula: 'mifflin',
      goalMod: 1.0,
      macroSplit: 'balanced'
    };

    // --- Toggle Units ---
    $('bmr-unit-metric').onclick = () => setUnit('metric');
    $('bmr-unit-imperial').onclick = () => setUnit('imperial');

    const setUnit = (u) => {
      state.unit = u;
      $('bmr-unit-metric').classList.toggle('active', u === 'metric');
      $('bmr-unit-imperial').classList.toggle('active', u === 'imperial');

      // Toggle Height Inputs
      $('bmr-height-metric').style.display = u === 'metric' ? 'flex' : 'none';
      $('bmr-height-imperial').style.display = u === 'imperial' ? 'flex' : 'none';
      
      // Update Weight Label
      $('bmr-w-unit').innerText = u === 'metric' ? 'kg' : 'lbs';

      // Simple conversion logic if values exist
      let wVal = parseFloat($('bmr-weight').value);
      if(wVal) {
        if(u === 'imperial') $('bmr-weight').value = Math.round(wVal * 2.20462);
        else $('bmr-weight').value = Math.round(wVal / 2.20462);
      }
    };

    // --- Toggle Gender ---
    qa('.gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        qa('.gender-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gender = btn.dataset.val;
      });
    });

    // --- Formula Change ---
    $('bmr-formula-select').addEventListener('change', (e) => {
        state.formula = e.target.value;
        const bfGroup = $('bmr-bf-group');
        if(state.formula === 'katch') {
            bfGroup.style.display = 'block';
        } else {
            bfGroup.style.display = 'none';
        }
    });

    // --- Goal Buttons ---
    qa('.goal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        qa('.goal-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.goalMod = parseFloat(btn.dataset.mod);
        this.updateDynamicResults(state);
      });
    });

    // --- Macro Split Change ---
    $('macro-split-select').addEventListener('change', (e) => {
       state.macroSplit = e.target.value;
       this.updateDynamicResults(state);
    });

    // --- Calculate Button ---
    $('bmr-calc-btn').onclick = () => {
       this.calculate(state);
       // Scroll to results on mobile
       if(window.innerWidth < 768) {
           setTimeout(() => {
               $('bmr-results-area').scrollIntoView({behavior: "smooth"});
           }, 100);
       }
    };
  },

  // 3. Calculation Logic
  calculate: function (state) {
    const $ = (id) => document.getElementById(id);

    // 1. Gather Inputs & Normalize to Metric
    let weight = parseFloat($('bmr-weight').value) || 0;
    let height = 0;
    let age = parseFloat($('bmr-age').value) || 0;
    
    if (state.unit === 'imperial') {
       weight = weight / 2.20462; // lbs to kg
       let ft = parseFloat($('bmr-h-ft').value) || 0;
       let inc = parseFloat($('bmr-h-in').value) || 0;
       height = (ft * 30.48) + (inc * 2.54); // ft/in to cm
    } else {
       height = parseFloat($('bmr-h-cm').value) || 0;
    }

    if (weight <= 0 || height <= 0 || age <= 0) return;

    // 2. Calculate BMR
    let bmr = 0;

    // Mifflin-St Jeor
    // Men: (10 × weight) + (6.25 × height) - (5 × age) + 5
    // Women: (10 × weight) + (6.25 × height) - (5 × age) - 161
    if (state.formula === 'mifflin') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr += (state.gender === 'male' ? 5 : -161);
    }
    // Harris-Benedict (Revised 1984)
    // Men: 88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)
    // Women: 447.593 + (9.247 × weight) + (3.098 × height) - (4.330 × age)
    else if (state.formula === 'harris_rev') {
        if(state.gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
    }
    // Harris-Benedict (Original 1919)
    else if (state.formula === 'harris_orig') {
        if(state.gender === 'male') {
             bmr = 66.5 + (13.75 * weight) + (5.003 * height) - (6.75 * age);
        } else {
             bmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
        }
    }
    // Katch-McArdle (BMR = 370 + (21.6 * LBM))
    else if (state.formula === 'katch') {
        let bf = parseFloat($('bmr-bf').value) || 20; // default 20 if empty
        let lbm = weight * (1 - (bf/100));
        bmr = 370 + (21.6 * lbm);
    }

    // 3. Calculate TDEE
    const activityMult = parseFloat($('bmr-activity').value);
    const tdee = bmr * activityMult;

    // Store base results for dynamic updating
    this.lastResult = { bmr, tdee };

    // Update UI
    $('bmr-results-area').style.display = 'block';
    $('res-bmr').innerText = Math.round(bmr).toLocaleString();
    $('res-tdee').innerText = Math.round(tdee).toLocaleString();

    this.updateDynamicResults(state);
  },

  updateDynamicResults: function(state) {
      if(!this.lastResult) return;
      const $ = (id) => document.getElementById(id);

      const targetCals = this.lastResult.tdee * state.goalMod;
      const diff = targetCals - this.lastResult.tdee;
      
      $('res-target-cals').innerText = Math.round(targetCals).toLocaleString();
      
      let diffText = "";
      if(diff > 50) diffText = `+${Math.round(diff)} surplus`;
      else if(diff < -50) diffText = `${Math.round(diff)} deficit`;
      else diffText = "Maintenance";
      
      const diffEl = $('res-target-diff');
      diffEl.innerText = diffText;
      
      // Update Diff Color
      diffEl.className = 'target-diff';
      if(state.goalMod > 1.05) diffEl.classList.add('surplus');
      if(state.goalMod < 0.95) diffEl.classList.add('deficit');

      // --- Macros Calculation ---
      // Splits [Protein, Fat, Carbs]
      let splits = [0.3, 0.35, 0.35]; // balanced default
      if(state.macroSplit === 'lowcarb') splits = [0.4, 0.4, 0.2]; // P/F/C
      else if(state.macroSplit === 'highcarb') splits = [0.25, 0.2, 0.55];

      // Calories per gram: P=4, F=9, C=4
      const pGrams = Math.round((targetCals * splits[0]) / 4);
      const fGrams = Math.round((targetCals * splits[1]) / 9);
      const cGrams = Math.round((targetCals * splits[2]) / 4);

      $('val-protein').innerText = `${pGrams}g`;
      $('val-fats').innerText = `${fGrams}g`;
      $('val-carbs').innerText = `${cGrams}g`;

      // Update Pie Chart Visual
      // We need conic-gradient stops. 
      // Protein 0% -> split[0]%
      // Fats split[0]% -> split[0]+split[1]%
      // Carbs remaining
      const pDeg = splits[0] * 100;
      const fDeg = pDeg + (splits[1] * 100);
      
      const chart = $('macro-pie-chart');
      // Colors: Protein(#4834d4), Fats(#f0932b), Carbs(#6ab04c)
      chart.style.background = `conic-gradient(
          #4834d4 0% ${pDeg}%, 
          #f0932b ${pDeg}% ${fDeg}%, 
          #6ab04c ${fDeg}% 100%
      )`;
  }
};