import { create } from "zustand";
import { Automaton } from "@/lib/automaton/Automaton";

type AutomatonStore = {
  automaton: Automaton;
  updateAutomaton: (callback: (automaton: Automaton) => void) => void;
}

export const useAutomaton = create<AutomatonStore>((set) => ({
  automaton: new Automaton(),
  
  updateAutomaton: (callback) => {
    set((state) => {
      const newAutomaton = state.automaton.clone();
      callback(newAutomaton);
      return { automaton: newAutomaton };
    });
  }
}))
