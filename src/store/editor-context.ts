import { DFA } from "@/lib/automaton/DFA";
import { create } from "zustand";
import { dfaExample } from "./data";
import { useShallow } from "zustand/react/shallow";

type EditorMode = "state" | "transition";

type EditorState = {
  automaton: DFA;
  mode: EditorMode,
}

type EditorActions = {
  updateAutomaton: (callback: (automaton: DFA) => void) => void;
  setMode: (newMode: EditorMode) => void,
}

export const useEditorStore = create<EditorState & EditorActions>((set) => ({
  mode: "state",
  automaton: new DFA(dfaExample),

  setMode: (newMode: EditorMode) => set({ mode: newMode }),
  updateAutomaton: (callback) => {
    set((state) => {
      const newAutomaton = state.automaton.clone();
      callback(newAutomaton);
      return { automaton: newAutomaton };
    });
  }
}))


export const useAutomaton = () => useEditorStore(useShallow((state) => ({ automaton: state.automaton, updateAutomaton: state.updateAutomaton })));
export const useEditor = () => useEditorStore(useShallow((state) => ({ mode: state.mode, setMode: state.setMode })));