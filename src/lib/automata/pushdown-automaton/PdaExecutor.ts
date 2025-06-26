import { BOTTOM, EPSILON } from '@/constants/symbols';
import { type JsonPda } from '@/lib/schemas/pushdown-automaton';
import { BaseExecutor, type Step } from '../base/BaseExecutor';

type PdaInput = {
  state: string;
  inputSymbol: string;
  stackTop: string;
};

type PdaOutput = {
  state: string;
  push: string[];
};

type PdaStep = Step<PdaInput, PdaOutput>;

interface ExecutionNode {
  state: string;
  inputPos: number;
  stack: string[];
  path: PdaStep[];
  depth: number;
}

export class PdaExecutor extends BaseExecutor<PdaInput, PdaOutput> {
  constructor(initialAutomaton: JsonPda) {
    super();
    this.startAutomaton(initialAutomaton);
  }

  isDeterministic(): boolean {
    for (const transitions of this.states.values()) {
      const seen = new Set<string>();

      for (const key of transitions.keys()) {
        const [input, _] = key.split('|');
        if (input === EPSILON) return false;
        if (seen.has(key)) return false;

        seen.add(key);
      }
    }

    return true;
  }

  startAutomaton(automaton: JsonPda): void {
    this.states = new Map();

    this.initial = automaton.initial;
    this.finals = new Set(automaton.finals);

    for (const [stateName, stateData] of Object.entries(automaton.states)) {
      const transitions = new Map<string, PdaOutput[]>();

      for (const [target, transList] of Object.entries(stateData.transitions || {})) {
        for (const t of transList) {
          const key = `${t.input}|${t.pop}`;
          if (!transitions.has(key)) {
            transitions.set(key, []);
          }
          transitions.get(key)!.push({
            state: target,
            push: t.push?.toReversed() ?? [],
          });
        }
      }

      this.states.set(stateName, transitions);
    }
  }

  transFn(input: PdaInput): PdaOutput[] {
    const transitions = this.states.get(input.state);

    const key = `${input.inputSymbol}|${input.stackTop}`;

    const targets = transitions?.get(key) ?? [];
    return targets;
  }

  execute(word: string, savePath = false) {
    let steps = 0;
    let depthLimitReached = false;
    const config = this.getConfig();

    const executionStack: ExecutionNode[] = [
      {
        state: this.initial,
        inputPos: 0,
        stack: [BOTTOM],
        path: [],
        depth: 0,
      },
    ];

    let lastPath: PdaStep[] = [];

    while (executionStack.length > 0) {
      steps++;
      const { state, inputPos, stack, path, depth } = executionStack.pop()!;
      lastPath = path;
      if (inputPos === word.length && this.finals.has(state) && stack.length > 0) {
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

      const inputSymbol = word[inputPos] ?? '';
      const stackTop = stack.pop();
      if (!stackTop) continue;

      const epsilonInput = { state, inputSymbol: EPSILON, stackTop };

      const epsilonTargets = this.transFn(epsilonInput);
      // Epsilon transitions
      for (const output of epsilonTargets) {
        const currentStep: PdaStep = { input: epsilonInput, output };

        executionStack.push({
          state: output.state,
          inputPos,
          stack: [...stack, ...output.push],
          path: savePath ? [...path, currentStep] : [],
          depth: depth + 1,
        });
      }

      // Consuming transitions
      const input = { state, inputSymbol, stackTop };
      const targets = this.transFn(input);
      for (const output of targets) {
        const currentStep: PdaStep = { input, output };

        executionStack.push({
          state: output.state,
          inputPos: inputPos + 1,
          stack: [...stack, ...output.push],
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
