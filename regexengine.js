class State {
  constructor(isAccepting = false) {
    this.transitions = {};
    this.isAccepting = isAccepting;
  }

  addTransition(symbol, nextState) {
    if (!this.transitions[symbol]) {
      this.transitions[symbol] = [];
    }
    this.transitions[symbol].push(nextState);
  }
}

class RegexEngine {
  constructor(regex) {
    this.startState = this.buildDFA(regex);
  }

  buildDFA(regex) {
    let currentState = new State(true);
    let stack = [currentState];

    for (let i = 0; i  regex.length; i++) {
      let c = regex[i];

      switch (c) {
        case '('
          let newState = new State(true);
          currentState.addTransition('ε', newState);
          stack.push(currentState);
          currentState = newState;
          break;
        case ')'
          currentState = stack.pop();
          break;
        case ''
          let altState = new State(true);
          currentState.addTransition('ε', altState);
          currentState = altState;
          break;
        case ''
          currentState.addTransition('ε', stack[stack.length - 1]);
          stack[stack.length - 1].addTransition('ε', currentState);
          break;
        case '+'
          currentState.addTransition('ε', stack[stack.length - 1]);
          break;
        case ''
          stack[stack.length - 1].addTransition('ε', currentState);
          break;
        case '['
          let charClassState = new State();
          let negate = false;

          if (regex[i + 1] === '^') {
            negate = true;
            i++;
          }

          while (regex[i + 1] && regex[i + 1] !== ']') {
            i++;
            charClassState.addTransition(regex[i], new State(true));
          }

          if (negate) {
            charClassState.addTransition('ε', new State(true));
          }

          currentState.addTransition('ε', charClassState);
          currentState = charClassState;
          break;
        case ''
          if (i + 1  regex.length) {
            i++;
            currentState.addTransition(regex[i], new State(true));
          } else {
            throw new Error('Invalid escape sequence at the end of the regex.');
          }
          break;
        default
          let nextState = new State(true);
          currentState.addTransition(c, nextState);
          currentState = nextState;
          break;
      }
    }

    return stack[0];
  }

  match(input) {
    let currentStates = [this.startState];

    for (let symbol of input) {
      let nextStates = [];
      for (let state of currentStates) {
        if (state.transitions[symbol]) {
          nextStates = nextStates.concat(state.transitions[symbol]);
        }
        if (state.transitions['ε']) {
          nextStates = nextStates.concat(state.transitions['ε']);
        }
      }
      currentStates = nextStates;
    }

    return currentStates.some((state) = state.isAccepting);
  }
}

 Interactive menu
function runRegexEngine() {
  try {
    const regex = prompt('Enter the regular expression');
    const input = prompt('Enter the input string');

    if (!regex  !input) {
      throw new Error('Invalid input. Both regex and input string are required.');
    }

    const regexEngine = new RegexEngine(regex);
    const result = regexEngine.match(input);

    console.log(`Matching result for '${input}' with regex '${regex}' ${result}`);
  } catch (error) {
    console.error(`Error ${error.message}`);
  }
}

 Run the interactive menu
runRegexEngine();
