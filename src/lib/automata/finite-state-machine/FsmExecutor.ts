import { EPSILON } from '@/constants/symbols';
import { type JsonFsm } from '@/lib/schemas/finite-state-machine';
import { BaseExecutor, type TransitionStep } from '../base/BaseExecutor';

interface ExecutionNode {
  state: string;
  inputPos: number;
  path: TransitionStep[];
  depth: number;
}

export class FsmExecutor extends BaseExecutor {
  private steps: number;

  private initial: string;
  private finals: Set<string>;
  private states: Map<string, Map<string, string[]>>;

  constructor(initialAutomaton: JsonFsm) {
    super();
    this.steps = 0;
    this.states = new Map<string, Map<string, string[]>>();
    this.initial = '';
    this.finals = new Set<string>();

    this.startAutomaton(initialAutomaton);
  }

  countStates(): number {
    return this.states.size;
  }

  isDeterministic(): boolean {
    for (const transitions of this.states.values()) {
      for (const [symbol, targets] of transitions.entries()) {
        if (symbol === EPSILON || targets.length > 1) {
          return false;
        }
      }
    }
    return true;
  }

  startAutomaton(automaton: JsonFsm): void {
    this.initial = automaton.initial;
    this.finals = new Set(automaton.finals);
    for (const [name, state] of Object.entries(automaton.states)) {
      const transitions = new Map<string, string[]>();
      for (const [target, symbols] of Object.entries(state.transitions ?? {})) {
        for (const symbol of symbols) {
          if (!transitions.has(symbol)) {
            transitions.set(symbol, []);
          }
          transitions.get(symbol)!.push(target);
        }
      }
      this.states.set(name, transitions);
    }
  }

  step(inputSymbol: string, stateName: string) {
    this.steps++;
    const consuming: TransitionStep[] = [];
    const epsilon: TransitionStep[] = [];

    const state = this.states.get(stateName);
    if (!state) throw new Error(`State ${stateName} not found`);

    // Transitions that consume the current symbol
    const targets = state.get(inputSymbol) || [];
    for (const target of targets) {
      consuming.push([stateName, target, inputSymbol]);
    }

    // Epsilon transitions
    const epsilonTargets = state.get(EPSILON) || [];
    for (const target of epsilonTargets) {
      epsilon.push([stateName, target, EPSILON]);
    }

    return { consuming, epsilon };
  }

  execute(input: string, savePath: boolean = false) {
    const config = this.getConfig();
    this.steps = 0;
    let depthLimitReached = false;

    const stack: ExecutionNode[] = [];
    stack.push({ state: this.initial, inputPos: 0, path: [], depth: 0 });

    let lastPath: TransitionStep[] = [];

    while (stack.length > 0) {
      const { state, inputPos, path, depth } = stack.pop()!;
      lastPath = path;

      if (inputPos === input.length && this.finals.has(state)) {
        return {
          accepted: true,
          depthLimitReached,
          maxLimitReached: false,
          path,
        };
      }

      if (this.steps > config.maxSteps) {
        return {
          accepted: false,
          depthLimitReached,
          maxLimitReached: true,
          path: lastPath,
        };
      }

      if (depth > config.depthLimit) {
        depthLimitReached = true;
        continue;
      }

      const symbol = input[inputPos] ?? '';
      const { consuming, epsilon } = this.step(symbol, state);

      // First, push epsilon transitions (they don't consume input)
      for (const [from, to, transitionSymbol] of epsilon) {
        stack.push({
          state: to,
          inputPos: inputPos, // No change in position since epsilon doesn't consume input
          path: savePath ? [...path, [from, to, transitionSymbol]] : [],
          depth: depth + 1,
        });
      }

      // Then, push consuming transitions (they consume the input symbol)
      for (const [from, to, transitionSymbol] of consuming) {
        const nextInputPos = inputPos + 1;
        stack.push({
          state: to,
          inputPos: nextInputPos,
          path: savePath ? [...path, [from, to, transitionSymbol]] : [],
          depth: depth + 1,
        });
      }
    }

    return {
      accepted: false,
      depthLimitReached,
      maxLimitReached: false,
      path: lastPath,
    };
  }
}
