export type Step<TIn, TOut> = {
  input: TIn;
  output: TOut;
};

export type ExecutionResult<TIn, TOut> = {
  accepted: boolean;
  depthLimitReached: boolean;
  maxLimitReached: boolean;
  path: Step<TIn, TOut>[];
}

export type ExecutionConfig = {
  depthLimit: number;
  maxSteps: number;
}

export abstract class BaseExecutor<TIn = unknown, TOut = unknown> {
  #config: ExecutionConfig;

  protected initial!: string;
  protected finals!: Set<string>;
  protected states!: Map<string, Map<string, TOut[]>>;

  constructor() {
    this.#config = { depthLimit: 500, maxSteps: 10000 };
  }

  get config() {
    return this.#config;
  }

  set config(value: ExecutionConfig) {
    this.#config = value;
  }

  countStates(): number {
    return this.states.size;
  }

  getInitialState() {
    return this.initial;
  }

  abstract isDeterministic(): boolean;

  abstract transFn(input: TIn): TOut[];

  abstract execute(
    inputString: string,
    savePath: boolean,
  ): ExecutionResult<TIn, TOut>;
}
