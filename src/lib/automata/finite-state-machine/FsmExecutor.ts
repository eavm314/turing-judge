import { EPSILON } from "@/constants/symbols";
import { FsmDesigner } from "./FsmDesigner";
import { type AutomatonExecutor, type TransitionStep } from "../base/Executor";
import { State } from "./State";

interface ExecutionNode {
  stateId: number;
  inputPos: number;
  path: TransitionStep[];
  depth: number;
}

export class FsmExecutor implements AutomatonExecutor {
  private automaton: FsmDesigner;

  private config = { depthLimit: 500, maxSteps: 10000 };

  private steps = 0;

  constructor() {
    this.automaton = new FsmDesigner();
  }

  getAutomaton() {
    return this.automaton.toJson();
  }

  setAutomaton(automaton: FsmDesigner) {
    this.automaton = automaton;
  }

  getConfig() {
    return this.config;
  }

  setConfig(config: typeof this.config) {
    this.config = config;
  }

  step(inputSymbol: string, state: State) {
    this.steps++;
    const consuming: TransitionStep[] = [];
    const epsilon: TransitionStep[] = [];

    // Transitions that consume the current symbol
    const targets = state.transitions.get(inputSymbol) || [];
    for (const target of targets) {
      consuming.push([state.id, target, inputSymbol]);
    }

    // Epsilon transitions
    const epsilonTargets = state.transitions.get(EPSILON) || [];
    for (const target of epsilonTargets) {
      epsilon.push([state.id, target, EPSILON]);
    }

    return { consuming, epsilon };
  }

  execute(input: string, savePath: boolean = false){
    this.steps = 0;
    let depthLimitReached = false;

    const stack: ExecutionNode[] = [];
    stack.push({ stateId: 0, inputPos: 0, path: [], depth: 0 });

    let lastPath: TransitionStep[] = [];

    while (stack.length > 0) {
      const { stateId, inputPos, path, depth } = stack.pop()!;
      const state = this.automaton.states.get(stateId)!;
      lastPath = path;

      if (inputPos === input.length && state.isFinal) {
        return {
          accepted: true,
          depthLimitReached,
          maxLimitReached: false,
          path,
        };
      }

      if (this.steps > this.config.maxSteps) {
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

      const symbol = input[inputPos] ?? "";
      const { consuming, epsilon } = this.step(symbol, state);

      // First, push epsilon transitions (they don't consume input)
      for (const [from, to, transitionSymbol] of epsilon) {
        stack.push({
          stateId: to,
          inputPos: inputPos, // No change in position since epsilon doesn't consume input
          path: savePath ? [...path, [from, to, transitionSymbol]] : [],
          depth: depth + 1,
        });
      }

      // Then, push consuming transitions (they consume the input symbol)
      for (const [from, to, transitionSymbol] of consuming) {
        const nextInputPos = inputPos + 1;
        stack.push({
          stateId: to,
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