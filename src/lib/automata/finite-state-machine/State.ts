import { type JsonState } from "@/lib/schemas/finite-state-machine";
import { type FsmDesigner } from "./FsmDesigner";

export class State {
  id: number;
  name: string;
  position: { x: number; y: number };
  isFinal: boolean;
  transitions: Map<string, number[]>;
  automaton: FsmDesigner;

  constructor(automaton: FsmDesigner, name: string, json: JsonState) {
    this.automaton = automaton;
    this.id = this.automaton.stateToIndex.get(name)!;
    this.name = name;
    this.position = json.position ?? { x: 0, y: 0 };
    this.isFinal = false;
    this.transitions = new Map();

    for (const [symbol, targets] of Object.entries(json.transitions ?? {})) {
      const targetIds = targets.map(
        (target) => automaton.stateToIndex.get(target)!,
      );
      this.addTransition([symbol], targetIds);
    }
  }

  toJson(): JsonState {
    const transitions = this.transitions.entries().reduce(
      (acc, [symbol, targets]) => {
        acc[symbol] = targets.map(
          (target) => this.automaton.states.get(target)!.name,
        ); // Convert target IDs back to names
        return acc;
      },
      {} as Record<string, string[]>,
    );

    return {
      position: this.position,
      transitions,
    };
  }

  setName(name: string) {
    this.name = name;
  }

  setPosition({ x, y }: { x: number; y: number }) {
    this.position = { x, y };
  }

  switchFinal() {
    this.isFinal = !this.isFinal;
  }

  addTransition(symbols: string[], targets: number[]) {
    symbols.forEach((symbol) => {
      if (this.transitions.has(symbol)) {
        this.transitions.get(symbol)!.push(...targets);
      } else {
        this.transitions.set(symbol, targets);
      }
    });
  }

  removeTransition(to: number) {
    this.transitions.forEach((targets, symbol) => {
      this.transitions.set(
        symbol,
        targets.filter((target) => target !== to),
      );
    });
  }
}
