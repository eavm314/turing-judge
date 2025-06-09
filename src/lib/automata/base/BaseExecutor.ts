export type TransitionStep = [string, string, string]; // [from, to, symbol]

export interface ExecutionResult {
  accepted: boolean;
  depthLimitReached: boolean;
  maxLimitReached: boolean;
  path: TransitionStep[];
}

export type StepResult = {
  consuming: TransitionStep[]; // [from, to, symbol]
  epsilon: TransitionStep[]; // [from, to, "ε"]
};

export type ExecutionConfig = {
  depthLimit: number;
  maxSteps: number;
};

export type StepInput = string;

export abstract class BaseExecutor {
  private config: ExecutionConfig;

  constructor() {
    this.config = { depthLimit: 500, maxSteps: 10000 };
  }

  getConfig() {
    return this.config;
  }

  setConfig(config: ExecutionConfig) {
    this.config = config;
  }

  abstract countStates(): number;

  abstract isDeterministic(): boolean;

  abstract step(input: StepInput, stateName: string): StepResult;

  abstract execute(inputString: string, savePath?: boolean): ExecutionResult;
}
