import { BLANK, EPSILON, TM_MOVES } from '@/constants/symbols';
import { BaseExecutor, type Step } from '../base/BaseExecutor';
import { type JsonTm } from '@/lib/schemas/turing-machine';

type TmInput = {
  state: string;
  readSymbol: string;
  position: number;
};

type TmOutput = {
  state: string;
  writeSymbol: string;
  direction: typeof TM_MOVES[number];
};

type TmStep = Step<TmInput, TmOutput>;

type ExecutionNode = {
  state: string;
  inputPos: number;
  tape: Map<number, string>;
  path: TmStep[];
  depth: number;
};

export class TmExecutor extends BaseExecutor<TmInput, TmOutput> {
  constructor(initialAutomaton: JsonTm) {
    super();
    this.startAutomaton(initialAutomaton);
  }

  isDeterministic(): boolean {
    for (const transitions of this.states.values()) {
      const seen = new Set<string>();

      for (const key of transitions.keys()) {
        const [input] = key.split('|');
        if (input === EPSILON) return false;
        if (seen.has(key)) return false;

        seen.add(key);
      }
    }

    return true;
  }

  startAutomaton(automaton: JsonTm): void {
    this.states = new Map();

    this.initial = automaton.initial;
    this.finals = new Set(automaton.finals);

    for (const [stateName, stateData] of Object.entries(automaton.states)) {
      const transitions = new Map<string, TmOutput[]>();

      for (const [target, transList] of Object.entries(stateData.transitions || {})) {
        for (const t of transList) {
          if (!transitions.has(t.read)) {
            transitions.set(t.read, []);
          }
          transitions.get(t.read)!.push({
            state: target,
            writeSymbol: t.write,
            direction: t.move,
          });
        }
      }

      this.states.set(stateName, transitions);
    }
  }

  transFn(input: TmInput): TmOutput[] {
    const transitions = this.states.get(input.state);

    const targets = transitions?.get(input.readSymbol) ?? [];
    return targets;
  }

  execute(word: string, savePath = false) {
    let steps = 0;
    let depthLimitReached = false;

    const initialTapeItems = word.split('').map((char, index) => [index, char] as const);

    const executionStack: ExecutionNode[] = [
      {
        state: this.initial,
        inputPos: 0,
        tape: new Map(initialTapeItems),
        path: [],
        depth: 0,
      },
    ];

    let lastPath: TmStep[] = [];

    while (executionStack.length > 0) {
      steps++;
      const { state, inputPos, tape, path, depth } = executionStack.pop()!;
      lastPath = path;
      if (this.finals.has(state)) {
        return {
          accepted: true,
          depthLimitReached,
          maxLimitReached: false,
          path,
        };
      }

      if (steps > this.config.maxSteps) {
        return {
          accepted: false,
          depthLimitReached,
          maxLimitReached: true,
          path: lastPath,
        };
      }

      if (depth > this.config.depthLimit) {
        depthLimitReached = true;
        continue;
      }

      const epsilonInput = { state, readSymbol: EPSILON, position: inputPos };
      const epsilonTargets = this.transFn(epsilonInput);
      // Epsilon transitions
      for (const output of epsilonTargets) {
        const currentStep: TmStep = { input: epsilonInput, output };

        executionStack.push({
          state: output.state,
          inputPos,
          tape: new Map(tape),
          path: savePath ? [...path, currentStep] : [],
          depth: depth + 1,
        });
      }

      // Consuming transitions
      const readSymbol = tape.get(inputPos) ?? BLANK;
      const input = { state, readSymbol, position: inputPos };
      const targets = this.transFn(input);
      for (const output of targets) {
        const currentStep: TmStep = { input, output };

        const newTape = new Map(tape);
        newTape.set(inputPos, output.writeSymbol);

        const newInputPos =
          output.direction === 'R'
            ? inputPos + 1
            : output.direction === 'L'
              ? inputPos - 1
              : inputPos;

        executionStack.push({
          state: output.state,
          inputPos: newInputPos,
          tape: newTape,
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

  executeRandom(word: string, savePath = false, random: () => number = Math.random) {
    let steps = 0;
    let depthLimitReached = false;

    const initialTapeItems = word.split('').map((char, index) => [index, char] as const);

    let state = this.initial;
    let inputPos = 0;
    let tape = new Map(initialTapeItems);
    let depth = 0;
    const path: TmStep[] = [];

    while (true) {
      steps++;

      if (this.finals.has(state)) {
        return {
          accepted: true,
          depthLimitReached,
          maxLimitReached: false,
          path,
        };
      }

      if (steps > this.config.maxSteps) {
        return {
          accepted: false,
          depthLimitReached,
          maxLimitReached: true,
          path,
        };
      }

      if (depth > this.config.depthLimit) {
        depthLimitReached = true;
        return {
          accepted: false,
          depthLimitReached,
          maxLimitReached: false,
          path,
        };
      }

      const candidates: Array<{
        state: string;
        inputPos: number;
        tape: Map<number, string>;
        step: TmStep;
      }> = [];

      const epsilonInput = { state, readSymbol: EPSILON, position: inputPos };
      const epsilonTargets = this.transFn(epsilonInput);
      for (const output of epsilonTargets) {
        candidates.push({
          state: output.state,
          inputPos,
          tape: new Map(tape),
          step: { input: epsilonInput, output },
        });
      }

      const readSymbol = tape.get(inputPos) ?? BLANK;
      const consumingInput = { state, readSymbol, position: inputPos };
      const consumingTargets = this.transFn(consumingInput);
      for (const output of consumingTargets) {
        const newTape = new Map(tape);
        newTape.set(inputPos, output.writeSymbol);

        const newInputPos =
          output.direction === 'R'
            ? inputPos + 1
            : output.direction === 'L'
              ? inputPos - 1
              : inputPos;

        candidates.push({
          state: output.state,
          inputPos: newInputPos,
          tape: newTape,
          step: { input: consumingInput, output },
        });
      }

      if (candidates.length === 0) {
        return {
          accepted: false,
          depthLimitReached,
          maxLimitReached: false,
          path,
        };
      }

      const randomIndex = Math.min(
        candidates.length - 1,
        Math.floor(Math.max(0, random()) * candidates.length),
      );
      const selected = candidates[randomIndex]!;

      if (savePath) {
        path.push(selected.step);
      }

      state = selected.state;
      inputPos = selected.inputPos;
      tape = selected.tape;
      depth++;
    }
  }
}
