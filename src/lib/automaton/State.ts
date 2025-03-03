export class State {
  name: string;
  isInitial: boolean;
  isFinal: boolean;

  constructor(name: string) {
    this.name = name;
    this.isInitial = true;
    this.isFinal = true;
  }
}