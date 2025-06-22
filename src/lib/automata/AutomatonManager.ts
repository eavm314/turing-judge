import { AutomatonCode } from '../schemas/automaton-code';
import { type Automaton } from './base';
import { createFSM } from './finite-state-machine';
import { createPDA } from './pushdown-automaton';
// import { createTM } from './turing-machine';

export class AutomatonManager {
  private currentAutomaton!: Automaton;

  constructor(initialCode: AutomatonCode) {
    this.switchTo(initialCode);
  }

  switchTo(initialCode: AutomatonCode) {
    switch (initialCode.type) {
      case 'FSM':
        this.currentAutomaton = createFSM(initialCode.automaton);
        break;
      case 'PDA':
        this.currentAutomaton = createPDA(initialCode.automaton);
        break;
      default:
        throw new Error(`Automaton type not supported yet: ${initialCode.type}`);
    }
  }

  getDesigner() {
    return this.currentAutomaton.getDesigner();
  }

  getExecutor() {
    return this.currentAutomaton.getExecutor();
  }

  getAnimator() {
    return this.currentAutomaton.getAnimator();
  }

  getType() {
    return this.currentAutomaton.type;
  }
}
