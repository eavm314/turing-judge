import { StateNodeType } from '@/components/playground/Canvas/state-node';
import { TransitionEdgeType } from '@/components/playground/Canvas/transition-edge';
import { BLANK, EPSILON } from '@/constants/symbols';
import { AutomatonDesign, BaseDesigner } from '@/lib/automata/base/BaseDesigner';
import { JsonTm, JsonTmState } from '@/lib/schemas/turing-machine';
import { TmState, TmTransitionData } from './TmState';

export class TmDesigner extends BaseDesigner {
  protected states: Map<number, TmState>;

  constructor(json: JsonTm) {
    super();
    this.states = new Map();
    this.alphabet = new Set(json.alphabet);
    this.alphabet.add(BLANK);

    // Convert JSON to Objects
    this.stateToIndex = new Map([[json.initial, 0]]);
    for (const name of Object.keys(json.states).filter(name => name !== json.initial)) {
      const stateId = Math.max(...this.stateToIndex.values()) + 1;
      this.stateToIndex.set(name, stateId);
    }

    for (const [name, value] of Object.entries(json.states)) {
      const state = new TmState(this, name, value);
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
      alphabet: this.getAlphabet(),
      states,
      initial,
      finals,
    };

    return {
      type: 'TM' as const,
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
        state.transitions
          .entries()
          .filter(([, tr]) => tr.length > 0)
          .map(([target, transition]) => ({
            id: `${state.id}->${target}`,
            source: String(state.id),
            target: String(target),
            data: { transition },
          })),
      )
      .toArray();

    const design = {
      type: 'TM' as const,
      nodes,
      edges,
      alphabet: this.getAlphabet(),
      isDeterministic: this.isDeterministic(),
    };
    return design;
  }

  addState(name: string, stateJson: JsonTmState) {
    if (this.stateToIndex.get(name)) throw new Error('State already exists');
    const stateId = Math.max(...this.stateToIndex.values()) + 1;

    this.stateToIndex.set(name, stateId);
    this.states.set(stateId, new TmState(this, name, stateJson));
  }

  addTransition(from: number, to: number, data: TmTransitionData[]) {
    const symbSet = new Set(data.flatMap(d => [d.read, d.write]));
    if (symbSet.difference(this.alphabet).size > 0) throw new Error('Symbols not in alphabet');

    const source = this.states.get(from);
    if (!source) throw new Error('Source state does not exist');

    source.addTransition(to, data);
  }

  isDeterministic(): boolean {
    for (const state of this.states.values()) {
      const seenSymbols = new Set<string>();

      for (const data of state.transitions.values()) {
        for (const symbol of data.map(d => d.read)) {
          if (symbol === EPSILON) return false;
          if (seenSymbols.has(symbol)) return false;
          seenSymbols.add(symbol);
        }
      }
    }
    return true;
  }
}
