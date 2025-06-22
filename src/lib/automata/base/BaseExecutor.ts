export interface Step<TransInput, TransOutput> {
  input: TransInput;
  output: TransOutput;
}

export interface ExecutionResult<TransInput, TransOutput> {
  accepted: boolean;
  depthLimitReached: boolean;
  maxLimitReached: boolean;
  path: Step<TransInput, TransOutput>[];
}

export interface ExecutionConfig {
  depthLimit: number;
  maxSteps: number;
}

export abstract class BaseExecutor<TransInput, TransOutput> {
  private config: ExecutionConfig;

  protected initial!: string;
  protected finals!: Set<string>;
  protected states!: Map<string, Map<string, TransOutput[]>>;

  constructor() {
    this.config = { depthLimit: 500, maxSteps: 10000 };
  }

  getConfig() {
    return this.config;
  }

  setConfig(config: ExecutionConfig) {
    this.config = config;
  }

  countStates(): number {
    return this.states.size;
  }

  abstract isDeterministic(): boolean;

  abstract transFn(input: TransInput): TransOutput[];

  abstract execute(
    inputString: string,
    savePath: boolean,
  ): ExecutionResult<TransInput, TransOutput>;
}
