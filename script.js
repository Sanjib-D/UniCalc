if (!window.AppCalculators) window.AppCalculators = {};

const calculatorData = [
  {
    category: "Basic & Daily Use",
    catId: "category_1",
    icon: "fa-calculator",
    tools: [
      { name: "Normal Calculator", id: "normal_calc" },
      { name: "Scientific Calculator", id: "sci_calc" },
      { name: "Age Calculator", id: "age_calc" },
      { name: "Date Difference", id: "date_diff_calc" },
      { name: "Time Calculator (Add/Sub)", id: "time_calc" },
      { name: "Percentage Calculator", id: "percent_calc" },
      { name: "Discount Calculator", id: "discount_calc" },
      { name: "Grade / GPA Calculator", id: "gpa_calc" },
    ],
  },
  {
    category: "Financial",
    catId: "category_2",
    icon: "fa-coins",
    tools: [
      { name: "Loan / EMI Calculator", id: "loan_calc" },
      { name: "Mortgage Calculator", id: "mortgage_calc" },
      { name: "SIP Calculator", id: "sip_calc" },
      { name: "GST / VAT Calculator", id: "gst_calc" },
      { name: "Salary Tax Estimator", id: "tax_calc" },
      { name: "Currency Converter", id: "currency_calc" },
      { name: "Simple & Compound Interest", id: "interest_calc" },
      { name: "Retirement Planner", id: "retirement_calc" },
      { name: "Credit Card Payoff", id: "cc_payoff_calc" },
      { name: "Inflation Calculator", id: "inflation_calc" },
      { name: "Savings Goal", id: "savings_goal_calc" },
    ],
  },
  {
    category: "Health & Fitness",
    catId: "category_3",
    icon: "fa-heartbeat",
    tools: [
      { name: "BMI Calculator", id: "bmi_calc" },
      { name: "BMR & TDEE Calculator", id: "bmr_calc" },
      { name: "Body Fat Percentage", id: "body_fat_calc" },
      { name: "Daily Calorie Needs", id: "calorie_calc" },
      { name: "Water Intake Calculator", id: "water_calc" },
      { name: "Ideal Weight Calculator", id: "ideal_weight_calc" },
      { name: "Pregnancy Due Date", id: "pregnancy_calc" },
      { name: "Period / Ovulation Tracker", id: "ovulation_calc" },
      { name: "Sleep Cycle Calculator", id: "sleep_calc" },
    ],
  },
  {
    category: "Utility & Daily Life",
    catId: "category_4",
    icon: "fa-mug-hot",
    tools: [
      { name: "Tip & Split Bill", id: "tip_calc" },
      { name: "Fuel Cost & Mileage", id: "fuel_calc" },
      { name: "Electricity Bill Estimator", id: "bill_calc" },
      { name: "Cooking Converter (Cups to ML)", id: "cooking_calc" },
      { name: "Password Generator", id: "pass_gen" },
      { name: "Internet Speed Test (Est)", id: "net_speed_calc" },
      { name: "Stopwatch & Timer", id: "stopwatch_tool" },
      { name: "Counter / Tally", id: "counter_tool" },
      { name: "Case Converter (Text)", id: "case_conv" },
    ],
  },
  {
    category: "Unit Converters",
    catId: "category_5",
    icon: "fa-ruler-combined",
    tools: [
      { name: "Length Converter", id: "length_calc" },
      { name: "Weight / Mass Converter", id: "weight_calc" },
      { name: "Temperature Converter", id: "temp_calc" },
      { name: "Speed Converter", id: "speed_calc" },
      { name: "Area & Volume Converter", id: "area_vol_calc" },
      { name: "Digital Storage (MB/GB)", id: "data_calc" },
      { name: "Pressure Converter", id: "pressure_calc" },
    ],
  },
  {
    category: "Math & Geometry",
    catId: "category_6",
    icon: "fa-square-root-alt",
    tools: [
      { name: "Area Calculator (Shapes)", id: "area_shape_calc" },
      { name: "Volume Calculator (3D)", id: "volume_geom_calc" },
      { name: "Quadratic Equation Solver", id: "quadratic_calc" },
      { name: "Factorial Calculator", id: "factorial_calc" },
      { name: "Prime Number Checker", id: "prime_calc" },
      { name: "GCD & LCM Finder", id: "gcd_lcm_calc" },
      { name: "Fraction Calculator", id: "fraction_calc" },
      { name: "Ratio Calculator", id: "ratio_calc" },
    ],
  },
  {
    category: "Technology & Coding",
    catId: "category_7",
    icon: "fa-laptop-code",
    tools: [
      { name: "Binary <-> Decimal", id: "binary_calc" },
      { name: "Hex <-> Binary", id: "hex_calc" },
      { name: "Base64 Encoder/Decoder", id: "base64_tool" },
      { name: "Password Strength Checker", id: "pass_strength_tool" },
      { name: "String Length Counter", id: "str_len_tool" },
      { name: "JSON Formatter", id: "json_fmt_tool" },
      { name: "Image Resolution / Pixels", id: "pixel_calc" },
    ],
  },
  {
    category: "Travel & Vehicle",
    catId: "category_8",
    icon: "fa-plane-departure",
    tools: [
      { name: "Trip Cost Estimator", id: "trip_cost_calc" },
      { name: "EV Charging Cost", id: "ev_cost_calc" },
      { name: "Speed / Distance / Time", id: "sdt_calc" },
      { name: "Toll Cost Estimator", id: "toll_calc" },
      { name: "Time Zone Difference", id: "timezone_calc" },
    ],
  },
  {
    category: "Shopping & Budget",
    catId: "category_9",
    icon: "fa-shopping-cart",
    tools: [
      { name: "Unit Price Comparison", id: "unit_price_calc" },
      { name: "Sales Tax / VAT", id: "sales_tax_calc" },
      { name: "Discount & Markdown", id: "markdown_calc" },
      { name: "Subscription Cost Manager", id: "sub_cost_calc" },
      { name: "Budget Planner", id: "budget_calc" },
    ],
  },
  {
    category: "Premium & Unique",
    catId: "category_10",
    icon: "fa-crown",
    tools: [
      { name: "Love Compatibility", id: "love_calc" },
      { name: "Zodiac Sign Finder", id: "zodiac_calc" },
      { name: "Life Expectancy Est.", id: "life_exp_calc" },
      { name: "Carbon Footprint", id: "carbon_calc" },
      { name: "Productivity Time Blocker", id: "prod_timer" },
      { name: "Relationship Anniversary", id: "anniversary_calc" },
      { name: "Random Number Generator", id: "rng_calc" },
      { name: "Dice Roller 3D", id: "dice_calc" },
    ],
  },
];

const homeContainer = document.querySelector(".home-container");
const categoryGrid = document.getElementById("category-grid");
const subCatList = document.getElementById("sub-cat-list");
const subDisplay = document.getElementById("sub-category-container");
const calcInterface = document.getElementById("calculator-interface");
const mainTitle = document.getElementById("main-title");
const searchInput = document.getElementById("search-input");
const subDesc = document.getElementById("sub-desc");

function renderCategories() {
  categoryGrid.innerHTML = "";
  calculatorData.forEach((cat) => {
    const div = document.createElement("div");
    div.className = "cat-card";
    div.dataset.id = cat.catId;
    div.onclick = () => showSubCategories(cat.catId);
    div.innerHTML = `
            <i class="fas ${cat.icon}"></i>
            <h3>${cat.category}</h3>
            <p>${cat.tools.length} Tools</p>
        `;
    categoryGrid.appendChild(div);
  });
}

function showSubCategories(catId) {
  const selectedCat = calculatorData.find((c) => c.catId === catId);
  if (!selectedCat) return;

  homeContainer.classList.add("sidebar-active");

  calcInterface.style.display = "none";
  subDisplay.style.display = "block";

  document.querySelectorAll(".cat-card").forEach((card) => {
    card.classList.remove("active-cat");
    if (card.dataset.id === catId) card.classList.add("active-cat");
  });

  mainTitle.innerText = selectedCat.category;
  subDesc.innerText = "Choose a calculator from the list below";

  if (selectedCat.tools.length === 0) {
    subCatList.innerHTML = "<p>Coming soon...</p>";
  } else {
    subCatList.innerHTML = selectedCat.tools
      .map(
        (tool) => `
            <div class="tool-link" onclick="loadCalculator('${catId}', '${tool.id}', '${tool.name}')">
                <span><i class="fas fa-chevron-right" style="font-size:0.8rem; margin-right:10px; color:#aaa;"></i> ${tool.name}</span>
                <i class="fas fa-arrow-right" style="color: #007bff;"></i>
            </div>
        `
      )
      .join("");
  }
}

function loadCalculator(catId, toolId, toolName) {
  subDisplay.style.display = "none";
  calcInterface.style.display = "block";
  document.getElementById("calc-title").innerText = toolName;

  // --- NEW: Dynamic CSS Loading Logic ---
  const cssId = `css-${catId}`; // Unique ID for this category's CSS
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = `style/${catId}.css`; // Path to your new CSS folder
    link.media = "all";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  // --------------------------------------

  const contentDiv = document.getElementById("calc-content");
  const resultDiv = document.getElementById("calc-result");

  contentDiv.innerHTML = "";
  resultDiv.style.display = "none";
  resultDiv.innerHTML = "";

  if (window.AppCalculators[catId] && window.AppCalculators[catId][toolId]) {
    renderToolInterface(catId, toolId, contentDiv, resultDiv);
  } else {
    const catIndex = calculatorData.findIndex((c) => c.catId === catId);
    const toolIndex = calculatorData[catIndex].tools.findIndex(
      (t) => t.id === toolId
    );

    const fileNumber = (catIndex + 1) * 100 + (toolIndex + 1);
    const fileName = `main/category_${fileNumber}.js`;

    contentDiv.innerHTML = `
      <div style="text-align:center; padding: 40px; color: #666;">
        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #007bff; margin-bottom: 10px;"></i>
        <p>Loading Tool...</p>
      </div>`;

    const script = document.createElement("script");
    script.src = fileName;

    script.onload = () => {
      if (window.AppCalculators[catId] && window.AppCalculators[catId][toolId]) {
        renderToolInterface(catId, toolId, contentDiv, resultDiv);
      } else {
        showConstructionMsg(contentDiv, toolName, fileName);
      }
    };

    script.onerror = () => {
      showConstructionMsg(contentDiv, toolName, fileName);
    };

    document.body.appendChild(script);
  }
}

function renderToolInterface(catId, toolId, contentDiv, resultDiv) {
  const toolObj = window.AppCalculators[catId][toolId];

  if (typeof toolObj.getHtml === "function") {
    contentDiv.innerHTML = toolObj.getHtml();
  }

  if (typeof toolObj.init === "function") {
    try {
      toolObj.init();
    } catch (e) {
      console.error("Init Error:", e);
    }
  }

  const btn = contentDiv.querySelector("#action-btn");
  if (btn && typeof toolObj.calculate === "function") {
    btn.onclick = () => {
      try {
        const result = toolObj.calculate();
        if (result) {
          resultDiv.style.display = "block";
          resultDiv.innerHTML = result;
        }
      } catch (e) {
        alert("Error in calculation.");
        console.error(e);
      }
    };
  }
}

function showConstructionMsg(contentDiv, toolName, fileName) {
  contentDiv.innerHTML = `
        <div style="text-align:center; padding: 30px; color: #666;">
            <i class="fas fa-tools" style="font-size: 3rem; margin-bottom: 15px; color: #ddd;"></i>
            <h3>Under Construction</h3>
            <p>The file <code>${fileName}</code> was not found or has no logic yet.</p>
        </div>`;
}

function closeCalculator() {
  calcInterface.style.display = "none";
  subDisplay.style.display = "block";
}

function goBackToCategories() {
  homeContainer.classList.remove("sidebar-active");
  calcInterface.style.display = "none";
  subDisplay.style.display = "none";
  document
    .querySelectorAll(".cat-card")
    .forEach((c) => c.classList.remove("active-cat"));
  if (searchInput.value) {
    searchInput.value = "";
    renderCategories();
  }
}

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();

  if (term.length > 0) {
    homeContainer.classList.add("sidebar-active");
    mainTitle.innerText = `Search Results for "${e.target.value}"`;
    subDesc.innerText = "Calculators matching your search";

    document
      .querySelectorAll(".cat-card")
      .forEach((c) => c.classList.remove("active-cat"));

    let results = [];
    calculatorData.forEach((cat) => {
      cat.tools.forEach((tool) => {
        if (tool.name.toLowerCase().includes(term)) {
          results.push({
            ...tool,
            catId: cat.catId,
            categoryName: cat.category,
          });
        }
      });
    });

    if (results.length > 0) {
      subCatList.innerHTML = results
        .map(
          (tool) => `
            <div class="tool-link" onclick="loadCalculator('${tool.catId}', '${tool.id}', '${tool.name}')">
                <div>
                    <strong>${tool.name}</strong><br>
                    <small style="color:grey; font-size:0.8rem;">in ${tool.categoryName}</small>
                </div>
                <i class="fas fa-arrow-right"></i>
            </div>
        `
        )
        .join("");
    } else {
      subCatList.innerHTML = `<div style="text-align:center; padding:20px; color:grey;">No calculators found.</div>`;
    }
  } else {
    goBackToCategories();
  }
});

document.addEventListener("DOMContentLoaded", renderCategories);