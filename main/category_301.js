// category_301.js - Advanced BMI Calculator
window.AppCalculators.category_3 = window.AppCalculators.category_3 || {};

window.AppCalculators.category_3.bmi_calc = {
  // 1. Define the HTML Structure
  getHtml: function () {
    return `
      <div class="bmi-calc-wrapper">
        <div class="bmi-header-controls">
          <div class="std-toggle-wrapper">
            <span class="std-label">Standard:</span>
            <div class="segmented-control" id="bmi-std-control">
              <button class="seg-btn active" data-value="who">International (WHO)</button>
              <button class="seg-btn" data-value="asian">Asian (WPRO)</button>
            </div>
          </div>
        </div>

        <div class="bmi-grid">
          <div class="bmi-input-card">
            
            <div class="input-row-split">
              <div class="bmi-form-group">
                <label>Gender</label>
                <div class="gender-select" id="gender-select">
                  <div class="gender-opt active" data-value="male"><i class="fas fa-mars"></i> Male</div>
                  <div class="gender-opt" data-value="female"><i class="fas fa-venus"></i> Female</div>
                </div>
              </div>
              <div class="bmi-form-group">
                <label>Age <small>(years)</small></label>
                <input type="number" id="bmi-age" value="25" min="2" max="120" class="bmi-input-field">
              </div>
            </div>

            <div class="bmi-form-group">
              <div class="label-row">
                <label>Height</label>
                <div class="unit-toggle-text">
                  <span id="h-unit-cm" class="u-tog active">CM</span> / 
                  <span id="h-unit-ft" class="u-tog">FT+IN</span>
                </div>
              </div>
              
              <div id="h-input-cm" class="height-input-group">
                <input type="number" id="bmi-h-cm" placeholder="170" value="170" class="bmi-main-input">
                <span class="unit-tag">cm</span>
              </div>

              <div id="h-input-ft" class="height-input-group" style="display:none;">
                <input type="number" id="bmi-h-ft" placeholder="5" class="bmi-sub-input"> <span class="unit-tag-sm">ft</span>
                <input type="number" id="bmi-h-in" placeholder="7" class="bmi-sub-input"> <span class="unit-tag-sm">in</span>
              </div>
              
              <input type="range" id="bmi-h-range" min="100" max="250" value="170" class="bmi-slider">
            </div>

            <div class="bmi-form-group">
              <div class="label-row">
                <label>Weight</label>
                <div class="unit-toggle-text">
                  <span id="w-unit-kg" class="u-tog active">KG</span> / 
                  <span id="w-unit-lb" class="u-tog">LBS</span>
                </div>
              </div>

              <div class="weight-input-wrapper">
                <button class="adjust-btn minus"><i class="fas fa-minus"></i></button>
                <div class="main-val-box">
                    <input type="number" id="bmi-w-main" value="70" class="bmi-main-input centered">
                    <span class="unit-tag" id="bmi-w-tag">kg</span>
                </div>
                <button class="adjust-btn plus"><i class="fas fa-plus"></i></button>
              </div>
            </div>

            <button id="action-btn" class="bmi-calculate-btn">Calculate Details</button>
          </div>

          <div class="bmi-result-card">
            <div class="bmi-gauge-container">
              <div class="gauge-header">
                <span class="bmi-score-label">Your BMI Score</span>
                <h1 id="bmi-score-val">--.--</h1>
                <div id="bmi-category-badge" class="bmi-badge normal">Normal Weight</div>
              </div>
              
              <div class="gauge-bar-wrapper">
                <div class="gauge-bar"></div>
                <div id="gauge-marker" class="gauge-marker" style="left: 0%;"></div>
                
                <div class="gauge-ticks">
                   <span class="tick t-18">18.5</span>
                   <span class="tick t-25">25.0</span>
                   <span class="tick t-30">30.0</span>
                </div>
              </div>
              
              <p id="bmi-feedback-text" class="bmi-feedback">Enter your details to see your health status.</p>
            </div>

            <div class="bmi-stats-grid">
              <div class="bmi-stat-box">
                <i class="fas fa-weight-hanging" style="color:#3498db;"></i>
                <div class="stat-content">
                    <span class="s-label">Healthy Range</span>
                    <span class="s-val" id="ideal-weight-range">-- - -- kg</span>
                </div>
              </div>
              <div class="bmi-stat-box">
                <i class="fas fa-exchange-alt" style="color:#e67e22;"></i>
                <div class="stat-content">
                    <span class="s-label">To Reach Normal</span>
                    <span class="s-val" id="weight-diff">0 kg</span>
                </div>
              </div>
            </div>
            
            <div class="bmi-info-table-wrapper">
                <button class="toggle-table-btn" onclick="document.getElementById('bmi-ref-table').classList.toggle('show')">
                    View BMI Classification Table <i class="fas fa-chevron-down"></i>
                </button>
                <div id="bmi-ref-table" class="bmi-ref-table">
                    </div>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  // 2. Initialize Events
  init: function () {
    const $ = (id) => document.getElementById(id);
    const q = (sel) => document.querySelector(sel);
    const qa = (sel) => document.querySelectorAll(sel);

    let state = {
      gender: "male",
      standard: "who", // 'who' or 'asian'
      hUnit: "cm", // 'cm' or 'ft'
      wUnit: "kg", // 'kg' or 'lb'
      h_cm: 170,
      w_kg: 70
    };

    // --- helper: Render Reference Table ---
    const renderTable = () => {
      const isAsian = state.standard === 'asian';
      const tbl = $('bmi-ref-table');
      // Asian standards usually: <18.5 Under, 18.5-22.9 Normal, 23-24.9 Overweight (At Risk), >25 Obese
      // WHO standards: <18.5 Under, 18.5-24.9 Normal, 25-29.9 Overweight, >30 Obese
      
      let rows = '';
      if(isAsian) {
         rows = `
            <div class="row header"><span class="c1">Category</span><span class="c2">BMI Range (kg/m²)</span></div>
            <div class="row c-under"><span class="c1">Underweight</span><span class="c2">&lt; 18.5</span></div>
            <div class="row c-normal"><span class="c1">Normal</span><span class="c2">18.5 - 22.9</span></div>
            <div class="row c-over"><span class="c1">Overweight</span><span class="c2">23.0 - 24.9</span></div>
            <div class="row c-obese"><span class="c1">Obese I</span><span class="c2">25.0 - 29.9</span></div>
            <div class="row c-obese-2"><span class="c1">Obese II</span><span class="c2">&ge; 30.0</span></div>
         `;
      } else {
         rows = `
            <div class="row header"><span class="c1">Category</span><span class="c2">BMI Range (kg/m²)</span></div>
            <div class="row c-under"><span class="c1">Underweight</span><span class="c2">&lt; 18.5</span></div>
            <div class="row c-normal"><span class="c1">Normal</span><span class="c2">18.5 - 24.9</span></div>
            <div class="row c-over"><span class="c1">Overweight</span><span class="c2">25.0 - 29.9</span></div>
            <div class="row c-obese"><span class="c1">Obese I</span><span class="c2">30.0 - 34.9</span></div>
            <div class="row c-obese-2"><span class="c1">Obese II</span><span class="c2">&ge; 35.0</span></div>
         `;
      }
      tbl.innerHTML = rows;
      
      // Update Ticks on Gauge
      const t25 = document.querySelector('.tick.t-25');
      const t30 = document.querySelector('.tick.t-30');
      if(t25 && t30) {
        if(isAsian) {
            t25.innerText = "23.0";
            t25.style.left = "45%"; // Adjust visual position logic if strictly mapping
            t30.innerText = "25.0";
            t30.style.left = "60%";
        } else {
            t25.innerText = "25.0";
            t25.style.left = "50%";
            t30.innerText = "30.0";
            t30.style.left = "75%";
        }
      }
    };

    // --- Event: Standard Switch ---
    qa('#bmi-std-control .seg-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        qa('#bmi-std-control .seg-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.standard = e.target.dataset.value;
        renderTable();
        this.calculate();
      });
    });

    // --- Event: Gender Switch ---
    qa('.gender-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        qa('.gender-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gender = btn.dataset.value;
        this.calculate(); // Recalculate if we add gender specific logic later
      });
    });

    // --- Logic: Height Unit Toggle ---
    const toggleHeightUnit = (unit) => {
      state.hUnit = unit;
      $('h-unit-cm').classList.toggle('active', unit === 'cm');
      $('h-unit-ft').classList.toggle('active', unit === 'ft');
      
      if(unit === 'cm') {
        $('h-input-cm').style.display = 'flex';
        $('h-input-ft').style.display = 'none';
        // Convert stored CM to inputs
        $('bmi-h-cm').value = Math.round(state.h_cm);
        $('bmi-h-range').value = Math.round(state.h_cm);
      } else {
        $('h-input-cm').style.display = 'none';
        $('h-input-ft').style.display = 'flex';
        // Convert stored CM to FT/IN
        const totalIn = state.h_cm / 2.54;
        const ft = Math.floor(totalIn / 12);
        const inch = Math.round(totalIn % 12);
        $('bmi-h-ft').value = ft;
        $('bmi-h-in').value = inch;
      }
    };

    $('h-unit-cm').onclick = () => toggleHeightUnit('cm');
    $('h-unit-ft').onclick = () => toggleHeightUnit('ft');

    // --- Logic: Weight Unit Toggle ---
    const toggleWeightUnit = (unit) => {
      state.wUnit = unit;
      $('w-unit-kg').classList.toggle('active', unit === 'kg');
      $('w-unit-lb').classList.toggle('active', unit === 'lb');
      $('bmi-w-tag').innerText = unit;

      if(unit === 'kg') {
         $('bmi-w-main').value = state.w_kg.toFixed(1);
      } else {
         $('bmi-w-main').value = (state.w_kg * 2.20462).toFixed(1);
      }
    };

    $('w-unit-kg').onclick = () => toggleWeightUnit('kg');
    $('w-unit-lb').onclick = () => toggleWeightUnit('lb');

    // --- Sync Inputs (Real-time) ---
    // 1. Height CM
    $('bmi-h-cm').addEventListener('input', (e) => {
        state.h_cm = parseFloat(e.target.value) || 0;
        $('bmi-h-range').value = state.h_cm;
        this.calculate();
    });
    // 2. Height Range
    $('bmi-h-range').addEventListener('input', (e) => {
        state.h_cm = parseFloat(e.target.value);
        $('bmi-h-cm').value = state.h_cm;
        this.calculate();
    });
    // 3. Height Ft/In
    const updateHeightFromFt = () => {
        const ft = parseFloat($('bmi-h-ft').value) || 0;
        const inc = parseFloat($('bmi-h-in').value) || 0;
        state.h_cm = (ft * 30.48) + (inc * 2.54);
        this.calculate();
    };
    $('bmi-h-ft').addEventListener('input', updateHeightFromFt);
    $('bmi-h-in').addEventListener('input', updateHeightFromFt);

    // 4. Weight
    $('bmi-w-main').addEventListener('input', (e) => {
        let val = parseFloat(e.target.value) || 0;
        if(state.wUnit === 'kg') state.w_kg = val;
        else state.w_kg = val / 2.20462;
        this.calculate();
    });

    // 5. Weight +/- Buttons
    q('.adjust-btn.plus').onclick = () => {
        let el = $('bmi-w-main');
        let val = parseFloat(el.value) || 0;
        el.value = (val + 1).toFixed(1);
        el.dispatchEvent(new Event('input'));
    };
    q('.adjust-btn.minus').onclick = () => {
        let el = $('bmi-w-main');
        let val = parseFloat(el.value) || 0;
        if(val > 1) {
            el.value = (val - 1).toFixed(1);
            el.dispatchEvent(new Event('input'));
        }
    };

    // Calculate Button (optional as we do realtime, but good for mobile UX)
    $('action-btn').onclick = () => this.calculate();

    // Initial Setup
    renderTable();
    this.calculate();
  },

  // 3. Calculation Logic
  calculate: function () {
    const $ = (id) => document.getElementById(id);
    
    // Get current values from state logic implicitly via DOM or reconstruction
    // To ensure accuracy, let's grab directly from the 'state' variable maintained in Init scope? 
    // Actually, simpler to pull from DOM active inputs to be purely reactive.
    
    let h_m = 0;
    let w_kg = 0;

    // HEIGHT
    if($('h-unit-cm').classList.contains('active')) {
        h_m = (parseFloat($('bmi-h-cm').value) || 0) / 100;
    } else {
        const ft = parseFloat($('bmi-h-ft').value) || 0;
        const inc = parseFloat($('bmi-h-in').value) || 0;
        h_m = ((ft * 30.48) + (inc * 2.54)) / 100;
    }

    // WEIGHT
    const w_val = parseFloat($('bmi-w-main').value) || 0;
    if($('w-unit-kg').classList.contains('active')) {
        w_kg = w_val;
    } else {
        w_kg = w_val / 2.20462;
    }

    if(h_m <= 0 || w_kg <= 0) return;

    // --- BMI Formula ---
    const bmi = w_kg / (h_m * h_m);
    const bmiFixed = bmi.toFixed(1);

    // --- Determine Standard ---
    const std = document.querySelector('#bmi-std-control .active').dataset.value;
    const isAsian = std === 'asian';

    // --- Classification Logic ---
    let category = "";
    let colorClass = "";
    let minNormal = 18.5;
    let maxNormal = isAsian ? 22.9 : 24.9;
    let gaugePercent = 0;

    if (bmi < 18.5) {
        category = "Underweight";
        colorClass = "under"; // Blue/Yellow
        // Gauge mapping: 0-18.5 maps to 0-25%
        gaugePercent = (bmi / 18.5) * 25;
    } else if (bmi <= maxNormal) {
        category = "Normal Weight";
        colorClass = "normal"; // Green
        // Gauge mapping: 18.5 - maxNormal maps to 25% - 50%
        let range = maxNormal - 18.5;
        gaugePercent = 25 + ((bmi - 18.5) / range) * 25;
    } else if (bmi <= (isAsian ? 24.9 : 29.9)) {
        category = "Overweight";
        colorClass = "over"; // Orange
        // Gauge mapping: maxNormal - limit maps to 50% - 75%
        let limit = isAsian ? 24.9 : 29.9;
        let range = limit - maxNormal;
        gaugePercent = 50 + ((bmi - maxNormal) / range) * 25;
    } else {
        category = "Obese";
        colorClass = "obese"; // Red
        // Gauge mapping: > limit maps to 75% - 100%
        // Cap at 40 BMI for visual logic
        let limit = isAsian ? 24.9 : 29.9;
        gaugePercent = 75 + ((bmi - limit) / (40 - limit)) * 25;
        if(gaugePercent > 100) gaugePercent = 100;
    }

    // --- Ideal Weight Calc ---
    const minIdealKg = 18.5 * (h_m * h_m);
    const maxIdealKg = maxNormal * (h_m * h_m);
    
    // Format Ideal Weight
    let idealStr = "";
    let diffStr = "";
    
    // Weight Difference
    let diff = 0;
    if (bmi < 18.5) {
        diff = minIdealKg - w_kg;
        diffStr = `Gain ${diff.toFixed(1)} kg`;
    } else if (bmi > maxNormal) {
        diff = w_kg - maxIdealKg;
        diffStr = `Lose ${diff.toFixed(1)} kg`;
    } else {
        diffStr = "You are perfect!";
    }

    // Output Conversion for Ideal Weight Display
    if($('w-unit-lb').classList.contains('active')) {
        idealStr = `${(minIdealKg * 2.20462).toFixed(1)} - ${(maxIdealKg * 2.20462).toFixed(1)} lbs`;
        if(diff !== 0 && typeof diff === 'number') {
            let diffLb = diff * 2.20462;
            diffStr = `${diffStr.split(' ')[0]} ${diffLb.toFixed(1)} lbs`; 
        }
    } else {
        idealStr = `${minIdealKg.toFixed(1)} - ${maxIdealKg.toFixed(1)} kg`;
    }

    // --- DOM Updates ---
    $('bmi-score-val').innerText = bmiFixed;
    $('bmi-score-val').style.color = `var(--bmi-${colorClass})`;
    
    const badge = $('bmi-category-badge');
    badge.innerText = category;
    badge.className = `bmi-badge ${colorClass}`;
    
    $('gauge-marker').style.left = `${gaugePercent}%`;
    
    // Feedback text
    const feedback = {
        "Underweight": "You are in the underweight range. It might be helpful to consult a nutritionist.",
        "Normal Weight": "Great job! You are in the healthy weight range.",
        "Overweight": "You are slightly above the healthy range. Small changes can help.",
        "Obese": "Your health might be at risk. Consider consulting a healthcare provider."
    };
    $('bmi-feedback-text').innerText = feedback[category];
    
    $('ideal-weight-range').innerText = idealStr;
    $('weight-diff').innerText = diffStr;

  }
};