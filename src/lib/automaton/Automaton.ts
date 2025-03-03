import { State } from "./State";

export class Automaton {
  id: string | null;
  alphabet: string[];
  states: Map<string, State>;
  transitions: Map<string, State[]>;
  initialState: State;

  // TODO: create Automaton from JSON model

  constructor() {
    this.id = null;
    this.alphabet = [];
    this.states = new Map();
    this.transitions = new Map();
    this.initialState = new State("q0");
  }

  clone(): Automaton {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  addState(state: State) {
    if (!this.states.has(state.name)) {
      this.states.set(state.name, state);
    }
  }

  addTransition(from: string, to: string, symbol: string) {
    // TODO: add transition logic;
  }

  removeState(state: string) {
    // TODO: add remove state logic;
  }

  removeTransition(from: string, to: string, symbol: string) {
    // TODO: add remove transition logic;
  }

  toJSON() {
    return JSON.stringify(this);
  }
}
