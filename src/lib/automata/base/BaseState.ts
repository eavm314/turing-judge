import { type JsonFsmState } from '@/lib/schemas/finite-state-machine';
import { type FsmTransitionData } from '../finite-state-machine/FsmState';
import { type PdaTransitionData } from '../pushdown-automaton/PdaState';
import { type JsonPdaState } from '@/lib/schemas/pushdown-automaton';

export type JsonState = JsonFsmState | JsonPdaState;
export type TransitionData = FsmTransitionData | PdaTransitionData;

export abstract class BaseState {
  abstract id: number;
  abstract name: string;
  abstract position: { x: number; y: number };
  abstract isFinal: boolean;
  abstract transitions: Map<number, TransitionData[]>;

  setName(name: string) {
    this.name = name;
  }

  setPosition({ x, y }: { x: number; y: number }) {
    this.position = { x, y };
  }

  switchFinal() {
    this.isFinal = !this.isFinal;
  }

  removeTransition(to: number) {
    this.transitions.delete(to);
  }

  addTransition(target: number, data: TransitionData[]) {
    this.transitions.set(target, data);
  }

  abstract toJson(): JsonState;
}
