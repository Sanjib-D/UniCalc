const calculatorData = [
  {
    category: "Basic & Daily Use",
    id: "basic",
    icon: "fa-calculator",
    tools: [
      {
        name: "Normal Calculator",
        url: "./Calculators/Basic & Daily Use/Normal Calculator/index.html",
      },
      {
        name: "Scientific Calculator",
        url: "./Calculators/Basic & Daily Use/Scientific Calculator/index.html",
      },
      { name: "Age Calculator", url: "./Calculators/Basic & Daily Use/" },
      { name: "Discount Calculator", url: "./Calculators/Basic & Daily Use/" },
      {
        name: "Percentage Calculator",
        url: "./Calculators/Basic & Daily Use/",
      },
      {
        name: "Simple & Compound Interest",
        url: "./Calculators/Basic & Daily Use/",
      },
      { name: "EMI Calculator", url: "./Calculators/Basic & Daily Use/" },
      {
        name: "Salary Tax Calculator",
        url: "./Calculators/Basic & Daily Use/",
      },
      {
        name: "GST Calculator (India)",
        url: "./Calculators/Basic & Daily Use/",
      },
    ],
  },
  {
    category: "Financial",
    id: "financial",
    icon: "fa-coins",
    tools: [
      { name: "Loan Calculator", url: "calculators/financial/Loan/index.html" },
      {
        name: "Mortgage Calculator",
        url: "calculators/financial/Mortgage/index.html",
      },
      { name: "SIP Calculator", url: "calculators/financial/SIP/index.html" },
      {
        name: "Investment Return",
        url: "calculators/financial/Investment/index.html",
      },
      {
        name: "Retirement Calculator",
        url: "calculators/financial/Retirement/index.html",
      },
      { name: "Savings Goal", url: "calculators/financial/Savings/index.html" },
      {
        name: "Credit Card Payoff",
        url: "calculators/financial/CreditCard/index.html",
      },
      {
        name: "Inflation Calculator",
        url: "calculators/financial/Inflation/index.html",
      },
      {
        name: "Currency Exchange",
        url: "calculators/financial/Currency/index.html",
      },
    ],
  },
  {
    category: "Health & Fitness",
    id: "health",
    icon: "fa-heartbeat",
    tools: [
      { name: "BMI Calculator", url: "calculators/health/BMI/index.html" },
      { name: "BMR Calculator", url: "calculators/health/BMR/index.html" },
      { name: "Calorie Intake", url: "calculators/health/Calorie/index.html" },
      {
        name: "Body Fat Percentage",
        url: "calculators/health/BodyFat/index.html",
      },
      {
        name: "Ideal Weight",
        url: "calculators/health/IdealWeight/index.html",
      },
      { name: "Water Intake", url: "calculators/health/Water/index.html" },
      {
        name: "Pregnancy Due-Date",
        url: "calculators/health/Pregnancy/index.html",
      },
    ],
  },
  {
    category: "Utility & Daily Life",
    id: "utility",
    icon: "fa-mug-hot",
    tools: [
      { name: "Tip Calculator", url: "calculators/utility/Tip/index.html" },
      {
        name: "Split Bill Calculator",
        url: "calculators/utility/SplitBill/index.html",
      },
      {
        name: "Fuel Efficiency",
        url: "calculators/utility/FuelEfficiency/index.html",
      },
      {
        name: "Electricity Bill",
        url: "calculators/utility/Electricity/index.html",
      },
      { name: "Water Bill", url: "calculators/utility/WaterBill/index.html" },
      {
        name: "Cooking Converter",
        url: "calculators/utility/Cooking/index.html",
      },
      {
        name: "Time Duration",
        url: "calculators/utility/TimeDuration/index.html",
      },
    ],
  },
  {
    category: "Unit Converters",
    id: "unit_converters",
    icon: "fa-ruler-combined",
    tools: [
      {
        name: "Length Converter",
        url: "calculators/unit_converters/Length/index.html",
      },
      {
        name: "Weight Converter",
        url: "calculators/unit_converters/Weight/index.html",
      },
      {
        name: "Temperature Converter",
        url: "calculators/unit_converters/Temperature/index.html",
      },
      {
        name: "Speed Converter",
        url: "calculators/unit_converters/Speed/index.html",
      },
      {
        name: "Area & Volume Converter",
        url: "calculators/unit_converters/AreaVolume/index.html",
      },
      {
        name: "Data Storage Converter",
        url: "calculators/unit_converters/DataStorage/index.html",
      },
      {
        name: "Pressure Converter",
        url: "calculators/unit_converters/Pressure/index.html",
      },
    ],
  },
  {
    category: "Math & Geometry",
    id: "math",
    icon: "fa-square-root-alt",
    tools: [
      { name: "Area Calculator", url: "calculators/math/Area/index.html" },
      { name: "Volume Calculator", url: "calculators/math/Volume/index.html" },
      {
        name: "Quadratic Equation",
        url: "calculators/math/Quadratic/index.html",
      },
      {
        name: "Factorial Finder",
        url: "calculators/math/Factorial/index.html",
      },
      {
        name: "Prime Number Checker",
        url: "calculators/math/Prime/index.html",
      },
      {
        name: "Percentage to Decimal",
        url: "calculators/math/PercentToDecimal/index.html",
      },
      { name: "Ratio Calculator", url: "calculators/math/Ratio/index.html" },
    ],
  },
  {
    category: "Technology & Coding",
    id: "tech",
    icon: "fa-laptop-code",
    tools: [
      {
        name: "Binary ⇆ Decimal",
        url: "calculators/tech/BinaryDecimal/index.html",
      },
      { name: "Hex ⇆ Binary", url: "calculators/tech/HexBinary/index.html" },
      {
        name: "Base64 Encoder/Decoder",
        url: "calculators/tech/Base64/index.html",
      },
      {
        name: "String Length Counter",
        url: "calculators/tech/StringLength/index.html",
      },
      {
        name: "Password Strength",
        url: "calculators/tech/PasswordStrength/index.html",
      },
      {
        name: "JSON Formatter",
        url: "calculators/tech/JsonFormatter/index.html",
      },
      {
        name: "Date/Time Formatter",
        url: "calculators/tech/DateTime/index.html",
      },
    ],
  },
  {
    category: "Travel & Vehicle",
    id: "travel",
    icon: "fa-plane-departure",
    tools: [
      {
        name: "Fuel Cost Estimator",
        url: "calculators/travel/FuelCost/index.html",
      },
      {
        name: "Trip Cost Calculator",
        url: "calculators/travel/TripCost/index.html",
      },
      {
        name: "EV Charging Cost",
        url: "calculators/travel/EvCharging/index.html",
      },
      {
        name: "Speed/Distance/Time",
        url: "calculators/travel/SpeedDistTime/index.html",
      },
      {
        name: "Toll Cost Estimator",
        url: "calculators/travel/TollCost/index.html",
      },
    ],
  },
  {
    category: "Shopping & Budget",
    id: "shopping",
    icon: "fa-shopping-cart",
    tools: [
      {
        name: "EMI Comparison Tool",
        url: "calculators/shopping/EmiCompare/index.html",
      },
      {
        name: "Price Comparison",
        url: "calculators/shopping/PriceCompare/index.html",
      },
      {
        name: "Unit Price Calculator",
        url: "calculators/shopping/UnitPrice/index.html",
      },
      {
        name: "Budget Planner",
        url: "calculators/shopping/BudgetPlanner/index.html",
      },
      {
        name: "Subscription Cost",
        url: "calculators/shopping/Subscription/index.html",
      },
    ],
  },
  {
    category: "Premium & Fun",
    id: "premium",
    icon: "fa-crown",
    tools: [
      {
        name: "Life Expectancy Fun",
        url: "calculators/premium/LifeExpectancy/index.html",
      },
      { name: "Sleep Cycle", url: "calculators/premium/SleepCycle/index.html" },
      {
        name: "Productivity Time Block",
        url: "calculators/premium/Productivity/index.html",
      },
      {
        name: "Screen Time Reduction",
        url: "calculators/premium/ScreenTime/index.html",
      },
      {
        name: "Carbon Footprint",
        url: "calculators/premium/CarbonFootprint/index.html",
      },
      {
        name: "Relationship Anniversary",
        url: "calculators/premium/Anniversary/index.html",
      },
      {
        name: "Study Planner",
        url: "calculators/premium/StudyPlanner/index.html",
      },
    ],
  },
];

const homeContainer = document.querySelector(".home-container");
const categoryGrid = document.getElementById("category-grid");
const subCatList = document.getElementById("sub-cat-list");
const mainTitle = document.getElementById("main-title");
const searchInput = document.getElementById("search-input");

function renderCategories() {
  categoryGrid.innerHTML = "";
  calculatorData.forEach((cat) => {
    const div = document.createElement("div");
    div.className = "cat-card";
    div.dataset.id = cat.id;
    div.onclick = () => showSubCategories(cat.id);
    div.innerHTML = `
            <i class="fas ${cat.icon}"></i>
            <h3>${cat.category}</h3>
            <p>${cat.tools.length} Tools</p>
        `;
    categoryGrid.appendChild(div);
  });
}

function showSubCategories(catId) {
  const selectedCat = calculatorData.find((c) => c.id === catId);

  homeContainer.classList.add("sidebar-active");

  document.querySelectorAll(".cat-card").forEach((card) => {
    card.classList.remove("active-cat");
    if (card.dataset.id === catId) card.classList.add("active-cat");
  });

  mainTitle.innerText = selectedCat.category;
  document.getElementById("sub-desc").innerText =
    "Select a tool below to open it.";

  renderToolList(selectedCat.tools);
}

function renderToolList(tools) {
  if (tools.length === 0) {
    subCatList.innerHTML = "<p>No calculators added yet.</p>";
    return;
  }

  subCatList.innerHTML = tools
    .map(
      (tool) => `
        <a href="${tool.url}" class="tool-link">
            <span><i class="fas fa-chevron-right" style="font-size:0.8rem; margin-right:10px; color:#aaa;"></i> ${tool.name}</span>
            <i class="fas fa-arrow-right" style="color: #007bff;"></i>
        </a>
    `
    )
    .join("");
}

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();

  if (term.length > 0) {
    homeContainer.classList.add("sidebar-active");
    mainTitle.innerText = `Search Results for "${e.target.value}"`;
    document.getElementById("sub-desc").innerText =
      "Calculators matching your search";

    document
      .querySelectorAll(".cat-card")
      .forEach((c) => c.classList.remove("active-cat"));

    let results = [];
    calculatorData.forEach((cat) => {
      cat.tools.forEach((tool) => {
        if (tool.name.toLowerCase().includes(term)) {
          results.push({
            ...tool,
            categoryName: cat.category,
          });
        }
      });
    });

    if (results.length > 0) {
      subCatList.innerHTML = results
        .map(
          (tool) => `
                <a href="${tool.url}" class="tool-link">
                    <div>
                        <strong>${tool.name}</strong><br>
                        <small style="color:grey; font-size:0.8rem;">in ${tool.categoryName}</small>
                    </div>
                    <i class="fas fa-arrow-right"></i>
                </a>
            `
        )
        .join("");
    } else {
      subCatList.innerHTML = `<div style="text-align:center; padding:20px; color:grey;">No calculators found.</div>`;
    }
  } else {
    homeContainer.classList.remove("sidebar-active");
    renderCategories();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
});
