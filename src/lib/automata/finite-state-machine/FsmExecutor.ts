import { EPSILON } from '@/constants/symbols';
import { type JsonFsm } from '@/lib/schemas/finite-state-machine';
import { BaseExecutor, type Step } from '../base/BaseExecutor';

type FsmInput = {
  state: string;
  symbol: string;
};

type FsmOutput = string; // Target state name

type FsmStep = Step<FsmInput, FsmOutput>;

interface ExecutionNode {
  state: string;
  inputPos: number;
  path: FsmStep[];
  depth: number;
}

export class FsmExecutor extends BaseExecutor<FsmInput, FsmOutput> {
  constructor(initialAutomaton: JsonFsm) {
    super();
    this.startAutomaton(initialAutomaton);
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
    this.states = new Map();

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

  transFn(input: FsmInput): FsmOutput[] {
    const transitions = this.states.get(input.state);

    const targets = transitions?.get(input.symbol) ?? [];
    return targets;
  }

  execute(input: string, savePath: boolean = false) {
    let steps = 0;
    let depthLimitReached = false;
    const config = this.getConfig();

    const stack: ExecutionNode[] = [];
    stack.push({ state: this.initial, inputPos: 0, path: [], depth: 0 });

    let lastPath: FsmStep[] = [];

    while (stack.length > 0) {
      steps++;
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

      if (steps > config.maxSteps) {
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

      // First, push epsilon transitions (they don't consume input)
      const epsilonTargets = this.transFn({ state, symbol: EPSILON });
      for (const target of epsilonTargets) {
        const currentStep: FsmStep = {
          input: { state, symbol: EPSILON },
          output: target,
        };
        stack.push({
          state: target,
          inputPos, // No change in position since it's an epsilon transition
          path: savePath ? [...path, currentStep] : [],
          depth: depth + 1,
        });
      }

      // Then, push consuming transitions (they consume the input symbol)
      const symbol = input[inputPos] ?? '';
      const targets = this.transFn({ state, symbol });
      for (const target of targets) {
        const currentStep: FsmStep = {
          input: { state, symbol },
          output: target,
        };
        stack.push({
          state: target,
          inputPos: inputPos + 1,
          path: savePath ? [...path, currentStep] : [],
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
