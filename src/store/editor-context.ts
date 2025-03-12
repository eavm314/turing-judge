import { FiniteStateMachine } from "@/lib/automaton/FiniteStateMachine";
import { create } from "zustand";
import { dfaExample, nfaExample } from "./data";
import { useShallow } from "zustand/react/shallow";

type EditorMode = "state" | "transition";

type EditorState = {
  automaton: FiniteStateMachine;
  mode: EditorMode,
}

type EditorActions = {
  updateAutomaton: (callback: (automaton: FiniteStateMachine) => void) => void;
  setMode: (newMode: EditorMode) => void,
}

export const useEditorStore = create<EditorState & EditorActions>((set) => ({
  mode: "state",
  automaton: new FiniteStateMachine(dfaExample),

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