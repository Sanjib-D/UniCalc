// category_305.js - Water Intake Calculator
window.AppCalculators.category_3 = window.AppCalculators.category_3 || {};

window.AppCalculators.category_3.water_calc = {
  // 1. HTML Structure
  getHtml: function () {
    return `
      <div class="water-calc-wrapper">
        
        <div class="water-header-bar">
          <div class="water-setting-group">
            <label>Measurement Units</label>
            <div class="water-unit-toggle">
              <span id="w-u-metric" class="u-opt active">Metric (kg / ml)</span>
              <span id="w-u-imperial" class="u-opt">Imperial (lbs / oz)</span>
            </div>
          </div>
        </div>

        <div class="water-grid-layout initial-center" id="water-grid-container">
          
          <div class="water-input-card">
            <h4 class="water-card-title"><i class="fas fa-tint"></i> Personal Details</h4>
            
            <div class="water-row-split">
               <div class="water-group">
                 <label>Gender</label>
                 <div class="water-gender-switch">
                   <div class="wg-opt active" data-val="male"><i class="fas fa-mars"></i></div>
                   <div class="wg-opt" data-val="female"><i class="fas fa-venus"></i></div>
                 </div>
               </div>
               <div class="water-group">
                 <label>Weight <span class="u-label-w">(kg)</span></label>
                 <input type="number" id="water-weight" value="70" class="water-input">
               </div>
            </div>

            <hr class="water-divider">

            <div class="water-group">
              <label>Daily Activity Level</label>
              <select id="water-activity" class="water-select">
                <option value="1.0">Sedentary (Desk Job)</option>
                <option value="1.1">Lightly Active (Standing/Moving)</option>
                <option value="1.2">Active (Physical Job)</option>
                <option value="1.4">Very Active (Construction/Athlete)</option>
              </select>
            </div>

            <div class="water-group">
               <label>Exercise Duration: <span id="ex-val" class="highlight-text">30 mins</span></label>
               <input type="range" id="water-exercise" min="0" max="180" step="15" value="30" class="water-range">
            </div>

            <hr class="water-divider">

            <div class="water-group">
              <label>Weather / Climate</label>
              <div class="weather-options">
                <div class="weather-opt" data-val="cold">
                  <i class="fas fa-snowflake"></i> Cold
                </div>
                <div class="weather-opt active" data-val="moderate">
                  <i class="fas fa-cloud-sun"></i> Moderate
                </div>
                <div class="weather-opt" data-val="hot">
                  <i class="fas fa-sun"></i> Hot
                </div>
              </div>
            </div>

            <div class="water-modifiers">
               <label class="mod-chk">
                 <input type="checkbox" id="mod-preg"> Pregnancy
               </label>
               <label class="mod-chk">
                 <input type="checkbox" id="mod-breast"> Breastfeeding
               </label>
               <label class="mod-chk">
                 <input type="checkbox" id="mod-ill"> Fever / Illness
               </label>
            </div>

            <button id="water-calc-btn" class="water-btn-main">Calculate Intake</button>
          </div>

          <div class="water-result-card" id="water-results" style="display:none;">
            
            <div class="water-res-header">
              <span class="res-sub">Daily Water Target</span>
              <h1 id="res-total-vol">2,500 ml</h1>
              <div class="res-glass-count">
                approx <strong id="res-glasses">10</strong> glasses <small>(250ml each)</small>
              </div>
            </div>

            <div class="cup-grid-wrapper" id="cup-visuals">
               </div>

            <div class="water-breakdown-box">
               <div class="wb-row">
                 <span><i class="fas fa-user"></i> Base Need</span>
                 <strong id="val-base">--</strong>
               </div>
               <div class="wb-row">
                 <span><i class="fas fa-running"></i> Exercise Add-on</span>
                 <strong id="val-exercise">--</strong>
               </div>
               <div class="wb-row">
                 <span><i class="fas fa-sun"></i> Weather/Other</span>
                 <strong id="val-weather">--</strong>
               </div>
            </div>

            <div class="water-schedule">
              <h4>Suggested Timeline</h4>
              <div class="timeline-item">
                <span class="time">Morning</span>
                <span class="amount" id="sch-morn">--</span>
              </div>
              <div class="timeline-item">
                <span class="time">Afternoon</span>
                <span class="amount" id="sch-aft">--</span>
              </div>
              <div class="timeline-item">
                <span class="time">Evening</span>
                <span class="amount" id="sch-eve">--</span>
              </div>
            </div>

            <div class="alert-box-info">
              <i class="fas fa-info-circle"></i> 
              Includes water from food (approx 20%). Drink when thirsty!
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
      unit: 'metric', // metric (kg/ml) or imperial (lb/oz)
      weight: 70,
      activity: 1.0,
      exercise: 30, // mins
      weather: 'moderate',
      modifiers: { preg: false, breast: false, ill: false }
    };

    // --- Unit Toggle ---
    const toggleUnit = (u) => {
      state.unit = u;
      $('w-u-metric').classList.toggle('active', u === 'metric');
      $('w-u-imperial').classList.toggle('active', u === 'imperial');

      // Update Labels
      qa('.u-label-w').forEach(el => el.innerText = u === 'metric' ? '(kg)' : '(lbs)');
      
      // Simple convert of current weight input
      let curW = parseFloat($('water-weight').value) || 0;
      if(curW > 0) {
          if(u === 'metric') $('water-weight').value = Math.round(curW / 2.20462);
          else $('water-weight').value = Math.round(curW * 2.20462);
      }
    };

    $('w-u-metric').onclick = () => toggleUnit('metric');
    $('w-u-imperial').onclick = () => toggleUnit('imperial');

    // --- Inputs Handling ---
    qa('.wg-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        qa('.wg-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gender = btn.dataset.val;
      });
    });

    qa('.weather-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        qa('.weather-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.weather = btn.dataset.val;
      });
    });

    $('water-exercise').addEventListener('input', (e) => {
        state.exercise = parseInt(e.target.value);
        $('ex-val').innerText = `${state.exercise} mins`;
    });

    // --- Calculate ---
    $('water-calc-btn').onclick = () => {
        // Read Inputs
        state.weight = parseFloat($('water-weight').value) || 0;
        state.activity = parseFloat($('water-activity').value);
        state.modifiers.preg = $('mod-preg').checked;
        state.modifiers.breast = $('mod-breast').checked;
        state.modifiers.ill = $('mod-ill').checked;

        this.calculate(state);
    };
  },

  // 3. Logic
  calculate: function(state) {
    const $ = (id) => document.getElementById(id);

    // 1. Normalize Weight to KG
    let weightKg = state.weight;
    if(state.unit === 'imperial') weightKg = state.weight / 2.20462;

    if(weightKg <= 0) return;

    // 2. Base Calculation (approx 35ml per kg for avg adult)
    // Age adjustments could be added, but keeping simple for robustness
    let baseMl = weightKg * 35;
    
    // Adjust base for activity level multiplier (lifestyle)
    // 1.0 is sedantry (baseline), 1.4 is very active
    // We already use base 35, let's scale it slightly
    // Alternatively: Base + (Activity Factor)
    // Simple approach: 35ml is usually enough for sedentary. 
    // We will multiply base.
    baseMl = baseMl * state.activity;

    // 3. Exercise Add-on
    // ~12 oz (350ml) for every 30 mins
    let exerciseMl = (state.exercise / 30) * 350;

    // 4. Weather Modifiers
    let weatherMl = 0;
    if(state.weather === 'hot') weatherMl += (baseMl * 0.15); // +15%
    if(state.weather === 'cold') weatherMl += (baseMl * 0.05); // dry air compensation

    // 5. Special Conditions
    let specialMl = 0;
    if(state.modifiers.preg) specialMl += 300;
    if(state.modifiers.breast) specialMl += 700;
    if(state.modifiers.ill) specialMl += 500;

    // Total
    const totalMl = baseMl + exerciseMl + weatherMl + specialMl;

    // 6. UI Updates
    const container = $('water-grid-container');
    container.classList.remove('initial-center'); // Animate
    $('water-results').style.display = 'block';

    // Format output based on unit
    let displayTotal = "";
    let glassSize = 250; // ml
    let glassUnit = "ml";
    
    if(state.unit === 'metric') {
        displayTotal = `${Math.round(totalMl).toLocaleString()} ml`;
        // if > 1000, maybe show Liters? Let's stick to ml for precision or dual
        if(totalMl > 1000) displayTotal = `${(totalMl/1000).toFixed(2)} Liters`;
    } else {
        // oz conversion: ml / 29.57
        const totalOz = totalMl / 29.5735;
        displayTotal = `${Math.round(totalOz)} oz`;
        glassSize = 8; // 8 oz glasses standard
        glassUnit = "oz";
    }

    $('res-total-vol').innerText = displayTotal;

    // Glass Count
    let numGlasses = 0;
    if(state.unit === 'metric') {
        numGlasses = Math.ceil(totalMl / 250);
        $('res-glasses').innerText = numGlasses;
        $('res-glasses').nextElementSibling.innerText = `(250ml each)`;
    } else {
        const totalOz = totalMl / 29.5735;
        numGlasses = Math.ceil(totalOz / 8);
        $('res-glasses').innerText = numGlasses;
        $('res-glasses').nextElementSibling.innerText = `(8 oz each)`;
    }

    // Breakdown Values
    const fmt = (ml) => {
        if(state.unit === 'metric') return Math.round(ml) + ' ml';
        return Math.round(ml / 29.5735) + ' oz';
    };

    $('val-base').innerText = fmt(baseMl);
    $('val-exercise').innerText = "+" + fmt(exerciseMl);
    $('val-weather').innerText = "+" + fmt(weatherMl + specialMl);

    // Timeline (Rough Distribution: 20% Morn, 40% Aft, 40% Eve)
    $('sch-morn').innerText = fmt(totalMl * 0.2);
    $('sch-aft').innerText = fmt(totalMl * 0.4);
    $('sch-eve').innerText = fmt(totalMl * 0.4);

    // Cup Visuals
    const cupContainer = $('cup-visuals');
    cupContainer.innerHTML = '';
    // Cap visuals at 20 icons max to prevent overflow
    const iconsToShow = Math.min(numGlasses, 24);
    
    for(let i=0; i<iconsToShow; i++) {
        let div = document.createElement('div');
        div.className = 'cup-icon filled';
        div.innerHTML = '<i class="fas fa-glass-whiskey"></i>';
        // Add staggered animation delay
        div.style.animationDelay = `${i * 0.05}s`;
        cupContainer.appendChild(div);
    }
  }
};