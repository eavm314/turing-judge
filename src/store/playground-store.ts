import AutomatonExecutor from "@/lib/automaton/AutomatonExecutor";
import { FiniteStateMachine } from "@/lib/automaton/FiniteStateMachine";
import { createStore } from 'zustand/vanilla';
import { examples } from "./data";

export type PlaygroundMode = "states" | "transitions" | "simulation" | "viewer";

export type PlaygroundState = {
  automaton: FiniteStateMachine;
  mode: PlaygroundMode,
  isOwner: boolean,
}

export type PlaygroundActions = {
  setExample: (key: string) => void;
  updateAutomaton: (callback: (automaton: FiniteStateMachine) => void) => void;
  setMode: (newMode: PlaygroundMode) => void,
}

export type PlaygroundStore = PlaygroundState & PlaygroundActions;

const defaultState: PlaygroundState = {
  mode: "states",
  automaton: new FiniteStateMachine(),
  isOwner: true,
};

export const createPlaygroundStore = (initialState?: Partial<PlaygroundState>) => {
  const initialStateWithDefaults = {
    ...defaultState,
    ...initialState,
  };

  AutomatonExecutor.setAutomaton(initialStateWithDefaults.automaton);
  return createStore<PlaygroundStore>()((set) => ({
    ...initialStateWithDefaults,
    setMode: (newMode: PlaygroundMode) => set({ mode: newMode }),
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