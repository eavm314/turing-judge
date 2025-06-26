import { createStore } from 'zustand/vanilla';

import { AutomatonManager } from '@/lib/automata/AutomatonManager';
import { type AutomatonDesign, type BaseDesigner } from '@/lib/automata/base/BaseDesigner';
import { type AutomatonCode } from '@/lib/schemas/automaton-code';
import { StackElement } from '@/lib/automata/pushdown-automaton/PdaAnimator';

export type PlaygroundMode = 'states' | 'transitions' | 'simulation' | 'viewer';

export type AnimationData = {
  state: string | null;
  transition: string | null;
  symbol: string | null;
  stack: StackElement[] | null;
};

export type PlaygroundState = {
  automaton: AutomatonDesign;
  mode: PlaygroundMode;
  isOwner: boolean;
  unsavedChanges: boolean;

  translation: number;
  simulationSpeed: number;
  simulationWord: string;
  simulationIndex: number;
  activeData: AnimationData;
};

export type PlaygroundActions = {
  setAutomaton: (code: AutomatonCode) => void;
  updateDesign: (callback: (designer: BaseDesigner) => void) => void;
  setMode: (newMode: PlaygroundMode) => void;
  saveChanges: () => void;

  setSimulationSpeed: (speed: number) => void;
  setSimulationWord: (word: string) => void;
  setAnimatedData: (data: AnimationData) => void;
  move: (direction: 'L' | 'R') => void;
  stopSimulation: () => void;
};

export type PlaygroundStore = PlaygroundState & PlaygroundActions;

export const automatonManager = new AutomatonManager({ type: 'FSM' });

let movementTimeout: NodeJS.Timeout | undefined = undefined;

export const createPlaygroundStore = (initialCode: AutomatonCode | null, isOwner: boolean) => {
  if (initialCode) automatonManager.switchTo(initialCode);

  const initialState: PlaygroundState = {
    unsavedChanges: false,
    automaton: automatonManager.getDesigner().getDesign(),
    isOwner,
    mode: isOwner ? 'states' : 'viewer',

    simulationSpeed: automatonManager.getAnimator().getSimulationSpeed(),
    translation: 0,
    simulationWord: '',
    simulationIndex: 0,
    activeData: {
      state: null,
      transition: null,
      symbol: null,
      stack: null,
    },
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

    setSimulationSpeed: (speed: number) => {
      automatonManager.getAnimator().setSimulationSpeed(speed);
      set({ simulationSpeed: speed });
    },
    setSimulationWord: (word: string) => set({ simulationWord: word }),
    setAnimatedData: (data: AnimationData) => set({ activeData: data }),
    move: (dir: 'L' | 'R') =>
      set(state => {
        const { simulationIndex, simulationWord } = state;
        if (dir === 'R') {
          if (simulationIndex >= simulationWord.length) return state;
          movementTimeout = setTimeout(() => {
            set({ translation: 0, simulationIndex: simulationIndex + 1 });
          }, state.simulationSpeed);
          return { translation: -1 };
        } else {
          if (simulationIndex <= 0) return state;
          movementTimeout = setTimeout(() => {
            set({ translation: 0, simulationIndex: simulationIndex - 1 });
          }, state.simulationSpeed);
          return { translation: 1 };
        }
      }),
    stopSimulation: () => {
      clearTimeout(movementTimeout);
      set(state => ({
        mode: state.isOwner ? 'states' : 'viewer',
        translation: 0,
        simulationIndex: 0,
        activeData: {
          state: null,
          transition: null,
          symbol: null,
          stack: null,
        },
      }));
    },
  }));
};
