(() => {
  /*
   * TODO:
   * divide by zero
   * backspace
   */
  const buttonsContainer = document.getElementById('buttons');
  const equationElement = document.getElementById('equation');
  const outputContainer = document.getElementById('output');
  const inputs = (
    Array(10).fill(1).map((_, i) => String(i))
    .concat(['.', '+', '-', 'x', '/'])
  );
  const buttonMap = {};

  function appendToEquation(part) {
    if (isValidEquation(equationElement.value + part)) {
      flash(buttonMap[part], 'green-bg');
      equationElement.value += part;
    } else {
      flash(buttonMap[part], 'red-bg');
    }
  }

  function addButton(content) {
    const button = document.createElement('button');
    button.textContent = content;
    buttonsContainer.appendChild(button);
    return button;
  }

  function reduceOnOperator(array, operator, operation) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (item === operator) {
        result[result.length - 1] = operation(
          result[result.length - 1], array[i + 1],
        );
        i++;
      } else {
        result.push(item);
      }
    }
    return result;
  }

  function tokenizeEquation(equation) {
    return (
      equation
      .replaceAll(' ', '')
      .replaceAll(/([x\/+-])/g, ' $1 ')
      .trim()
      .split(' ')
    );
  }

  function evaluateEquation() {
    const parts = (
      tokenizeEquation(equationElement.value)
      .map(part => part.match(/[x+-/]/) ? part : parseNumber(part))
    );
    return [
      ['x', (a, b) => a * b],
      ['/', (a, b) => a / b],
      ['+', (a, b) => a + b],
      ['-', (a, b) => a - b],
    ].reduce(
      (acc, [operator, operation]) => reduceOnOperator(
        acc, operator, operation,
      ),
      parts,
    )[0];
  }

  function clear() {
    flash(buttonMap['C'], 'green-bg');
    equationElement.value = '';
  }

  function runEquals() {
    if (!isValidEquation(equationElement.value, true)) {
      flash(buttonMap['='], 'red-bg');
      return;
    }

    const answer = evaluateEquation();
    const calculation = document.createElement('div');
    calculation.className = 'calculation';
    calculation.innerHTML = `
        <p class="input">${tokenizeEquation(equationElement.value).join(' ')}</p>
        <p class="result">${answer}</p>
      `;
    if (outputContainer.children.length) {
      outputContainer.insertBefore(
        calculation,
        outputContainer.children[0],
      );
    } else {
      outputContainer.appendChild(calculation);
    }
    clear();
    flash(buttonMap['='], 'green-bg');
  }

  function flash(element, className, duration) {
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), duration || 150);
  }

  function addButtons() {
    for (const label of inputs) {
      const button = addButton(label);
      button.addEventListener('click', () => appendToEquation(label));
      buttonMap[label] = button;
    }

    const equals = addButton('=');
    equals.addEventListener('click', runEquals);
    buttonMap['='] = equals;

    const clearButton = addButton('C');
    clearButton.addEventListener('click', clear);
    buttonMap['C'] = clearButton;
  }

  function parseNumber(string) {
    const empty = string === '';
    const nonNumberCharacters = string.match(/[^0-9\.]/) !== null;
    const moreThanOneDot = (string.match(/\./g) || []).length > 1;
    if (empty || nonNumberCharacters || moreThanOneDot) {
      return null;
    }
    return parseFloat(string);
  }

  function isValidEquation(equation, checkComplete) {
    const tokens = tokenizeEquation(equation);
    let expectNumber = true;
    for (const token of tokens) {
      if (expectNumber && parseNumber(token) === null) {
        return false;
      }
      if (!expectNumber && token.match(/[x/+-]/) === null) {
        return false;
      }
      expectNumber = !expectNumber;
    }
    return !checkComplete || !expectNumber;
  }

  function initEquation() {
    equationElement.addEventListener(
      'keypress',
      event => {
        // handle backspace
        console.log(event.key);
        if (event.key === 'c' || event.key === 'C') {
          clear();
        } else if (event.key === 'Enter' || event.key === '=') {
          runEquals();
        } else if (inputs.includes(String(event.key))) {
          appendToEquation(event.key);
        }
        event.preventDefault();
      },
      false,
    )
  }

  addButtons();
  initEquation();
})();
