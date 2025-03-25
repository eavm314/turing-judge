import { FiniteStateMachine } from "./FiniteStateMachine";
import { State } from "./State";

class AutomatonExecutor {
  private automaton: FiniteStateMachine;

  constructor() {
    this.automaton = new FiniteStateMachine();
  }

  setAutomaton(automaton: FiniteStateMachine) {
    this.automaton = automaton;
  }

  step(input: string, state: State): string[] {
    if (input.length === 0) return [];
    const targets = state.transitions.get(input[0]);
    if (!targets) return [];
    return targets;
  }

  execute(input: string, stateName: string = this.automaton.initial) {
    const state = this.automaton.states.get(stateName)!;

    if (input.length === 0 && state.isFinal) return true;

    const nextStates = this.step(input, state);
    for (const nextState of nextStates) {
      const result = this.execute(input.substring(1), nextState);
      if (result) return true;
    }
    return false;
  }
}

const executor = new AutomatonExecutor();
export default executor;