// category_303.js - Body Fat Percentage Calculator
window.AppCalculators.category_3 = window.AppCalculators.category_3 || {};

window.AppCalculators.category_3.body_fat_calc = {
  // 1. HTML Structure
  getHtml: function () {
    return `
      <div class="bf-calc-wrapper">
        
        <div class="bf-header-bar">
          <div class="bf-control-group">
            <label>Gender</label>
            <div class="bf-gender-toggle">
              <button class="g-btn active" data-val="male"><i class="fas fa-mars"></i> Male</button>
              <button class="g-btn" data-val="female"><i class="fas fa-venus"></i> Female</button>
            </div>
          </div>
          <div class="bf-control-group right">
            <label>Units</label>
            <div class="bf-unit-toggle">
              <span id="bf-u-metric" class="u-opt active">Metric</span>
              <span id="bf-u-imperial" class="u-opt">Imperial</span>
            </div>
          </div>
        </div>

        <div class="bf-grid-layout initial-center" id="bf-grid-container">
          
          <div class="bf-input-card">
            <h4 class="bf-card-title">Measurements</h4>
            
            <div class="bf-input-row">
              <label>Age</label>
              <input type="number" id="bf-age" value="25" class="bf-input short">
            </div>

            <div class="bf-input-row">
              <label>Weight <span class="u-label-w">(kg)</span></label>
              <input type="number" id="bf-weight" value="75" class="bf-input">
            </div>

            <div class="bf-input-row">
              <label>Height <span class="u-label-h">(cm)</span></label>
              <div class="dual-h-wrapper" id="bf-h-metric">
                <input type="number" id="bf-h-cm" value="175" class="bf-input">
              </div>
              <div class="dual-h-wrapper" id="bf-h-imperial" style="display:none;">
                <input type="number" id="bf-h-ft" placeholder="5" class="bf-input-sm"> <span class="sm-tag">ft</span>
                <input type="number" id="bf-h-in" placeholder="9" class="bf-input-sm"> <span class="sm-tag">in</span>
              </div>
            </div>

            <hr class="bf-divider">
            <p class="bf-hint"><i class="fas fa-ruler-horizontal"></i> Circumference (Tape Measure)</p>

            <div class="bf-input-row">
              <label>Neck <span class="u-label-l">(cm)</span></label>
              <input type="number" id="bf-neck" value="38" class="bf-input">
            </div>

            <div class="bf-input-row">
              <label>Waist <span class="u-label-l">(cm)</span> <small>(at navel)</small></label>
              <input type="number" id="bf-waist" value="85" class="bf-input">
            </div>

            <div class="bf-input-row" id="bf-hip-row" style="display:none;">
              <label>Hip <span class="u-label-l">(cm)</span> <small>(widest)</small></label>
              <input type="number" id="bf-hip" value="95" class="bf-input">
            </div>

            <button id="bf-calc-btn" class="bf-action-btn">Calculate Body Fat</button>
          </div>

          <div class="bf-result-card" id="bf-results" style="display:none;">
            
            <div class="bf-main-score">
              <span class="score-label">Body Fat Percentage</span>
              <h1 id="res-bf-pct">--%</h1>
              <div id="res-bf-cat" class="bf-category-badge average">Average</div>
            </div>

            <div class="bf-comp-viz">
              <div class="comp-bar">
                <div id="bar-fat" class="c-fat" style="width: 20%;"></div>
                <div id="bar-lean" class="c-lean" style="width: 80%;"></div>
              </div>
              <div class="comp-legend">
                <div class="l-item"><span class="dot fat"></span> Fat Mass: <strong id="val-fat-mass">--</strong></div>
                <div class="l-item"><span class="dot lean"></span> Lean Mass: <strong id="val-lean-mass">--</strong></div>
              </div>
            </div>

            <div class="bf-details-box">
              <h4>Category Reference</h4>
              <div class="bf-ref-table" id="bf-ref-table">
                </div>
            </div>

            <div class="bf-method-compare">
              <small>Comparison (Estimate)</small>
              <div class="compare-row">
                <span>US Navy Method:</span>
                <strong id="val-navy">--%</strong>
              </div>
              <div class="compare-row alt">
                <span>BMI Estimate:</span>
                <strong id="val-bmi">--%</strong>
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
      unit: 'metric', // metric (kg, cm) or imperial (lbs, in)
    };

    // --- Helper: Render Reference Table ---
    const renderRefTable = () => {
      const isMale = state.gender === 'male';
      const tbl = $('bf-ref-table');
      // Standard ACE Ranges
      if (isMale) {
        tbl.innerHTML = `
          <div class="ref-row head"><span class="c1">Category</span><span class="c2">Range</span></div>
          <div class="ref-row r-ess"><span class="c1">Essential Fat</span><span class="c2">2 - 5%</span></div>
          <div class="ref-row r-ath"><span class="c1">Athletes</span><span class="c2">6 - 13%</span></div>
          <div class="ref-row r-fit"><span class="c1">Fitness</span><span class="c2">14 - 17%</span></div>
          <div class="ref-row r-avg"><span class="c1">Average</span><span class="c2">18 - 24%</span></div>
          <div class="ref-row r-obs"><span class="c1">Obese</span><span class="c2">25% +</span></div>
        `;
      } else {
        tbl.innerHTML = `
          <div class="ref-row head"><span class="c1">Category</span><span class="c2">Range</span></div>
          <div class="ref-row r-ess"><span class="c1">Essential Fat</span><span class="c2">10 - 13%</span></div>
          <div class="ref-row r-ath"><span class="c1">Athletes</span><span class="c2">14 - 20%</span></div>
          <div class="ref-row r-fit"><span class="c1">Fitness</span><span class="c2">21 - 24%</span></div>
          <div class="ref-row r-avg"><span class="c1">Average</span><span class="c2">25 - 31%</span></div>
          <div class="ref-row r-obs"><span class="c1">Obese</span><span class="c2">32% +</span></div>
        `;
      }
    };

    // --- Toggle Unit ---
    const toggleUnit = (u) => {
      state.unit = u;
      $('bf-u-metric').classList.toggle('active', u === 'metric');
      $('bf-u-imperial').classList.toggle('active', u === 'imperial');

      // Update Labels
      qa('.u-label-w').forEach(el => el.innerText = u === 'metric' ? '(kg)' : '(lbs)');
      qa('.u-label-h').forEach(el => el.innerText = u === 'metric' ? '(cm)' : '(ft/in)');
      qa('.u-label-l').forEach(el => el.innerText = u === 'metric' ? '(cm)' : '(in)');

      // Toggle Height Inputs
      $('bf-h-metric').style.display = u === 'metric' ? 'block' : 'none';
      $('bf-h-imperial').style.display = u === 'imperial' ? 'flex' : 'none';

      // Basic Value Conversion
      const convertVal = (id, factor) => {
        const el = $(id);
        const val = parseFloat(el.value);
        if (val) el.value = Math.round(u === 'metric' ? val * factor : val / factor);
      };

      if (u === 'metric') {
        convertVal('bf-weight', 1/2.20462);
        convertVal('bf-neck', 2.54);
        convertVal('bf-waist', 2.54);
        convertVal('bf-hip', 2.54);
        $('bf-h-cm').value = 175; 
      } else {
        convertVal('bf-weight', 2.20462);
        convertVal('bf-neck', 1/2.54);
        convertVal('bf-waist', 1/2.54);
        convertVal('bf-hip', 1/2.54);
        $('bf-h-ft').value = 5;
        $('bf-h-in').value = 9;
      }
    };

    $('bf-u-metric').onclick = () => toggleUnit('metric');
    $('bf-u-imperial').onclick = () => toggleUnit('imperial');

    // --- Toggle Gender ---
    qa('.g-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        qa('.g-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gender = btn.dataset.val;
        
        $('bf-hip-row').style.display = state.gender === 'female' ? 'block' : 'none';
        renderRefTable();
      });
    });

    // --- Calculate ---
    $('bf-calc-btn').onclick = () => {
      this.calculate(state);
      // Removed manual scrolling, letting CSS animation handle visibility focus
    };

    // Init
    renderRefTable();
  },

  // 3. Logic
  calculate: function (state) {
    const $ = (id) => document.getElementById(id);
    
    // 1. Gather Inputs
    let weight = parseFloat($('bf-weight').value) || 0;
    let age = parseFloat($('bf-age').value) || 25;
    let height = 0;
    let neck = parseFloat($('bf-neck').value) || 0;
    let waist = parseFloat($('bf-waist').value) || 0;
    let hip = parseFloat($('bf-hip').value) || 0;

    if (state.unit === 'imperial') {
      weight = weight * 0.453592; // lbs to kg
      neck = neck * 2.54;
      waist = waist * 2.54;
      hip = hip * 2.54;
      
      let ft = parseFloat($('bf-h-ft').value) || 0;
      let inc = parseFloat($('bf-h-in').value) || 0;
      height = (ft * 30.48) + (inc * 2.54);
    } else {
      height = parseFloat($('bf-h-cm').value) || 0;
    }

    if (height === 0 || weight === 0 || waist === 0 || neck === 0) return;

    // 2. Calculate Body Fat % (US Navy Method)
    let bf = 0;
    
    if (state.gender === 'male') {
      if (waist - neck <= 0) {
        alert("Waist must be larger than neck.");
        return;
      }
      bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    } else {
      if (waist + hip - neck <= 0) {
         alert("Check measurements.");
         return;
      }
      bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
    }

    if (bf < 2) bf = 2; 
    if (bf > 70) bf = 70;

    // 3. BMI Comparison
    const h_m = height / 100;
    const bmi = weight / (h_m * h_m);
    const sexFactor = state.gender === 'male' ? 1 : 0;
    let bmiBf = (1.20 * bmi) + (0.23 * age) - (10.8 * sexFactor) - 5.4;
    if (bmiBf < 0) bmiBf = 0;

    // 4. Categorization
    let cat = "";
    let color = "";
    if (state.gender === 'male') {
      if (bf < 6) { cat = "Essential Fat"; color = "ess"; }
      else if (bf < 14) { cat = "Athlete"; color = "ath"; }
      else if (bf < 18) { cat = "Fitness"; color = "fit"; }
      else if (bf < 25) { cat = "Average"; color = "avg"; }
      else { cat = "Obese"; color = "obs"; }
    } else {
      if (bf < 14) { cat = "Essential Fat"; color = "ess"; }
      else if (bf < 21) { cat = "Athlete"; color = "ath"; }
      else if (bf < 25) { cat = "Fitness"; color = "fit"; }
      else if (bf < 32) { cat = "Average"; color = "avg"; }
      else { cat = "Obese"; color = "obs"; }
    }

    // 5. Mass Breakdown
    const fatMass = weight * (bf / 100);
    const leanMass = weight - fatMass;

    // 6. Update UI
    // ANIMATION LOGIC: Remove the centering class
    const container = $('bf-grid-container');
    container.classList.remove('initial-center'); // This triggers the CSS layout shift

    $('bf-results').style.display = 'block';
    
    // Update text
    $('res-bf-pct').innerText = bf.toFixed(1) + '%';
    const badge = $('res-bf-cat');
    badge.innerText = cat;
    badge.className = `bf-category-badge ${color}`;
    
    $('bar-fat').style.width = bf + '%';
    $('bar-lean').style.width = (100 - bf) + '%';
    
    const uLabel = state.unit === 'metric' ? 'kg' : 'lbs';
    let dFat = fatMass; 
    let dLean = leanMass;
    
    if(state.unit === 'imperial') {
       dFat = fatMass * 2.20462;
       dLean = leanMass * 2.20462;
    }

    $('val-fat-mass').innerText = `${dFat.toFixed(1)} ${uLabel}`;
    $('val-lean-mass').innerText = `${dLean.toFixed(1)} ${uLabel}`;
    $('val-navy').innerText = bf.toFixed(1) + '%';
    $('val-bmi').innerText = bmiBf.toFixed(1) + '%';
  }
};