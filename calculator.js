(() => {
  const buttonsContainer = document.getElementById('buttons');
  const equationElement = document.getElementById('equation');

  function appendToEquation(part) {
    equationElement.value += part;
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

  function evaluateEquation() {
    const parts = (
      equationElement.value
      .replaceAll(/([x\/+-])/g, ' $1 ')
      .split(' ')
      .map(part => part.match(/[x+-/]/) ? part : parseInt(part))
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

  function addButtons() {
    const inputButtons = (
      Array(10).fill(1).map((_, i) => i)
      .concat(['.', '+', '-', 'x', '/'])
    );
    for (const number of inputButtons) {
      const button = addButton(number);
      button.addEventListener('click', () => appendToEquation(number));
    }

    const equals = addButton('=');
    equals.addEventListener('click', () => {
      console.log(evaluateEquation());
    });
  }

  addButtons();
})();
