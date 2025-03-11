export interface JsonState {
  name: string,
  position: { x: number, y: number },
  transitions: Record<string, string[]>
}

export class State {
  name: string;
  position: { x: number, y: number }
  isFinal: boolean;
  transitions: Map<string, string[]>;

  constructor(json: JsonState) {
    this.name = json.name;
    this.position = json.position;
    this.isFinal = false;
    this.transitions = new Map();

    for (const [symbol, targets] of Object.entries(json.transitions)) {
      this.addTransition([symbol], targets);
    }
  }

  setFinal(value: boolean) {
    this.isFinal = value;
  }

  setPosition({ x, y }: { x: number, y: number }) {
    this.position = { x, y };
  }

  addTransition(symbols: string[], targets: string[]) {
    symbols.forEach(symbol => {
      if (this.transitions.has(symbol)) {
        this.transitions.get(symbol)!.push(...targets);
      } else {
        this.transitions.set(symbol, targets);
      }
    });
  }

  removeTransition(to: string) {
    this.transitions.forEach((targets, symbol) => {
      this.transitions.set(symbol, targets.filter(target => target !== to));
    });
  }
}