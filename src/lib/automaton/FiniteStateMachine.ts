import { State, type JsonState } from "./State";

export interface JsonFSM {
  alphabet: string[],
  states: Record<string, JsonState>,
  initial: string,
  finals: string[],
}

const basicAutomata: JsonFSM = {
  alphabet: [],
  states: {
    "q0": {
      position: { x: 0, y: 0 },
      transitions: {},
    }
  },
  initial: "q0",
  finals: [],
}

export class FiniteStateMachine {
  states: Map<string, State>;
  alphabet: string[];
  initial: string;

  constructor(json: JsonFSM = basicAutomata) {
    this.states = new Map();
    this.alphabet = json.alphabet;
    this.initial = json.initial;

    // Convert JSON to State objects
    for (const [name, value] of Object.entries(json.states)) {
      const state = new State(name, value);
      this.states.set(name, state);
    }

    for (const finalState of json.finals) {
      this.states.get(finalState)!.setFinal(true);
    }
  }

  setAlphabet(alphabet: string[]) {
    this.alphabet = alphabet;
  }

  toJson(): JsonFSM {
    const states = Object.fromEntries(this.states.entries()
      .map(([name, state]) => [name, state.toJson()]));
    const finals = Array.from(this.states.values())
      .filter(state => state.isFinal)
      .map(state => state.name);

    return {
      alphabet: Array.from(this.alphabet),
      states,
      initial: this.initial,
      finals,
    };
  }

  clone(): FiniteStateMachine {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  addState(name: string, stateJson: JsonState) {
    if (!this.states.has(name)) this.states.set(name, new State(name, stateJson));
  }

  removeState(name: string) {
    this.states.delete(name);
    for (const state of this.states.values()) {
      state.removeTransition(name);
    }
  }

  addTransition(from: string, to: string, symbols: string[]) {
    this.states.get(from)!.addTransition(symbols, [to]);
  }

  removeTransition(from: string, to: string) {
    this.states.get(from)!.removeTransition(to);
  }

  toggleFinal(name: string) {
    const state = this.states.get(name);
    state?.setFinal(!state.isFinal);
  }
}