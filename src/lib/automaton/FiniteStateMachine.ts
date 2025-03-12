import { State, type JsonState } from "./State";

export interface JsonFSM {
  alphabet: string[],
  states: JsonState[],
  initial: string,
  finals: string[],
}

const basicAutomata: JsonFSM = {
  alphabet: [],
  states: [
    {
      name: "q0",
      position: { x: 0, y: 0 },
      transitions: {},
    }
  ],
  initial: "q0",
  finals: [],
}

export class FiniteStateMachine {
  states: Map<string, State>;
  alphabet: Set<string>;
  initial: string;

  constructor(json: JsonFSM = basicAutomata) {
    this.states = new Map();
    this.alphabet = new Set(json.alphabet);
    this.initial = json.initial;

    // Convert JSON to State objects
    for (const stateInfo of json.states) {
      const state = new State(stateInfo);
      this.states.set(stateInfo.name, state);
    }

    for (const finalState of json.finals) {
      this.states.get(finalState)!.setFinal(true);
    }
  }

  clone(): FiniteStateMachine {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  addState(stateJson: JsonState) {
    if (!this.states.has(stateJson.name)) this.states.set(stateJson.name, new State(stateJson));
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