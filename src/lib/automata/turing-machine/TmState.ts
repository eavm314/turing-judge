import { JsonTmState } from '@/lib/schemas/turing-machine';
import { BaseState } from '../base/BaseState';
import { TmDesigner } from './TmDesigner';

export type TmTransitionData = {
  read: string;
  write: string;
  move: 'L' | 'R' | 'S';
};

export class TmState extends BaseState<TmTransitionData> {
  id: number;
  name: string;
  position: { x: number; y: number };
  isFinal: boolean;
  transitions: Map<number, TmTransitionData[]>;
  automaton: TmDesigner;
  selected: boolean;

  constructor(automaton: TmDesigner, name: string, json: JsonTmState) {
    super();
    this.selected = false;
    this.automaton = automaton;
    this.id = this.automaton.stateToIndex.get(name)!;
    this.name = name;
    this.position = json.position ?? { x: 0, y: 0 };
    this.isFinal = false;
    this.transitions = new Map();

    for (const [target, transitions] of Object.entries(json.transitions ?? {})) {
      const targetId = automaton.stateToIndex.get(target)!;
      this.addTransition(targetId, transitions);
    }
  }

  toJson(): JsonTmState {
    const transitions = this.transitions.entries().reduce(
      (acc, [target, transition]) => {
        const targetName = this.automaton.getState(target).name;
        acc[targetName] = transition;
        return acc;
      },
      {} as Record<string, TmTransitionData[]>,
    );

    return {
      position: this.position,
      transitions,
    };
  }
}
