import { type StateNodeType } from '@/components/playground/Canvas/state-node';
import { type TransitionEdgeType } from '@/components/playground/Canvas/transition-edge';
import { type AutomatonCode } from '@/lib/schemas/automaton-code';
import { type BaseState, type JsonState, type TransitionData } from './BaseState';

export interface AutomatonDesign {
  type: AutomatonCode['type'];
  nodes: StateNodeType[];
  edges: TransitionEdgeType[];
  alphabet: string[];
  stackAlphabet?: string[];
  isDeterministic: boolean;
}

export abstract class BaseDesigner {
  protected states!: Map<number, BaseState>;
  protected alphabet!: Set<string>;

  stateToIndex!: Map<string, number>;

  getState(id: number): BaseState {
    const state = this.states.get(id);
    if (!state) throw new Error('State does not exist');
    return state;
  }

  getAlphabet(): Set<string> {
    return this.alphabet;
  }

  addSymbol(symbol: string) {
    this.alphabet.add(symbol);
  }

  removeSymbol(symbol: string) {
    this.alphabet.delete(symbol);
  }

  removeState(id: number) {
    if (id === 0) throw new Error('Cannot remove initial state');
    const stateToRemove = this.states.get(id);
    if (!stateToRemove) throw new Error('State does not exist');
    this.states.delete(id);
    for (const state of this.states.values()) {
      state.removeTransition(id);
    }
    this.stateToIndex.delete(stateToRemove.name);
  }

  removeTransition(from: number, to: number) {
    const source = this.states.get(from);
    if (!source) throw new Error('Source state does not exist');
    source.removeTransition(to);
  }

  getTransition(from: number, to: number): TransitionData[] {
    const state = this.states.get(from);
    if (!state) throw new Error('State does not exist');

    const data = state.transitions.get(to);
    return data || [];
  }

  switchFinal(id: number) {
    const state = this.states.get(id);
    if (!state) throw new Error('State does not exist');
    state.switchFinal();
  }

  moveState(id: number, position: { x: number; y: number }) {
    const state = this.states.get(id);
    if (!state) throw new Error('State does not exist');
    state.setPosition(position);
  }

  renameState(id: number, name: string) {
    const state = this.states.get(id);
    if (!state) throw new Error('State does not exist');
    if (this.stateToIndex.get(name)) throw new Error('State already exists');
    this.stateToIndex.delete(state.name);
    state.setName(name);
    this.stateToIndex.set(name, id);
  }

  abstract toJson(): AutomatonCode;

  abstract getDesign(): AutomatonDesign;

  abstract addState(name: string, stateJson: JsonState): void;

  abstract addTransition(from: number, to: number, data: TransitionData[]): void;

  abstract isDeterministic(): boolean;
}
