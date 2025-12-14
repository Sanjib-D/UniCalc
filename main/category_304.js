// category_304.js - Daily Calorie Needs Calculator
window.AppCalculators.category_3 = window.AppCalculators.category_3 || {};

window.AppCalculators.category_3.calorie_calc = {
  // 1. HTML Structure
  getHtml: function () {
    return `
      <div class="cal-calc-wrapper">
        
        <div class="cal-header-bar">
          <div class="cal-setting-group">
            <label>Method</label>
            <select id="cal-formula" class="cal-select-sm">
              <option value="mifflin">Standard (Recommended)</option>
              <option value="harris">Classic Method</option>
              <option value="katch">Precise (Uses Body Fat %)</option>
            </select>
          </div>
          <div class="cal-setting-group">
            <label>Units</label>
            <div class="cal-unit-toggle">
              <span id="u-metric" class="u-opt active">Metric</span>
              <span id="u-imperial" class="u-opt">Imperial</span>
            </div>
          </div>
        </div>

        <div class="cal-grid-layout initial-center" id="cal-grid-container">
          
          <div class="cal-input-card">
            <h4 class="cal-card-title">Your Details</h4>
            
            <div class="cal-row-split">
               <div class="cal-group">
                 <label>Gender</label>
                 <div class="cal-gender-switch">
                   <div class="g-opt active" data-val="male"><i class="fas fa-mars"></i></div>
                   <div class="g-opt" data-val="female"><i class="fas fa-venus"></i></div>
                 </div>
               </div>
               <div class="cal-group">
                 <label>Age</label>
                 <input type="number" id="cal-age" value="25" class="cal-input">
               </div>
            </div>

            <div class="cal-group">
              <label>Height <span class="u-label-h">(cm)</span></label>
              <div id="h-metric-wrap">
                 <input type="number" id="cal-h-cm" value="175" class="cal-input">
              </div>
              <div id="h-imperial-wrap" style="display:none; gap:10px;">
                 <input type="number" id="cal-h-ft" placeholder="5" class="cal-input">
                 <input type="number" id="cal-h-in" placeholder="9" class="cal-input">
              </div>
            </div>

            <div class="cal-group">
              <label>Weight <span class="u-label-w">(kg)</span></label>
              <input type="number" id="cal-weight" value="70" class="cal-input">
            </div>

            <div class="cal-group" id="bf-group" style="display:none;">
               <label>Body Fat % <small>(Required for Precise Method)</small></label>
               <input type="number" id="cal-bf" placeholder="20" class="cal-input">
            </div>

            <div class="cal-group">
              <label>Activity Level</label>
              <select id="cal-activity" class="cal-select">
                <option value="1.2">Sedentary (Office job)</option>
                <option value="1.375">Light Exercise (1-2 days/week)</option>
                <option value="1.55" selected>Moderate Exercise (3-5 days/week)</option>
                <option value="1.725">Heavy Exercise (6-7 days/week)</option>
                <option value="1.9">Athlete (2x per day)</option>
              </select>
            </div>

            <div class="cal-group">
               <label>Your Goal</label>
               <div class="goal-pill-container">
                 <button class="goal-pill" data-val="lose">Lose Weight</button>
                 <button class="goal-pill active" data-val="maintain">Maintain</button>
                 <button class="goal-pill" data-val="gain">Gain Weight</button>
               </div>
               
               <div id="goal-slider-wrap" style="display:none; margin-top:15px; background:#f9f9f9; padding:10px; border-radius:8px;">
                 <label id="slider-label" style="font-weight:bold; font-size:0.9rem; color:#007bff; display:block; margin-bottom:5px;">
                    Lose 0.5 kg / week
                 </label>
                 <input type="range" id="goal-slider" min="0.25" max="1.0" step="0.25" value="0.5" class="cal-range">
                 <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#888; margin-top:5px;">
                    <span>Slow</span>
                    <span>Fast</span>
                 </div>
               </div>
            </div>

            <button id="cal-action-btn" class="cal-btn-main">Calculate My Needs</button>
          </div>

          <div class="cal-result-card" id="cal-results" style="display:none;">
            
            <div class="cal-res-header">
              <span class="res-sub">Daily Energy Target</span>
              <h1 id="res-calories">2,500</h1>
              <div class="res-unit">Calories / Day</div>
            </div>

            <div class="cal-stats-row">
              <div class="c-stat">
                <small>BMR (Resting)</small>
                <strong id="val-bmr">--</strong>
              </div>
              <div class="c-stat">
                <small>Maintenance</small>
                <strong id="val-tdee">--</strong>
              </div>
              <div class="c-stat">
                <small>Weekly Target</small>
                <strong id="val-weekly">--</strong>
              </div>
            </div>

            <div class="cal-macro-panel">
               <div class="macro-head">
                 <h4>Macronutrients</h4>
                 <select id="macro-diet-type" class="cal-select-xs">
                   <option value="balanced">Balanced Diet</option>
                   <option value="low_carb">Low Carb</option>
                   <option value="high_prot">High Protein</option>
                   <option value="keto">Keto</option>
                 </select>
               </div>
               
               <div class="macro-viz">
                 <div class="macro-donut" id="macro-chart"></div>
                 
                 <div class="macro-list">
                   <div class="m-row">
                     <span class="dot p"></span> Protein
                     <span class="m-grams" id="g-pro">--g</span>
                   </div>
                   <div class="m-row">
                     <span class="dot f"></span> Fats
                     <span class="m-grams" id="g-fat">--g</span>
                   </div>
                   <div class="m-row">
                     <span class="dot c"></span> Carbs
                     <span class="m-grams" id="g-carb">--g</span>
                   </div>
                 </div>
               </div>
            </div>

            <div class="cal-timeline-box" id="timeline-box" style="display:none;">
               <i class="fas fa-chart-line"></i>
               <span id="timeline-text">Estimated to reach goal in -- weeks</span>
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
      goal: 'maintain',
      pace: 0.5, // kg per week
      diet: 'balanced'
    };

    // --- Helper: Unit Toggle ---
    const toggleUnit = (u) => {
      state.unit = u;
      $('u-metric').classList.toggle('active', u === 'metric');
      $('u-imperial').classList.toggle('active', u === 'imperial');

      // Update Labels
      qa('.u-label-w').forEach(el => el.innerText = u === 'metric' ? '(kg)' : '(lbs)');
      qa('.u-label-h').forEach(el => el.innerText = u === 'metric' ? '(cm)' : '(ft/in)');

      $('h-metric-wrap').style.display = u === 'metric' ? 'block' : 'none';
      $('h-imperial-wrap').style.display = u === 'imperial' ? 'flex' : 'none';

      // Slider label update if unit changes
      updateSliderLabel();
    };

    $('u-metric').onclick = () => toggleUnit('metric');
    $('u-imperial').onclick = () => toggleUnit('imperial');

    // --- Helper: Goal Pill Logic ---
    qa('.goal-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        qa('.goal-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.goal = btn.dataset.val;

        const sliderWrap = $('goal-slider-wrap');
        if (state.goal === 'maintain') {
          sliderWrap.style.display = 'none';
          $('timeline-box').style.display = 'none';
        } else {
          sliderWrap.style.display = 'block';
          $('timeline-box').style.display = 'flex';
          updateSliderLabel();
        }
      });
    });

    // --- Slider Logic ---
    const updateSliderLabel = () => {
      const val = parseFloat($('goal-slider').value);
      state.pace = val;
      
      const action = state.goal === 'lose' ? 'Lose' : 'Gain';
      let text = "";

      if(state.unit === 'metric') {
          text = `${action} ${val} kg / week`;
      } else {
          // approx conversion for display: 0.25kg ~ 0.5lbs
          const lbs = (val * 2.2).toFixed(1);
          text = `${action} ${lbs} lbs / week`;
      }

      $('slider-label').innerText = text;
    };

    $('goal-slider').addEventListener('input', updateSliderLabel);

    // --- Formula Logic ---
    $('cal-formula').addEventListener('change', (e) => {
       state.formula = e.target.value;
       $('bf-group').style.display = state.formula === 'katch' ? 'block' : 'none';
    });

    // --- Gender ---
    qa('.g-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        qa('.g-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gender = btn.dataset.val;
      });
    });

    // --- Macro Change (Dynamic) ---
    $('macro-diet-type').addEventListener('change', (e) => {
        state.diet = e.target.value;
        if($('cal-results').style.display !== 'none') {
            this.updateMacros(this.lastCalories);
        }
    });

    // --- Calculate Button ---
    $('cal-action-btn').onclick = () => {
       this.calculate(state);
    };
  },

  // 3. Calculation
  calculate: function(state) {
    const $ = (id) => document.getElementById(id);
    
    // 1. Gather Inputs & Normalize
    let weight = parseFloat($('cal-weight').value) || 0;
    let age = parseFloat($('cal-age').value) || 25;
    let height = 0;

    if (state.unit === 'imperial') {
       weight = weight / 2.20462; // lbs to kg
       let ft = parseFloat($('cal-h-ft').value) || 0;
       let inc = parseFloat($('cal-h-in').value) || 0;
       height = (ft * 30.48) + (inc * 2.54);
    } else {
       height = parseFloat($('cal-h-cm').value) || 0;
    }

    if(weight <= 0 || height <= 0) return;

    // 2. Calc BMR
    let bmr = 0;
    if (state.formula === 'mifflin') {
       // Mifflin-St Jeor
       bmr = (10 * weight) + (6.25 * height) - (5 * age);
       bmr += state.gender === 'male' ? 5 : -161;
    } else if (state.formula === 'harris') {
       // Harris-Benedict (Revised)
       if (state.gender === 'male') {
         bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
       } else {
         bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
       }
    } else if (state.formula === 'katch') {
       // Katch-McArdle
       let bf = parseFloat($('cal-bf').value) || 20;
       let lbm = weight * (1 - (bf/100));
       bmr = 370 + (21.6 * lbm);
    }

    // 3. Calc TDEE
    const act = parseFloat($('cal-activity').value);
    const tdee = bmr * act;

    // 4. Calc Goal Target
    // 1kg fat approx 7700 kcal
    // Deficit needed = kg_per_week * 7700 / 7 days
    let dailyChange = 0;
    
    if (state.goal === 'lose') {
        // pace is in kg (0.25, 0.5, 0.75, 1.0)
        dailyChange = -((state.pace * 7700) / 7);
    } else if (state.goal === 'gain') {
        dailyChange = ((state.pace * 7700) / 7);
    }

    let targetCal = tdee + dailyChange;
    
    // Safety check: Minimum 1200 calories usually recommended
    if(targetCal < 1200 && state.goal === 'lose') {
        // Allow it but maybe warn? For now just floor it reasonably or keep raw.
        // Let's floor at 1000 to prevent negative or dangerous numbers in simple tools
        if (targetCal < 1000) targetCal = 1000; 
    }

    this.lastCalories = targetCal;

    // 5. Timeline Text
    if(state.goal !== 'maintain') {
        const action = state.goal === 'lose' ? 'deficit' : 'surplus';
        const calDiff = Math.abs(Math.round(dailyChange));
        const val = state.unit === 'metric' ? state.pace + ' kg' : (state.pace * 2.2).toFixed(1) + ' lbs';
        
        $('timeline-text').innerHTML = `To <strong>${state.goal} ${val}</strong> per week, you need a daily ${action} of <strong>${calDiff} calories</strong>.`;
        $('timeline-box').style.display = 'flex';
    } else {
        $('timeline-box').style.display = 'none';
    }

    // 6. UI Animation & Update
    const container = $('cal-grid-container');
    container.classList.remove('initial-center'); // Trigger Slide Animation
    $('cal-results').style.display = 'block';

    // Numbers
    const fmt = (n) => Math.round(n).toLocaleString();
    $('res-calories').innerText = fmt(targetCal);
    $('val-bmr').innerText = fmt(bmr);
    $('val-tdee').innerText = fmt(tdee);
    $('val-weekly').innerText = fmt(targetCal * 7);

    // Update Macros
    this.updateMacros(targetCal);
  },

  updateMacros: function(cals) {
     const $ = (id) => document.getElementById(id);
     const type = $('macro-diet-type').value;

     // Splits [P, F, C]
     let ratios = [0.20, 0.30, 0.50]; // default balanced
     
     if(type === 'balanced') ratios = [0.20, 0.30, 0.50];
     if(type === 'low_carb') ratios = [0.35, 0.40, 0.25];
     if(type === 'high_prot') ratios = [0.40, 0.25, 0.35];
     if(type === 'keto') ratios = [0.25, 0.70, 0.05];

     const pCal = cals * ratios[0];
     const fCal = cals * ratios[1];
     const cCal = cals * ratios[2];

     const pGm = Math.round(pCal / 4);
     const fGm = Math.round(fCal / 9);
     const cGm = Math.round(cCal / 4);

     $('g-pro').innerText = `${pGm}g`;
     $('g-fat').innerText = `${fGm}g`;
     $('g-carb').innerText = `${cGm}g`;

     // Pie Chart CSS
     const pDeg = ratios[0] * 360; 
     const fDeg = ratios[1] * 360; 
     
     const chart = $('macro-chart');
     // Protein(Purple), Fat(Yellow), Carb(Green)
     const cP = '#6c5ce7';
     const cF = '#fdcb6e';
     const cC = '#00b894';

     chart.style.background = `conic-gradient(
        ${cP} 0deg ${pDeg}deg,
        ${cF} ${pDeg}deg ${pDeg + fDeg}deg,
        ${cC} ${pDeg + fDeg}deg 360deg
     )`;
  }
};