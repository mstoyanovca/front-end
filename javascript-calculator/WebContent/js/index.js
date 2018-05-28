var equation = "";

function enter(id) {
  // avoid screen overflow:
  if(equation.length < 16)
    equation += id;
  document.getElementById("equation-line").innerHTML = equation;
}

function clearEntry() {
  if(equation.length > 0)
    equation = equation.slice(0, equation.length - 1);
  document.getElementById("equation-line").innerHTML = equation;
}

function allClear() {
  equation = "";
  document.getElementById("equation-line").innerHTML = equation;
  document.getElementById("result-line").innerHTML = 0;
}

function calculate() {
  if(equation.length == 0) return;
  var result = 0;
  try {
    result = eval(equation);
  } catch(err) {
    document.getElementById("result-line").innerHTML = "SYNTAX ERR";
    return;
  }
  // avoid screen overflow:
  if(result.toString().length > 11) {
    // limit display to 10 columns for 6 digits, e+99 and decimal point:
    result = result.toPrecision(6);
  }
  equation = "";
  document.getElementById("equation-line").innerHTML = equation;
  document.getElementById("result-line").innerHTML = result;
}