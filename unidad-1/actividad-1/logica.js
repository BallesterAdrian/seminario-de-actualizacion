let display = document.getElementById("display");
let currentInput = "";
let operator = null;
let previousInput = "";

// Esta función actualiza la pantalla con lo que llevamos hasta ahora
function updateDisplay() {
  display.value = previousInput + (operator ? " " + operator + " " : "") + currentInput;
}

function addNumber(num) {
  currentInput += num;
  updateDisplay();
}

function addDecimal() {
  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}

function addoperator(op) {
  if (currentInput === "") return;
  if (previousInput !== "" && operator) {
    calcular();
  }
  previousInput = currentInput;
  operator = op;
  currentInput = "";
  updateDisplay();
}

function calcular() {
  if (operator === null || previousInput === "") return;

  let result;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(current)) return;

  switch (operator) {
    case '+': result = prev + current; break;
    case '-': result = prev - current; break;
    case '*': result = prev * current; break;
    case '/': result = prev / current; break;
    default: return;
  }

  // Mostrar el resultado en el display
  display.value = result;
  currentInput = result.toString();
  operator = null;
  previousInput = "";
}

function clean() {
  currentInput = "";
  operator = null;
  previousInput = "";
  updateDisplay();
}
