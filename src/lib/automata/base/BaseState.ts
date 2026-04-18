import { type JsonState } from '@/lib/schemas/automaton-code';

export abstract class BaseState<T = unknown> {
  abstract id: number;
  abstract name: string;
  abstract position: { x: number; y: number };
  abstract isFinal: boolean;
  abstract transitions: Map<number, T[]>;

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

  addTransition(target: number, data: T[]) {
    this.transitions.set(target, data);
  }

  abstract toJson(): JsonState;
}
