idCounter = 0
// Calculate Function - Takes two numbers (int or float) and then an operator
const calculate = (n1, operator, n2) => {
  // Parsing inputs to default to float before calculation
    const num1 = parseFloat(n1)
    const num2 = parseFloat(n2)
  // If states to determine to add, subtract, multiply, or divide based on operator variable
    if (operator === 'add') return num1 + num2
    if (operator === 'subtract') return num1 - num2
    if (operator === 'multiply') return num1 * num2
    if (operator === 'divide') return num1 / num2
  }
  // Impure function to append the calculations_list list and add a string of the previous calculated equation
  const logCalculation = (firstVal, operator, modVal) => {
    
    if (operator === 'add') { op = '+' }
    if (operator === 'subtract') { op = '-' }
    if (operator === 'multiply') { op = '*' }
    if (operator === 'divide') { op = '/' }
    logged = firstVal.toString() + " " + op + " " + modVal.toString() + " = " + answer.toString()
    document.getElementById('calculations_list').innerHTML += '<li id=log' + idCounter.toString() + '>' + logged + '</li>'

    
    if (document.getElementById("ul_o").getElementsByTagName("li").length > 10){
      var rem = document.getElementById('log' + idCounter.toString())
      rem.parentNode.removeChild(elem)
    }
    counter += 1
  }


// Function to return the key that was selected
const getKeyType = key => {
  const { action } = key.dataset
  // If action is no value return number
  if (!action) return 'number'
  // If action equals any of the following operators
  if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') return 'operator'
  // Default, return action
  return action
}

// Intakes String values from getKeyType function and returns values to be displayed
// Takes in three parameters, key, the current displayed number, and current state of the calculator
const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent
  const keyType = getKeyType(key)
  // All the states of the calculator
  const {firstValue, operator, modValue, previousKeyType} = state

  // If the key type is a number then returns default 0 display number, if there is a current operation pressed, 
  if (keyType === 'number') {
    return displayedNum === '0' ||
      previousKeyType === 'operator' ||
      previousKeyType === 'calculate'
      ? keyContent
      : displayedNum + keyContent
  }
  // If the key type is a decimal then returns . and checks whether there already is a . and the value following it or default to 0
  if (keyType === 'decimal') {
    if (!displayedNum.includes('.')) return displayedNum + '.'
    if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
    return displayedNum
  }
  // If the key type is an operator then returns which operator depending on whether there is already an operator and there is a value before the operation
  if (keyType === 'operator') {
    return firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum
  }
  // Returns 0 for the key type value 
  if (keyType === 'clear') return 0
  // If key type is calculate (equal sign), then the returns the calculate function depending on the parameter and state values and sets it to displayed num 
  if (keyType === 'calculate') {
    
    let firstValue = calculator.dataset.firstValue
    const operator = calculator.dataset.operator
    let secondValue = displayedNum
    
    if (firstValue) {
      if (previousKeyType === 'calculate') {
        firstValue = displayedNum
        secondValue = calculator.dataset.modValue
      }
      answer = calculate(firstValue, operator, secondValue)
      logCalculation(firstValue, operator, secondValue, answer)
      return calculate(firstValue, operator, secondValue)
    } else {
      return displayedNum
    }
  }
  
}
// Changes appearance of the calculator 
const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key)
  // States of the calculator
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = calculator.dataset

  calculator.dataset.previousKeyType = keyType
  // Changes the operator appearance 
  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action
    calculator.dataset.firstValue = firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculatedValue
      : displayedNum
  }
  // Changes to the display number to calculated number
  if (keyType === 'calculate') {
    
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
      ? modValue
      : displayedNum
    
  
  }
  // Clear all the state values to nothing
  if (keyType === 'clear' && key.textContent === 'AC') {
    calculator.dataset.firstValue = ''
    calculator.dataset.modValue = ''
    calculator.dataset.operator = ''
    calculator.dataset.previousKeyType = ''
  }
}
// Changes buttons to be pressing/depressing and AC/CE Text for clearing 
const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
  // Adds depression visual to the button when pressed
  if (keyType === 'operator') key.classList.add('is-depressed')
  // Changes to AC or EC
  if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC'
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')
    clearButton.textContent = 'CE'
  }
}



// Calculator information from index.html document
const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')

// Event that listens to whenever a button is clicked
keys.addEventListener('click', e => {
  
  if (!e.target.matches('button')) return
  const key = e.target
  const displayedNum = display.textContent
  const resultString = createResultString(key, displayedNum, calculator.dataset)

  display.textContent = resultString
  updateCalculatorState(key, calculator, resultString, displayedNum)
  updateVisualState(key, calculator)
})


