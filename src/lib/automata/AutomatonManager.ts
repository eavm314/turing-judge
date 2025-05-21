import { AutomatonCode } from "../schemas/automaton-code";
import { type Automaton } from "./base";
import { createFSM } from "./finite-state-machine";
// import { createPDA } from './pushdown-automaton';
// import { createTM } from './turing-machine';

class AutomatonManager {
  private currentAutomaton!: Automaton;

  constructor(initialCode: AutomatonCode) {
    this.switchTo(initialCode);
  }

  switchTo(initialCode: AutomatonCode) {
    switch (initialCode.type) {
      case "FSM":
        this.currentAutomaton = createFSM(initialCode.automaton);
        break;
      default:
        throw new Error(`Not implemented automaton type: ${initialCode.type}`);
    }
  }

  getDesigner() {
    return this.currentAutomaton.getDesigner();
  }

  getExecutor() {
    return this.currentAutomaton.getExecutor();
  }

  getType() {
    return this.currentAutomaton.type;
  }
}

const automatonManager = new AutomatonManager({ type: "FSM" });
export default automatonManager;