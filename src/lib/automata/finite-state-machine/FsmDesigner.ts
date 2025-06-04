import { EPSILON } from '@/constants/symbols';
import { FsmState, FsmTransitionData } from './FsmState';
import { type JsonFsm, type JsonFsmState } from '@/lib/schemas/finite-state-machine';
import { AutomatonDesign, BaseDesigner } from '@/lib/automata/base/BaseDesigner';
import { StateNodeType } from '@/components/playground/Canvas/state-node';
import { TransitionEdgeType } from '@/components/playground/Canvas/transition-edge';

export class FsmDesigner extends BaseDesigner {
  protected states: Map<number, FsmState>;

  constructor(json: JsonFsm) {
    super();
    this.states = new Map();
    this.alphabet = new Set(json.alphabet);

    // Convert JSON to Objects
    this.stateToIndex = new Map([[json.initial, 0]]);
    for (const name of Object.keys(json.states).filter(name => name !== json.initial)) {
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
      states,
      initial,
      finals,
    };

    return {
      type: 'FSM' as const,
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
        selected: state.selected,
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

  addState(name: string, stateJson: JsonFsmState) {
    if (this.stateToIndex.get(name)) throw new Error('State already exists');
    const stateId = Math.max(...this.stateToIndex.values()) + 1;

    this.stateToIndex.set(name, stateId);
    this.states.set(stateId, new FsmState(this, name, stateJson));
  }

  addTransition(from: number, to: number, data: FsmTransitionData[]) {
    const symbSet = new Set(data.map(d => d.inputSymbol));
    if (symbSet.difference(this.alphabet).size > 0) throw new Error('Symbols not in alphabet');

    const source = this.states.get(from);
    if (!source) throw new Error('Source state does not exist');

    source.addTransition(to, data);
  }

  isDeterministic(): boolean {
    for (const state of this.states.values()) {
      const seenSymbols = new Set<string>();

      for (const data of state.transitions.values()) {
        for (const symbol of data.map(d => d.inputSymbol)) {
          if (symbol === EPSILON) return false;
          if (seenSymbols.has(symbol)) return false;
          seenSymbols.add(symbol);
        }
      }
    }
    return true;
  }
}
