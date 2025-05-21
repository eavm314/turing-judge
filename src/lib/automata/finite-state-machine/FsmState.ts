import { type JsonState } from "@/lib/schemas/finite-state-machine";
import { type FsmDesigner } from "./FsmDesigner";
import { BaseState } from "../base/BaseState";

export class FsmState extends BaseState {
  id: number;
  name: string;
  position: { x: number; y: number };
  isFinal: boolean;
  transitions: Map<number, string[]>;
  automaton: FsmDesigner;

  constructor(automaton: FsmDesigner, name: string, json: JsonState) {
    super();
    this.automaton = automaton;
    this.id = this.automaton.stateToIndex.get(name)!;
    this.name = name;
    this.position = json.position ?? { x: 0, y: 0 };
    this.isFinal = false;
    this.transitions = new Map();

    for (const [target, symbols] of Object.entries(json.transitions ?? {})) {
      const targetId = automaton.stateToIndex.get(target)!;
      this.addTransition(targetId, symbols);
    }
  }

  toJson(): JsonState {
    const transitions = this.transitions.entries().reduce(
      (acc, [target, symbols]) => {
        const tagetName = this.automaton.states.get(target)!.name;
        acc[tagetName] = symbols;
        return acc;
      },
      {} as Record<string, string[]>,
    );

    return {
      position: this.position,
      transitions,
    };
  }
}
