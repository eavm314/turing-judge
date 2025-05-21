import { type AutomatonCode } from "@/lib/schemas/automaton-code";
import { type JsonState } from "@/lib/schemas/finite-state-machine";

export interface AutomatonDesigner {
  toJson(): AutomatonCode;

  addState(name: string, stateJson: JsonState): void;
  removeState(id: number): void;

  addTransition(from: number, to: number, symbols: string[], extra?: any): void;
  removeTransition(from: number, to: number): void;

  switchFinal(id: number): void;
  moveState(id: number, position: { x: number; y: number }): void;
  renameState(id: number, name: string): void;

  getUsedSymbols(): Set<string>;
  isDeterministic(): boolean;
}
