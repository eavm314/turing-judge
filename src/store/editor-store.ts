import AutomatonExecutor from "@/lib/automaton/AutomatonExecutor";
import { FiniteStateMachine } from "@/lib/automaton/FiniteStateMachine";
import { createStore } from 'zustand/vanilla';
import { examples } from "./data";

type EditorMode = "state" | "transition";

export type EditorState = {
  automaton: FiniteStateMachine;
  mode: EditorMode,
}

export type EditorActions = {
  setExample: (key: string) => void;
  updateAutomaton: (callback: (automaton: FiniteStateMachine) => void) => void;
  setMode: (newMode: EditorMode) => void,
}

export type EditorStore = EditorState & EditorActions;

const defaultState: EditorState = {
  mode: "state",
  automaton: new FiniteStateMachine(),
};

export const createEditorStore = (initialState?: Partial<EditorState>) => {
  return createStore<EditorStore>()((set) => ({
    ...defaultState,
    ...initialState,
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
  }));
}