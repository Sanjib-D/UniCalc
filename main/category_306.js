// category_306.js - Ideal Weight Calculator
window.AppCalculators.category_3 = window.AppCalculators.category_3 || {};

window.AppCalculators.category_3.ideal_weight_calc = {
  // 1. HTML Structure
  getHtml: function () {
    return `
      <div class="iw-calc-wrapper">
        
        <div class="iw-header-bar">
          <div class="iw-setting-group">
            <label>Measurement Units</label>
            <div class="iw-unit-toggle">
              <span id="iw-u-metric" class="u-opt active">Metric (kg / cm)</span>
              <span id="iw-u-imperial" class="u-opt">Imperial (lbs / ft)</span>
            </div>
          </div>
        </div>

        <div class="iw-grid-layout initial-center" id="iw-grid-container">
          
          <div class="iw-input-card">
            <h4 class="iw-card-title"><i class="fas fa-ruler-vertical"></i> Body Details</h4>
            
            <div class="iw-row-split">
               <div class="iw-group">
                 <label>Gender</label>
                 <div class="iw-gender-switch">
                   <div class="g-opt active" data-val="male"><i class="fas fa-mars"></i> Male</div>
                   <div class="g-opt" data-val="female"><i class="fas fa-venus"></i> Female</div>
                 </div>
               </div>
               <div class="iw-group">
                 <label>Age</label>
                 <input type="number" id="iw-age" value="30" class="iw-input">
               </div>
            </div>

            <div class="iw-group">
              <label>Height <span class="u-label-h">(cm)</span></label>
              <div id="iw-h-metric-wrap">
                 <input type="number" id="iw-h-cm" value="175" class="iw-input">
              </div>
              <div id="iw-h-imperial-wrap" style="display:none; gap:10px;">
                 <input type="number" id="iw-h-ft" placeholder="5" class="iw-input">
                 <input type="number" id="iw-h-in" placeholder="9" class="iw-input">
              </div>
            </div>

            <div class="iw-group">
              <label>Current Weight <span class="u-label-w">(kg)</span></label>
              <input type="number" id="iw-cur-weight" value="85" class="iw-input">
            </div>

            <div class="iw-group">
              <label>Body Frame Size <i class="fas fa-info-circle" title="Wrist circumference can indicate frame size"></i></label>
              <select id="iw-frame" class="iw-select">
                <option value="small">Small Frame (-10%)</option>
                <option value="medium" selected>Medium Frame (Average)</option>
                <option value="large">Large Frame (+10%)</option>
              </select>
            </div>

            <button id="iw-action-btn" class="iw-btn-main">Calculate Ideal Weight</button>
          </div>

          <div class="iw-result-card" id="iw-results" style="display:none;">
            
            <div class="iw-res-header">
              <span class="res-sub">Healthy BMI Range</span>
              <h1 id="res-range-main">-- - -- kg</h1>
              <div class="res-desc">Based on World Health Organization standards</div>
            </div>

            <div class="iw-status-box">
              <div class="status-labels">
                 <span>Current: <strong id="val-cur-w">--</strong></span>
                 <span id="status-tag" class="st-tag normal">Normal</span>
              </div>
              <div class="status-bar-track">
                 <div id="status-marker" class="status-marker"></div>
              </div>
              <p id="status-msg" class="status-msg">You are within the healthy range.</p>
            </div>

            <div class="iw-formula-list">
               <h4>Medical Formulas</h4>
               <div class="f-row">
                 <span class="f-name">Devine (1974)</span>
                 <strong class="f-val" id="val-devine">--</strong>
               </div>
               <div class="f-row">
                 <span class="f-name">Robinson (1983)</span>
                 <strong class="f-val" id="val-robinson">--</strong>
               </div>
               <div class="f-row">
                 <span class="f-name">Miller (1983)</span>
                 <strong class="f-val" id="val-miller">--</strong>
               </div>
               <div class="f-row">
                 <span class="f-name">Hamwi (1964)</span>
                 <strong class="f-val" id="val-hamwi">--</strong>
               </div>
               <div class="f-note">
                 <i class="fas fa-exclamation-circle"></i> These formulas estimate weight based on height only. Muscle mass is not factored in.
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
      unit: 'metric', // metric (kg/cm) or imperial (lb/ft)
      height_cm: 175,
      weight_kg: 85,
      frame: 'medium'
    };

    // --- Unit Toggle ---
    const toggleUnit = (u) => {
      state.unit = u;
      $('iw-u-metric').classList.toggle('active', u === 'metric');
      $('iw-u-imperial').classList.toggle('active', u === 'imperial');

      // Update Labels
      qa('.u-label-w').forEach(el => el.innerText = u === 'metric' ? '(kg)' : '(lbs)');
      qa('.u-label-h').forEach(el => el.innerText = u === 'metric' ? '(cm)' : '(ft/in)');

      $('iw-h-metric-wrap').style.display = u === 'metric' ? 'block' : 'none';
      $('iw-h-imperial-wrap').style.display = u === 'imperial' ? 'flex' : 'none';
      
      // Simple Value Conversion for UI continuity
      const curW = parseFloat($('iw-cur-weight').value) || 0;
      if(curW > 0) {
        if(u === 'metric') $('iw-cur-weight').value = Math.round(curW / 2.20462);
        else $('iw-cur-weight').value = Math.round(curW * 2.20462);
      }
    };

    $('iw-u-metric').onclick = () => toggleUnit('metric');
    $('iw-u-imperial').onclick = () => toggleUnit('imperial');

    // --- Gender Switch ---
    qa('.g-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        qa('.g-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gender = btn.dataset.val;
      });
    });

    // --- Calculate ---
    $('iw-action-btn').onclick = () => {
      this.calculate(state);
    };
  },

  // 3. Logic
  calculate: function(state) {
    const $ = (id) => document.getElementById(id);

    // 1. Gather Inputs & Normalize to Metric (cm, kg)
    let weight = parseFloat($('iw-cur-weight').value) || 0;
    let height = 0;
    const frame = $('iw-frame').value;
    
    if (state.unit === 'imperial') {
       weight = weight / 2.20462; // lbs to kg
       let ft = parseFloat($('iw-h-ft').value) || 0;
       let inc = parseFloat($('iw-h-in').value) || 0;
       height = (ft * 30.48) + (inc * 2.54);
    } else {
       height = parseFloat($('iw-h-cm').value) || 0;
    }

    if(height <= 0) return; // Height is required

    // 2. Formulas (Base logic is usually for height > 60 inches / 152.4 cm)
    // We will apply standard logic. 
    // Inches over 5 ft
    const heightInches = height / 2.54;
    const over5ft = heightInches - 60; 

    // Helper: calculate formula
    // If < 5ft, we just return a BMI based estimate or simplified deduction for robustness
    // but strictly these formulas are for > 5ft. We will clamp `over5ft` to 0 or handle logic.
    const validOver = over5ft > 0 ? over5ft : 0; 
    
    let devine = 0, robinson = 0, miller = 0, hamwi = 0;

    if (state.gender === 'male') {
        devine = 50.0 + (2.3 * validOver);
        robinson = 52.0 + (1.9 * validOver);
        miller = 56.2 + (1.41 * validOver);
        hamwi = 48.0 + (2.7 * validOver);
    } else {
        devine = 45.5 + (2.3 * validOver);
        robinson = 49.0 + (1.7 * validOver);
        miller = 53.1 + (1.36 * validOver);
        hamwi = 45.5 + (2.2 * validOver);
    }

    // Frame Adjustment (Usually applied to Hamwi, but we can apply generally for "Ideal" range concept)
    // Here we just display raw formulas, but we can adjust them if needed. 
    // Let's modify all by +/- 10% if frame selected, OR just keep formulas pure and use BMI range.
    // Standard practice: Formulas are pure. Frame adjusts the 'target'.
    // Let's apply frame to Hamwi specifically as it's most associated with frame size.
    if(frame === 'small') hamwi *= 0.9;
    if(frame === 'large') hamwi *= 1.1;

    // 3. BMI Range (WHO: 18.5 - 25)
    const h_m = height / 100;
    const minBMI = 18.5 * (h_m * h_m);
    const maxBMI = 24.9 * (h_m * h_m); // Adjusted to 24.9 for upper limit "Normal"

    // 4. Update UI
    const container = $('iw-grid-container');
    container.classList.remove('initial-center'); // Trigger Animation
    $('iw-results').style.display = 'block';

    const fmt = (kg) => {
        if(state.unit === 'metric') return kg.toFixed(1) + ' kg';
        return (kg * 2.20462).toFixed(1) + ' lbs';
    };

    $('res-range-main').innerText = `${fmt(minBMI)} - ${fmt(maxBMI)}`;
    
    $('val-devine').innerText = fmt(devine);
    $('val-robinson').innerText = fmt(robinson);
    $('val-miller').innerText = fmt(miller);
    $('val-hamwi').innerText = fmt(hamwi);

    // 5. Status Bar Logic
    $('val-cur-w').innerText = fmt(weight);
    
    // Position Marker
    // Range for bar: minBMI - 10kg to maxBMI + 20kg
    // We want visually: Under | Healthy (Green) | Over
    // Let's define bar 0% to 100% relative to BMI 15 to 35
    const curBMI = weight / (h_m * h_m);
    
    // Map BMI 15->0%, 35->100%
    let pct = ((curBMI - 15) / (35 - 15)) * 100;
    if(pct < 0) pct = 0;
    if(pct > 100) pct = 100;
    
    const marker = $('status-marker');
    marker.style.left = pct + '%';

    const tag = $('status-tag');
    const msg = $('status-msg');

    if(curBMI < 18.5) {
        tag.className = 'st-tag under'; tag.innerText = 'Underweight';
        marker.style.background = '#3498db';
        msg.innerText = `You are slightly below the ideal range. Gain ${(minBMI - weight).toFixed(1)}kg to reach healthy BMI.`;
    } else if (curBMI <= 24.9) {
        tag.className = 'st-tag normal'; tag.innerText = 'Perfect';
        marker.style.background = '#2ecc71';
        msg.innerText = `Great! Your weight is within the healthy ideal range.`;
    } else {
        tag.className = 'st-tag over'; tag.innerText = 'Overweight';
        marker.style.background = '#e74c3c';
        msg.innerText = `You are above the ideal range. Lose ${(weight - maxBMI).toFixed(1)}kg to reach healthy BMI.`;
    }
  }
};