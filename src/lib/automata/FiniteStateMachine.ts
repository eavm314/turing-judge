import { EPSILON } from "@/constants/symbols";
import { State } from "./State";
import {
  type JsonFSM,
  type JsonState,
} from "@/lib/schemas/finite-state-machine";

const basicAutomata: JsonFSM = {
  alphabet: ["0", "1"],
  states: {
    q0: {
      position: { x: 0, y: 0 },
      transitions: {},
    },
  },
  initial: "q0",
  finals: [],
};

export class FiniteStateMachine {
  states: Map<number, State>;
  alphabet: string[];

  stateToIndex: Map<string, number>;

  constructor(json: JsonFSM = basicAutomata) {
    this.states = new Map();
    this.alphabet = json.alphabet;

    // Convert JSON to Objects
    this.stateToIndex = new Map([[json.initial, 0]]);
    for (const name of Object.keys(json.states).filter(
      (name) => name !== json.initial,
    )) {
      const stateId = Math.max(...this.stateToIndex.values()) + 1;
      this.stateToIndex.set(name, stateId);
    }

    for (const [name, value] of Object.entries(json.states)) {
      const state = new State(this, name, value);
      const stateId = this.stateToIndex.get(name)!;
      this.states.set(stateId, state);
    }

    for (const finalState of json.finals) {
      const index = this.stateToIndex.get(finalState)!;
      this.states.get(index)!.switchFinal();
    }
  }

  setAlphabet(alphabet: string[]) {
    this.alphabet = alphabet;
  }

  toJson(): JsonFSM {
    const states = Object.fromEntries(
      this.states.values().map((state) => [state.name, state.toJson()]),
    );

    const finals = Array.from(this.states.values())
      .filter((state) => state.isFinal)
      .map((state) => state.name);

    const initial = this.states.get(0)!.name;

    return {
      alphabet: Array.from(this.alphabet),
      states,
      initial,
      finals,
    };
  }

  clone(): FiniteStateMachine {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  addState(name: string, stateJson: JsonState) {
    if (this.stateToIndex.get(name)) throw new Error("State already exists");
    const stateId = Math.max(...this.stateToIndex.values()) + 1;

    this.stateToIndex.set(name, stateId);
    this.states.set(stateId, new State(this, name, stateJson));
  }

  removeState(id: number) {
    if (id === 0) throw new Error("Cannot remove initial state");
    const stateToRemove = this.states.get(id);
    if (!stateToRemove) throw new Error("State does not exist");
    this.states.delete(id);
    for (const state of this.states.values()) {
      state.removeTransition(id);
    }
    this.stateToIndex.delete(stateToRemove.name);
  }

  addTransition(from: number, to: number, symbols: string[]) {
    const symbSet = new Set(symbols);
    const alphabetSet = new Set(this.alphabet);
    if (symbSet.difference(alphabetSet).size > 0)
      throw new Error("Symbols not in alphabet");

    const source = this.states.get(from);
    if (!source) throw new Error("Source state does not exist");

    source.addTransition(symbols, [to]);
  }

  removeTransition(from: number, to: number) {
    const source = this.states.get(from);
    if (!source) throw new Error("Source state does not exist");
    source.removeTransition(to);
  }

  getTransition(from: number, to: number): string[] {
    const state = this.states.get(from);
    if (!state) throw new Error("State does not exist");

    const symbols = state.transitions
      .entries()
      .filter(([_, targets]) => targets.includes(to))
      .map(([symbol]) => symbol)
      .toArray();

    return symbols;
  }

  switchFinal(id: number) {
    const state = this.states.get(id);
    state!.switchFinal();
  }

  moveState(id: number, position: { x: number; y: number }) {
    const state = this.states.get(id);
    if (!state) throw new Error("State does not exist");
    state.setPosition(position);
  }

  renameState(id: number, name: string) {
    const state = this.states.get(id);
    if (!state) throw new Error("State does not exist");
    if (this.stateToIndex.get(name)) throw new Error("State already exists");
    this.stateToIndex.delete(state.name);
    state.setName(name);
    this.stateToIndex.set(name, id);
  }

  getUsedSymbols(): Set<string> {
    const usedSymbols = new Set<string>();
    for (const state of this.states.values()) {
      for (const [symbol, target] of state.transitions.entries()) {
        if (target.length > 0) {
          usedSymbols.add(symbol);
        }
      }
    }
    return usedSymbols;
  }

  isDeterministic(): boolean {
    for (const state of this.states.values()) {
      const epsilonTransition = state.transitions.get(EPSILON);
      if (epsilonTransition && epsilonTransition.length > 0) return false;
      for (const targets of state.transitions.values()) {
        if (targets.length > 1) return false;
      }
    }
    return true;
  }
}
