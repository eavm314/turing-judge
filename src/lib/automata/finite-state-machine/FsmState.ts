import { type JsonFsmState } from '@/lib/schemas/finite-state-machine';
import { type FsmDesigner } from './FsmDesigner';
import { BaseState } from '../base/BaseState';

export type FsmTransitionData = {
  inputSymbol: string;
};

export class FsmState extends BaseState {
  id: number;
  name: string;
  position: { x: number; y: number };
  isFinal: boolean;
  transitions: Map<number, FsmTransitionData[]>;
  automaton: FsmDesigner;
  selected: boolean;

  constructor(automaton: FsmDesigner, name: string, json: JsonFsmState) {
    super();
    this.selected = false;
    this.automaton = automaton;
    this.id = this.automaton.stateToIndex.get(name)!;
    this.name = name;
    this.position = json.position ?? { x: 0, y: 0 };
    this.isFinal = false;
    this.transitions = new Map();

    for (const [target, symbols] of Object.entries(json.transitions ?? {})) {
      const targetId = automaton.stateToIndex.get(target)!;
      this.addTransition(
        targetId,
        symbols.map(symbol => ({ inputSymbol: symbol })),
      );
    }
  }

  toJson(): JsonFsmState {
    const transitions = this.transitions.entries().reduce(
      (acc, [target, transition]) => {
        const targetName = this.automaton.getState(target).name;
        acc[targetName] = transition.map(data => data.inputSymbol);
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
