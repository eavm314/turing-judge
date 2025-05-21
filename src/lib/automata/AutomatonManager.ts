import { AutomatonCode } from "../schemas/automaton-code";
import { type Automaton } from "./base";
import { createFSM } from "./finite-state-machine";
// import { createPDA } from './pushdown-automaton';
// import { createTM } from './turing-machine';

class AutomatonManager {
  private currentAutomaton!: Automaton;

  constructor() {
    this.switchTo({ type: "FSM" });
  }

  switchTo(initialCode: AutomatonCode) {
    switch (initialCode.type) {
      case "FSM":
        this.currentAutomaton = createFSM(initialCode.automaton);
        break;
      // case 'pda': this.currentFactory = createPDA(); break;
      // case 'tm': this.currentFactory = createTM(); break;
    }
  }

  getDesigner() {
    return this.currentAutomaton.designer;
  }

  getExecutor() {
    return this.currentAutomaton.executor;
  }

  getType() {
    return this.currentAutomaton.type;
  }
}

const automatonManager = new AutomatonManager();
export default automatonManager;