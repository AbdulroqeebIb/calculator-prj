// 1. Select the necessary elements using the IDs/Classes we set in the HTML
const display = document.getElementById("display");
const calculatorBox = document.querySelector(".number-box");
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const track = document.getElementById("switch-track");
  const handle = document.getElementById("switch-handle");

  let currentTheme = 1; // Start with Theme 1
  const handlePositions = ["4px", "26px", "50px"]; // Positions for 1, 2, 3

  // 1. Set the initial state
  body.classList.add("theme-1");
  handle.style.left = handlePositions[0];

  // Function to apply a specific theme
  function applyTheme(themeNum) {
    // Remove old theme classes
    body.classList.remove("theme-1", "theme-2", "theme-3");

    // Add the new theme class
    body.classList.add(`theme-${themeNum}`);

    // Move the handle
    handle.style.left = handlePositions[themeNum - 1];
    currentTheme = themeNum;
  }

  // 2. Add Event Listeners for theme changing
  track.addEventListener("click", () => {
    // Cycle to the next theme: 1 -> 2 -> 3 -> 1
    const nextTheme = (currentTheme % 3) + 1;
    applyTheme(nextTheme);
  });

  // Optional: Add listeners to the numbers (1, 2, 3) for direct selection
  document.querySelectorAll(".num-group .one").forEach((num) => {
    num.addEventListener("click", (e) => {
      const themeToApply = parseInt(e.target.getAttribute("data-theme"));
      if (!isNaN(themeToApply)) {
        applyTheme(themeToApply);
      }
    });
  });
});

console.log(calculatorBox);
// 2. Define the calculator's STATE (memory)

// The number currently being entered/displayed
let currentInput = "0";

// The first number in an operation (e.g., 5 + ...)
let firstOperand = null;

// The pending operation (+, -, *, /)
let operator = null;

// Flag: True if the next digit pressed should start a new number
let waitingForSecondOperand = false;

// Function to update the display text based on the 'currentInput' state
function updateDisplay() {
  // Limits the display and uses commas for readability
  display.textContent = Number(currentInput).toLocaleString("en-US", {
    maximumFractionDigits: 9,
  });
}

// The core math logic
function calculate(num1, num2, op) {
  if (op === "add") return num1 + num2;
  if (op === "subtract") return num1 - num2;
  if (op === "multiply") return num1 * num2;
  if (op === "divide") return num1 / num2;
  return num2;
}

// 4. Input Handlers

function inputDigit(digit) {
  if (waitingForSecondOperand === true) {
    currentInput = digit;
    waitingForSecondOperand = false;
  } else {
    currentInput = currentInput === "0" ? digit : currentInput + digit;
  }
}

function inputDecimal() {
  if (waitingForSecondOperand === true) {
    currentInput = "0.";
    waitingForSecondOperand = false;
    return;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  if (currentInput.length === 0) {
    currentInput = "0";
  }
}

function resetCalculator() {
  currentInput = "0";
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
}
function handleOperator(nextOperator) {
  const inputValue = parseFloat(currentInput);

  if (firstOperand !== null && operator && !waitingForSecondOperand) {
    const result = calculate(firstOperand, inputValue, operator);
    firstOperand = result;
    currentInput = String(result);
  } else {
    firstOperand = inputValue;
  }
  currentInput = String(firstOperand);

  waitingForSecondOperand = true;
  operator = nextOperator;
}

function handleEquals() {
  const inputValue = parseFloat(currentInput);

  if (operator === null || waitingForSecondOperand) {
    return;
  }

  const result = calculate(firstOperand, inputValue, operator);

  currentInput = String(result);
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = true;
}

// 5. The main controller using Event Delegation
calculatorBox.addEventListener("click", (event) => {
  //code to get target, type, action
  const target = event.target;

  // Ignore clicks that are not on a <button> element
  if (target.tagName !== "BUTTON") {
    return;
  }

  const type = target.dataset.type;
  const action = target.dataset.action;

  if (type === "number") {
    inputDigit(target.textContent);
  } else if (type === "operator") {
    handleOperator(action);
  } else if (type === "equals") {
    handleEquals();
  } else if (type === "decimal") {
    inputDecimal();
  } else if (type === "reset") {
    console.log("---RESET button clicked---");
    resetCalculator();
    // function resetCalculator() {
    //   currentInput = "0";
    //   //Resets the number shown on the display to '0'
    //   firstOperand = null;
    //   //Clears any stored first operand
    //   operator = null;
    //   //Clears any stored operator
    //   waitingForSecondOperand = false;
    // }
  } else if (type === "delete") {
    deleteLast();
  }

  updateDisplay();
});

//Initial call to show '0' on the display
updateDisplay();
