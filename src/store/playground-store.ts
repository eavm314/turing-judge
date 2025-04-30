import { AutomatonCode } from "@/dtos";
import AutomatonExecutor from "@/lib/automaton/AutomatonExecutor";
import { FiniteStateMachine } from "@/lib/automaton/FiniteStateMachine";
import { createStore } from "zustand/vanilla";

export type PlaygroundMode = "states" | "transitions" | "simulation" | "viewer";

export type PlaygroundState = {
  automaton: FiniteStateMachine;
  mode: PlaygroundMode;
  isOwner: boolean;
  unsavedChanges: boolean;
};

export type PlaygroundActions = {
  setAutomaton: (code: AutomatonCode) => void;
  updateAutomaton: (callback: (automaton: FiniteStateMachine) => void) => void;
  setMode: (newMode: PlaygroundMode) => void;
  saveChanges: () => void;
};

export type PlaygroundStore = PlaygroundState & PlaygroundActions;

const defaultState: PlaygroundState = {
  mode: "states",
  automaton: new FiniteStateMachine(),
  isOwner: true,
  unsavedChanges: false,
};

export const createPlaygroundStore = (
  initialState?: Partial<PlaygroundState>,
) => {
  const initialStateWithDefaults = {
    ...defaultState,
    ...initialState,
  };
  AutomatonExecutor.setAutomaton(initialStateWithDefaults.automaton);
  return createStore<PlaygroundStore>()((set) => ({
    ...initialStateWithDefaults,
    setMode: (newMode: PlaygroundMode) => set({ mode: newMode }),
    setAutomaton: (code: AutomatonCode) => {
      const automaton = new FiniteStateMachine(code.automaton);
      set({ automaton, unsavedChanges: true });
    },
    updateAutomaton: (callback) => {
      set((state) => {
        const newAutomaton = state.automaton.clone();
        callback(newAutomaton);
        AutomatonExecutor.setAutomaton(newAutomaton);
        return { automaton: newAutomaton, unsavedChanges: true };
      });
    },
    saveChanges: () => set({ unsavedChanges: false }),
  }));
};
