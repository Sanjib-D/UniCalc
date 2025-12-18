/**
 * Category 502: Weight / Mass Converter
 * High-Precision Bi-directional conversion with modern UI hooks.
 */
if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_5) window.AppCalculators.category_5 = {};

window.AppCalculators.category_5.weight_calc = {
  units: {
    microgram: { name: "Microgram", symbol: "µg", factor: 0.000001 },
    milligram: { name: "Milligram", symbol: "mg", factor: 0.001 },
    gram: { name: "Gram", symbol: "g", factor: 1 },
    kilogram: { name: "Kilogram", symbol: "kg", factor: 1000 },
    metric_ton: { name: "Metric Ton", symbol: "t", factor: 1000000 },
    ounce: { name: "Ounce", symbol: "oz", factor: 28.349523125 },
    pound: { name: "Pound", symbol: "lb", factor: 453.59237 },
    stone: { name: "Stone", symbol: "st", factor: 6350.29318 },
    short_ton: { name: "Short Ton (US)", symbol: "ton", factor: 907184.74 },
    long_ton: { name: "Long Ton (UK)", symbol: "ton", factor: 1016046.91 },
    carat: { name: "Carat", symbol: "ct", factor: 0.2 },
    grain: { name: "Grain", symbol: "gr", factor: 0.06479891 },
  },

  getHtml: function () {
    return `
        <div class="weight-hero-container">
            <div class="weight-glass-card">
                <div class="weight-header-badge">
                    <i class="fas fa-balance-scale"></i> Precision Mass Engine
                </div>
                
                <div class="weight-converter-grid">
                    <div class="input-panel">
                        <div class="unit-selector-wrapper">
                            <select id="weight-u1"></select>
                        </div>
                        <input type="number" id="weight-v1" class="main-input" value="1" step="any">
                        <div class="unit-label" id="label-u1">Kilograms</div>
                    </div>

                    <div class="swap-zone">
                        <button id="weight-swap" class="glow-swap-btn">
                            <i class="fas fa-retweet"></i>
                        </button>
                    </div>

                    <div class="input-panel highlight">
                        <div class="unit-selector-wrapper">
                            <select id="weight-u2"></select>
                        </div>
                        <input type="number" id="weight-v2" class="main-input" step="any">
                        <div class="unit-label" id="label-u2">Pounds</div>
                    </div>
                </div>

                <div class="weight-action-bar">
                    <div class="precision-pill">
                        <span>Precision: <b id="weight-prec-val">4</b></span>
                        <input type="range" id="weight-prec" min="0" max="10" value="4">
                    </div>
                    <div class="btn-group">
                        <button id="weight-copy" title="Copy Result"><i class="fas fa-copy"></i></button>
                        <button id="weight-reset" title="Reset"><i class="fas fa-undo"></i></button>
                    </div>
                </div>
            </div>

            <div class="weight-stats-grid">
                <div class="stat-card glass-glow">
                    <h4><i class="fas fa-equals"></i> Equivalent Units</h4>
                    <div id="weight-multi-list" class="multi-unit-flex"></div>
                </div>
                <div class="stat-card glass-glow">
                    <h4><i class="fas fa-info-circle"></i> Insight</h4>
                    <div id="weight-formula" class="insight-box"></div>
                    <p class="disclaimer">Standard: International Avoirdupois and SI Metric.</p>
                </div>
            </div>
        </div>
        `;
  },

  init: function () {
    const u1 = document.getElementById("weight-u1");
    const u2 = document.getElementById("weight-u2");
    const v1 = document.getElementById("weight-v1");
    const v2 = document.getElementById("weight-v2");
    const prec = document.getElementById("weight-prec");

    Object.keys(this.units).forEach((key) => {
      const unit = this.units[key];
      u1.add(new Option(unit.name, key));
      u2.add(new Option(unit.name, key));
    });

    u1.value = "kilogram";
    u2.value = "pound";

    const sync = (src) => {
      const unit1 = this.units[u1.value];
      const unit2 = this.units[u2.value];
      const p = parseInt(prec.value);
      document.getElementById("weight-prec-val").innerText = p;
      document.getElementById("label-u1").innerText = unit1.name;
      document.getElementById("label-u2").innerText = unit2.name;

      if (src === 1) {
        const res = (parseFloat(v1.value) * unit1.factor) / unit2.factor;
        v2.value = isNaN(res) ? "" : this.format(res, p);
      } else {
        const res = (parseFloat(v2.value) * unit2.factor) / unit1.factor;
        v1.value = isNaN(res) ? "" : this.format(res, p);
      }
      this.updateInsights(unit1, unit2, v1.value, p);
    };

    v1.oninput = () => sync(1);
    v2.oninput = () => sync(2);
    u1.onchange = () => sync(1);
    u2.onchange = () => sync(1);
    prec.oninput = () => sync(1);

    document.getElementById("weight-swap").onclick = () => {
      [u1.value, u2.value] = [u2.value, u1.value];
      sync(1);
    };

    document.getElementById("weight-reset").onclick = () => {
      v1.value = 1;
      sync(1);
    };

    document.getElementById("weight-copy").onclick = () => {
      const text = `${v1.value} ${this.units[u1.value].symbol} = ${v2.value} ${
        this.units[u2.value].symbol
      }`;
      navigator.clipboard.writeText(text);
    };

    sync(1);
  },

  format: (n, p) =>
    Math.abs(n) < 1e-4 && n !== 0
      ? n.toExponential(p)
      : parseFloat(n.toFixed(p)),

  updateInsights: function (u1, u2, val, p) {
    const factor = u1.factor / u2.factor;
    document.getElementById("weight-formula").innerHTML = `1 ${
      u1.symbol
    } = ${this.format(factor, 6)} ${u2.symbol}`;

    const base = (parseFloat(val) || 0) * u1.factor;
    const keys = ["gram", "kilogram", "pound", "ounce", "metric_ton"];
    document.getElementById("weight-multi-list").innerHTML = keys
      .map((k) => {
        const unit = this.units[k];
        return `<div class="pill"><b>${this.format(
          base / unit.factor,
          p
        )}</b> ${unit.symbol}</div>`;
      })
      .join("");
  },
};
