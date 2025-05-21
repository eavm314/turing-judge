import { EPSILON } from "@/constants/symbols";
import { FsmState } from "./FsmState";
import {
  type JsonFSM,
  type JsonState,
} from "@/lib/schemas/finite-state-machine";
import { BaseDesigner } from "../base/BaseDesigner";
import { StateNodeType } from "@/components/playground/Canvas/state-node";
import { TransitionEdgeType } from "@/components/playground/Canvas/transition-edge";

export class FsmDesigner extends BaseDesigner {
  states: Map<number, FsmState>;
  alphabet: string[];

  stateToIndex: Map<string, number>;

  constructor(json: JsonFSM) {
    super();
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
      const state = new FsmState(this, name, value);
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

  toJson() {
    const states = Object.fromEntries(
      this.states.values().map((state) => [state.name, state.toJson()]),
    );

    const finals = Array.from(this.states.values())
      .filter((state) => state.isFinal)
      .map((state) => state.name);

    const initial = this.states.get(0)!.name;

    const automaton = {
      alphabet: Array.from(this.alphabet),
      states,
      initial,
      finals,
    };

    return {
      type: "FSM" as const,
      automaton,
    };
  }

  getDesign(): { nodes: StateNodeType[]; edges: TransitionEdgeType[] } {
    throw new Error("Method not implemented.");
  }

  addState(name: string, stateJson: JsonState) {
    if (this.stateToIndex.get(name)) throw new Error("State already exists");
    const stateId = Math.max(...this.stateToIndex.values()) + 1;

    this.stateToIndex.set(name, stateId);
    this.states.set(stateId, new FsmState(this, name, stateJson));
  }

  addTransition(from: number, to: number, symbols: string[]) {
    const symbSet = new Set(symbols);
    const alphabetSet = new Set(this.alphabet);
    if (symbSet.difference(alphabetSet).size > 0)
      throw new Error("Symbols not in alphabet");

    const source = this.states.get(from);
    if (!source) throw new Error("Source state does not exist");

    source.addTransition(to, symbols);
  }

  getUsedSymbols(): Set<string> {
    const usedSymbols = this.states
      .values()
      .flatMap((state) =>
        state.transitions.values().flatMap((symbols) => symbols),
      )
      .toArray();
    return new Set(usedSymbols);
  }

  isDeterministic(): boolean {
    for (const state of this.states.values()) {
      const seenSymbols = new Set<string>();

      for (const symbols of state.transitions.values()) {
        for (const symbol of symbols) {
          if (symbol === EPSILON) return false;
          if (seenSymbols.has(symbol)) return false;
          seenSymbols.add(symbol);
        }
      }
    }
    return true;
  }
}
