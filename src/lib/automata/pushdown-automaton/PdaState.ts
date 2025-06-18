import { type JsonPdaState } from '@/lib/schemas/pushdown-automata';
import { BaseState } from '../base/BaseState';
import { type PdaDesigner } from './PdaDesigner';

export type PdaTransitionData = {
  input: string;
  pop: string;
  push: string[];
};

export class PdaState extends BaseState {
  id: number;
  name: string;
  position: { x: number; y: number };
  isFinal: boolean;
  transitions: Map<number, PdaTransitionData[]>;
  automaton: PdaDesigner;

  constructor(automaton: PdaDesigner, name: string, json: JsonPdaState) {
    super();
    this.automaton = automaton;
    this.id = this.automaton.stateToIndex.get(name)!;
    this.name = name;
    this.position = json.position ?? { x: 0, y: 0 };
    this.isFinal = false;
    this.transitions = new Map();

    for (const [target, transitions] of Object.entries(json.transitions ?? {})) {
      const targetId = automaton.stateToIndex.get(target)!;
      this.addTransition(
        targetId,
        transitions.map(transition => ({ ...transition, push: transition.push ?? [] })),
      );
    }
  }

  toJson(): JsonPdaState {
    const transitions = this.transitions.entries().reduce(
      (acc, [target, transition]) => {
        const targetName = this.automaton.getState(target).name;
        acc[targetName] = transition;
        return acc;
      },
      {} as Record<string, PdaTransitionData[]>,
    );

    return {
      position: this.position,
      transitions,
    };
  }
}
