import { type AutomatonCode } from "@/lib/schemas/automaton-code";
import { State } from "../finite-state-machine/State";

export type ExecutionConfig = {
  depthLimit: number;
  maxSteps: number;
}

export type TransitionStep = [number, number, string]; // [from, to, symbol]

export interface ExecutionResult {
  accepted: boolean;
  depthLimitReached: boolean;
  maxLimitReached: boolean;
  path: TransitionStep[];
}

export interface AutomatonExecutor {
  getAutomaton(): AutomatonCode;

  getConfig(): ExecutionConfig;
  setConfig(config: ExecutionConfig): void;

  step(inputSymbol: string, state: State): {
    consuming: TransitionStep[]; // [from, to, symbol]
    epsilon: TransitionStep[]; // [from, to, "ε"]
  };

  execute(inputString: string): ExecutionResult;
}