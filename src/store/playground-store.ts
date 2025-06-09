import { createStore } from 'zustand/vanilla';

import { AutomatonManager } from '@/lib/automata/AutomatonManager';
import { type AutomatonDesign, type BaseDesigner } from '@/lib/automata/base/BaseDesigner';
import { type AutomatonCode } from '@/lib/schemas/automaton-code';

export type PlaygroundMode = 'states' | 'transitions' | 'simulation' | 'viewer';

export type PlaygroundState = {
  automaton: AutomatonDesign;
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
  updateDesign: (callback: (designer: BaseDesigner) => void) => void;
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

export const automatonManager = new AutomatonManager({ type: 'FSM' });

const defaultState: PlaygroundState = {
  mode: 'states',
  automaton: automatonManager.getDesigner().getDesign(),
  isOwner: true,
  unsavedChanges: false,

  translation: 0,
  simulationSpeed: 700,
  simulationWord: '',
  simulationIndex: 0,
  visitedState: null,
  visitedTransition: null,
  visitedSymbol: null,
};

let movementTimeout: NodeJS.Timeout | undefined = undefined;

export const createPlaygroundStore = (initialCode: AutomatonCode | null, isOwner: boolean) => {
  if (initialCode) automatonManager.switchTo(initialCode);

  const initialState: PlaygroundState = {
    ...defaultState,
    isOwner,
    mode: isOwner ? 'states' : 'viewer',
  };

  return createStore<PlaygroundStore>()(set => ({
    ...initialState,
    setMode: (newMode: PlaygroundMode) => set({ mode: newMode }),
    setAutomaton: (code: AutomatonCode) => {
      automatonManager.switchTo(code);
      set({
        automaton: automatonManager.getDesigner().getDesign(),
        unsavedChanges: true,
      });
    },
    updateDesign: callback => {
      const designer = automatonManager.getDesigner();
      callback(designer);
      set({ automaton: designer.getDesign(), unsavedChanges: true });
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
      set(state => {
        const { simulationIndex, simulationWord } = state;
        if (simulationIndex >= simulationWord.length) return state;
        movementTimeout = setTimeout(() => {
          set({ translation: 0, simulationIndex: simulationIndex + 1 });
        }, state.simulationSpeed);
        return { translation: -1 };
      }),
    moveLeft: () =>
      set(state => {
        const { simulationIndex } = state;
        if (simulationIndex <= 0) return state;
        movementTimeout = setTimeout(() => {
          set({ translation: 0, simulationIndex: simulationIndex - 1 });
        }, state.simulationSpeed);
        return { translation: 1 };
      }),
    stopSimulation: () => {
      clearTimeout(movementTimeout);
      set(state => ({
        mode: state.isOwner ? 'states' : 'viewer',
        translation: 0,
        simulationIndex: 0,
        visitedState: null,
        visitedTransition: null,
        visitedSymbol: null,
      }));
    },
  }));
};
