export interface JsonState {
  name: string,
  position: { x: number, y: number },
  transitions: Record<string, string>
}

export class State {
  name: string;
  position: { x: number, y: number }
  isFinal: boolean;
  transitions: Map<string, string>;

  constructor(json: JsonState) {
    this.name = json.name;
    this.position = json.position;
    this.isFinal = false;
    this.transitions = new Map();

    for (const [symbol, target] of Object.entries(json.transitions)) {
      this.addTransition(symbol, target);
    }
  }

  setFinal(value: boolean) {
    this.isFinal = value;
  }

  setPosition(x: number, y: number) {
    this.position = { x, y };
  }

  addTransition(symbol: string, target: string) {
    this.transitions.set(symbol, target);
  }

  removeTransition(symbol: string) {
    this.transitions.delete(symbol);
  }
}