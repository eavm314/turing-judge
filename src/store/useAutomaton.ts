import { create } from "zustand";
import { DFA } from "@/lib/automaton/DFA";

const dfaExample = {
  alphabet: ["0", "1"],
  states: [
    { name: "q0", position: { x: 0, y: 0 }, transitions: { "0": "q2", "1": "q0" } },
    { name: "q1", position: { x: 200, y: 0 }, transitions: { "0": "q1", "1": "q1" } },
    { name: "q2", position: { x: 100, y: 0 }, transitions: { "0": "q2", "1": "q1" } },
  ],
  initial: "q0",
  finals: ["q1"]
}

type AutomatonStore = {
  automaton: DFA;
  updateAutomaton: (callback: (automaton: DFA) => void) => void;
}

export const useAutomaton = create<AutomatonStore>((set) => ({
  automaton: new DFA(dfaExample),

  updateAutomaton: (callback) => {
    set((state) => {
      const newAutomaton = state.automaton.clone();
      callback(newAutomaton);
      return { automaton: newAutomaton };
    });
  }
}))
