import { createStore } from "zustand/vanilla";

import AutomatonExecutor from "@/lib/automata/AutomatonExecutor";
import { FiniteStateMachine } from "@/lib/automata/FiniteStateMachine";
import { AutomatonCode } from "@/lib/schemas/automaton-code";

export type PlaygroundMode = "states" | "transitions" | "simulation" | "viewer";

export type PlaygroundState = {
  automaton: FiniteStateMachine;
  mode: PlaygroundMode;
  isOwner: boolean;
  unsavedChanges: boolean;

  translation: number;
  simulationSpeed: number;
  simulationWord: string;
  simulationIndex: number;
  visitedState: string | null;
  visitedTransition: string | null;
  visitedSymbol: string | null;
};

export type PlaygroundActions = {
  setAutomaton: (code: AutomatonCode) => void;
  updateAutomaton: (callback: (automaton: FiniteStateMachine) => void) => void;
  setMode: (newMode: PlaygroundMode) => void;
  saveChanges: () => void;

  setSimulationSpeed: (speed: number) => void;
  setSimulationWord: (word: string) => void;
  setVisitedState: (state: string) => void;
  setVisitedTransition: (transition: string, symbol: string) => void;
  moveRight: () => void;
  moveLeft: () => void;
  stopSimulation: () => void;
};

export type PlaygroundStore = PlaygroundState & PlaygroundActions;

const defaultState: PlaygroundState = {
  mode: "states",
  automaton: new FiniteStateMachine(),
  isOwner: true,
  unsavedChanges: false,

  translation: 0,
  simulationSpeed: 700,
  simulationWord: "",
  simulationIndex: 0,
  visitedState: null,
  visitedTransition: null,
  visitedSymbol: null,
};

let movementTimeout: NodeJS.Timeout | undefined = undefined;

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
      if (code.type !== "FSM") {
        throw new Error("Automaton type not supported yet");
      }
      const automaton = new FiniteStateMachine(code.automaton);
      AutomatonExecutor.setAutomaton(automaton);
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

    setSimulationSpeed: (speed: number) => set({ simulationSpeed: speed }),
    setSimulationWord: (word: string) => set({ simulationWord: word }),
    setVisitedState: (state: string) =>
      set({
        visitedState: state,
        visitedTransition: null,
        visitedSymbol: null,
      }),
    setVisitedTransition: (transition: string, symbol: string) =>
      set({
        visitedTransition: transition,
        visitedSymbol: symbol,
        visitedState: null,
      }),
    moveRight: () =>
      set((state) => {
        const { simulationIndex, simulationWord } = state;
        if (simulationIndex >= simulationWord.length) return state;
        movementTimeout = setTimeout(() => {
          set({ translation: 0, simulationIndex: simulationIndex + 1 });
        }, state.simulationSpeed);
        return { translation: -1 };
      }),
    moveLeft: () =>
      set((state) => {
        const { simulationIndex } = state;
        if (simulationIndex <= 0) return state;
        movementTimeout = setTimeout(() => {
          set({ translation: 0, simulationIndex: simulationIndex - 1 });
        }, state.simulationSpeed);
        return { translation: 1 };
      }),
    stopSimulation: () => {
      clearTimeout(movementTimeout);
      set((state) => ({
        mode: state.isOwner ? "states" : "viewer",
        translation: 0,
        simulationIndex: 0,
        visitedState: null,
        visitedTransition: null,
        visitedSymbol: null,
      }));
    },
  }));
};
