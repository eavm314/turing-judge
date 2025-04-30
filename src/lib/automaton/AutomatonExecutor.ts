import { EPSILON } from "@/constants/symbols";
import { FiniteStateMachine } from "./FiniteStateMachine";
import { State } from "./State";

type TransitionStep = [number, number, string]; // [from, to, symbol]

interface ExecutionResult {
  accepted: boolean;
  path: TransitionStep[];
}

class AutomatonExecutor {
  private automaton: FiniteStateMachine;

  private maxSteps = 1000;
  private steps = 0;

  constructor() {
    this.automaton = new FiniteStateMachine();
  }

  getAutomaton() {
    return this.automaton;
  }

  setAutomaton(automaton: FiniteStateMachine) {
    this.automaton = automaton;
  }

  step(
    inputSymbol: string,
    state: State,
  ): {
    consuming: TransitionStep[]; // [from, to, symbol]
    epsilon: TransitionStep[]; // [from, to, "ε"]
  } {
    this.steps++;
    const consuming: TransitionStep[] = [];
    const epsilon: TransitionStep[] = [];

    // Transitions that consume the current symbol
    const targets = state.transitions.get(inputSymbol) || [];
    for (const target of targets) {
      consuming.push([state.id, target, inputSymbol]);
    }

    // Epsilon transitions
    const epsilonTargets = state.transitions.get(EPSILON) || [];
    for (const target of epsilonTargets) {
      epsilon.push([state.id, target, EPSILON]);
    }

    return { consuming, epsilon };
  }

  execute(input: string): ExecutionResult {
    this.steps = 0;
    const stack: {
      stateId: number;
      inputPos: number;
      path: TransitionStep[];
    }[] = [];

    stack.push({ stateId: 0, inputPos: 0, path: [] });

    let lastPath: TransitionStep[] = [];

    while (stack.length > 0) {
      const { stateId, inputPos, path } = stack.pop()!;
      const state = this.automaton.states.get(stateId)!;
      lastPath = path;

      if (this.steps > this.maxSteps) {
        console.warn("Max steps exceeded, aborting execution.");
        return { accepted: false, path: lastPath };
      }

      if (inputPos === input.length && state.isFinal) {
        return { accepted: true, path };
      }

      const symbol = input[inputPos] ?? "";
      const { consuming, epsilon } = this.step(symbol, state);

      // First, push epsilon transitions (they don't consume input)
      for (const [from, to, transitionSymbol] of epsilon) {
        stack.push({
          stateId: to,
          inputPos: inputPos, // No change in position since epsilon doesn't consume input
          path: [...path, [from, to, transitionSymbol]],
        });
      }

      // Then, push consuming transitions (they consume the input symbol)
      for (const [from, to, transitionSymbol] of consuming) {
        const nextInputPos = inputPos + 1;
        stack.push({
          stateId: to,
          inputPos: nextInputPos,
          path: [...path, [from, to, transitionSymbol]],
        });
      }
    }

    return { accepted: false, path: lastPath };
  }
}

const executor = new AutomatonExecutor();
export default executor;
