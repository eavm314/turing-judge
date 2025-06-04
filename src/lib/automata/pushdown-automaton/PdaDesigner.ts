import { StateNodeType } from '@/components/playground/Canvas/state-node';
import { TransitionEdgeType } from '@/components/playground/Canvas/transition-edge';
import { EPSILON } from '@/constants/symbols';
import { AutomatonDesign, BaseDesigner } from '@/lib/automata/base/BaseDesigner';
import { type JsonPda, type JsonPdaState } from '@/lib/schemas/pushdown-automata';
import { PdaState, type PdaTransitionData } from './PdaState';

export class PdaDesigner extends BaseDesigner {
  protected states: Map<number, PdaState>;
  private stackAlphabet: Set<string>;

  constructor(json: JsonPda) {
    super();
    this.states = new Map();
    this.alphabet = new Set(json.alphabet);
    this.stackAlphabet = new Set(json.stackAlphabet);

    // Convert JSON to Objects
    this.stateToIndex = new Map([[json.initial, 0]]);
    for (const name of Object.keys(json.states).filter(name => name !== json.initial)) {
      const stateId = Math.max(...this.stateToIndex.values()) + 1;
      this.stateToIndex.set(name, stateId);
    }

    for (const [name, value] of Object.entries(json.states)) {
      const state = new PdaState(this, name, value);
      const stateId = this.stateToIndex.get(name)!;
      this.states.set(stateId, state);
    }

    for (const finalState of json.finals) {
      const index = this.stateToIndex.get(finalState)!;
      this.states.get(index)!.switchFinal();
    }
  }

  toJson() {
    const states = Object.fromEntries(
      this.states.values().map(state => [state.name, state.toJson()]),
    );

    const finals = this.states
      .values()
      .filter(state => state.isFinal)
      .map(state => state.name)
      .toArray();

    const initial = this.states.get(0)!.name;

    const automaton = {
      alphabet: Array.from(this.alphabet),
      stackAlphabet: Array.from(this.stackAlphabet),
      states,
      initial,
      finals,
    };

    return {
      type: 'PDA' as const,
      automaton,
    };
  }

  getDesign(): AutomatonDesign {
    const nodes: StateNodeType[] = this.states
      .values()
      .map(state => ({
        id: String(state.id),
        type: 'state',
        position: state.position,
        data: {
          name: state.name,
          isFinal: state.isFinal,
          isInitial: state.id === 0,
        },
      }))
      .toArray();

    const edges: TransitionEdgeType[] = this.states
      .values()
      .flatMap(state =>
        state.transitions.entries().map(([target, transition]) => ({
          id: `${state.id}->${target}`,
          source: String(state.id),
          target: String(target),
          data: { transition },
        })),
      )
      .toArray();

    const design = {
      nodes,
      edges,
      alphabet: Array.from(this.alphabet).sort(),
      isDeterministic: this.isDeterministic(),
    };
    return design;
  }

  addState(name: string, stateJson: JsonPdaState) {
    if (this.stateToIndex.get(name)) throw new Error('State already exists');
    const stateId = Math.max(...this.stateToIndex.values()) + 1;

    this.stateToIndex.set(name, stateId);
    this.states.set(stateId, new PdaState(this, name, stateJson));
  }

  addTransition(from: number, to: number, data: PdaTransitionData[]) {
    const symbSet = new Set(data.map(d => d.input));
    const stackSymbSet = new Set([...data.map(d => d.top), ...data.flatMap(d => d.push)]);
    if (symbSet.difference(this.alphabet).size > 0) throw new Error('Symbols not in alphabet');
    if (stackSymbSet.difference(this.stackAlphabet).size > 0) {
      throw new Error('Stack symbols not in stack alphabet');
    }

    const source = this.states.get(from);
    if (!source) throw new Error('Source state does not exist');

    source.addTransition(to, data);
  }

  isDeterministic(): boolean {
    for (const state of this.states.values()) {
      const seenPairs = new Set<string>();

      for (const data of state.transitions.values()) {
        for (const transition of data) {
          if (transition.input === EPSILON) return false;
          
          const pairKey = `${transition.input}|${transition.top}`;
          if (seenPairs.has(pairKey)) return false;
          seenPairs.add(pairKey);
        }
      }
    }
    return true;
  }
}
