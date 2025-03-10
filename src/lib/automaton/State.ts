export interface JsonState {
  name: string,
  position: { x: number, y: number },
  transitions: Record<string, string>
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

    for (const [symbol, target] of Object.entries(json.transitions)) {
      this.addTransition([symbol], target);
    }
  }

  setFinal(value: boolean) {
    this.isFinal = value;
  }

  setPosition({ x, y }: { x: number, y: number }) {
    this.position = { x, y };
  }

  addTransition(symbols: string[], target: string) {
    symbols.forEach(symbol => {
      if (this.transitions.has(symbol)) {
        this.transitions.get(symbol)!.push(target);
      } else {
        this.transitions.set(symbol, [target]);
      }
    });
  }

  removeTransition(to: string) {
    this.transitions.forEach((targets, symbol) => {
      this.transitions.set(symbol, targets.filter(target => target !== to));
    });
  }
}