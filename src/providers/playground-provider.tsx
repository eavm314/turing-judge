'use client';

import { createContext, useContext, useMemo, useRef } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { type AutomatonCode } from '@/lib/schemas/automaton-code';
import { createPlaygroundStore, type PlaygroundStore } from '@/store/playground-store';

type PlaygroundStoreApi = ReturnType<typeof createPlaygroundStore>;

export const PlaygroundStoreContext = createContext<PlaygroundStoreApi | undefined>(undefined);

interface PlaygroundProviderProps {
  children: React.ReactNode;
  isOwner: boolean;
  initialCode: AutomatonCode | null;
}

export const PlaygroundStoreProvider = ({
  children,
  initialCode,
  isOwner,
}: PlaygroundProviderProps) => {
  const storeRef = useRef<PlaygroundStoreApi | null>(null);
  storeRef.current = useMemo(
    () => createPlaygroundStore(initialCode, isOwner),
    [initialCode, isOwner],
  );

  return (
    <PlaygroundStoreContext.Provider value={storeRef.current}>
      {children}
    </PlaygroundStoreContext.Provider>
  );
};

export const usePlaygroundStore = <T,>(selector: (store: PlaygroundStore) => T): T => {
  const context = useContext(PlaygroundStoreContext);

  if (!context) {
    throw new Error(`usePlaygroundStore must be used within PlaygroundStoreProvider`);
  }

  return useStore(context, selector);
};

export const useAutomatonDesign = () =>
  usePlaygroundStore(
    useShallow(state => ({
      automaton: state.automaton,
      unsavedChanges: state.unsavedChanges,
      setAutomaton: state.setAutomaton,
      updateDesign: state.updateDesign,
      saveChanges: state.saveChanges,
    })),
  );

export const usePlaygroundMode = () =>
  usePlaygroundStore(
    useShallow(state => ({
      mode: state.mode,
      setMode: state.setMode,
    })),
  );

export const useIsOwner = () => usePlaygroundStore(state => state.isOwner);

export const useSimulationWord = () =>
  usePlaygroundStore(
    useShallow(state => ({
      word: state.simulationWord,
      setWord: state.setSimulationWord,
    })),
  );

export const useVisitedState = () => usePlaygroundStore(state => state.activeData.state);

export const useVisitedTransition = () =>
  usePlaygroundStore(
    useShallow(state => ({
      visitedTransition: state.activeData.transition,
      visitedSymbol: state.activeData.symbol,
      simulationSpeed: state.simulationSpeed,
    })),
  );

export const useSimulation = () =>
  usePlaygroundStore(
    useShallow(state => ({
      word: state.simulationWord,
      simulationSpeed: state.simulationSpeed,
      setWord: state.setSimulationWord,
      setSimulationSpeed: state.setSimulationSpeed,
      stopSimulation: state.stopSimulation,
      setAnimatedData: state.setAnimatedData,
      move: state.move,
    })),
  );

export const useSimulationTape = () =>
  usePlaygroundStore(
    useShallow(state => ({
      translation: state.translation,
      speed: state.simulationSpeed,
      word: state.simulationWord,
      position: state.simulationIndex,
      visitedSymbol: state.activeData.symbol,
    })),
  );
