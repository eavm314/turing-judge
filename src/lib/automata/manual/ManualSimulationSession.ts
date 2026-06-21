class ManualSimulationMemento<TState> {
  constructor(public readonly state: TState) {}
}

class ManualSimulationOriginator<TState> {
  constructor(
    private state: TState,
    private readonly cloneState: (state: TState) => TState,
  ) {}

  getState() {
    return this.cloneState(this.state);
  }

  setState(state: TState) {
    this.state = this.cloneState(state);
  }

  createMemento() {
    return new ManualSimulationMemento(this.getState());
  }

  restore(memento: ManualSimulationMemento<TState>) {
    this.state = this.cloneState(memento.state);
  }
}

class ManualSimulationCaretaker<TState> {
  private history: ManualSimulationMemento<TState>[] = [];

  push(memento: ManualSimulationMemento<TState>) {
    this.history.push(memento);
  }

  pop() {
    return this.history.pop();
  }

  clear() {
    this.history = [];
  }

  get size() {
    return this.history.length;
  }
}

export class ManualSimulationSession<TState> {
  private readonly originator: ManualSimulationOriginator<TState>;
  private readonly caretaker = new ManualSimulationCaretaker<TState>();
  private readonly initialState: TState;

  private stepCount = 0;

  constructor(
    initialState: TState,
    private readonly cloneState: (state: TState) => TState,
  ) {
    this.initialState = this.cloneState(initialState);
    this.originator = new ManualSimulationOriginator(this.initialState, this.cloneState);
  }

  getState() {
    return this.originator.getState();
  }

  commit(nextState: TState) {
    this.caretaker.push(this.originator.createMemento());
    this.originator.setState(nextState);
    this.stepCount++;
    return this.getState();
  }

  undo() {
    const previous = this.caretaker.pop();
    if (!previous) {
      return null;
    }

    this.originator.restore(previous);
    this.stepCount = Math.max(0, this.stepCount - 1);
    return this.getState();
  }

  reset() {
    this.caretaker.clear();
    this.stepCount = 0;
    this.originator.setState(this.initialState);
    return this.getState();
  }

  canUndo() {
    return this.caretaker.size > 0;
  }

  getStepCount() {
    return this.stepCount;
  }
}
