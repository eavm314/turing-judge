import { FiniteStateMachine } from "@/lib/automaton/FiniteStateMachine";
import { create } from "zustand";
import { examples } from "./data";
import { useShallow } from "zustand/react/shallow";
import AutomatonExecutor from "@/lib/automaton/AutomatonExecutor";

type EditorMode = "state" | "transition";

type EditorState = {
  automaton: FiniteStateMachine;
  mode: EditorMode,
}

type EditorActions = {
  setExample: (key: string) => void;
  updateAutomaton: (callback: (automaton: FiniteStateMachine) => void) => void;
  setMode: (newMode: EditorMode) => void,
}

export const useEditorStore = create<EditorState & EditorActions>((set) => ({
  mode: "state",
  automaton: new FiniteStateMachine(),

  setMode: (newMode: EditorMode) => set({ mode: newMode }),
  setExample: (key: string) => {
    const newAutomaton = new FiniteStateMachine(examples[key]);
    AutomatonExecutor.setAutomaton(newAutomaton);
    set({ automaton: newAutomaton });
  },
  updateAutomaton: (callback) => {
    set((state) => {
      const newAutomaton = state.automaton.clone();
      callback(newAutomaton);
      AutomatonExecutor.setAutomaton(newAutomaton);
      return { automaton: newAutomaton };
    });
  }
}))


export const useAutomaton = () => useEditorStore(useShallow((state) => ({
  automaton: state.automaton,
  updateAutomaton: state.updateAutomaton,
  setExample: state.setExample
})));

export const useEditorMode = () => useEditorStore(useShallow((state) => ({
  mode: state.mode,
  setMode: state.setMode
})));