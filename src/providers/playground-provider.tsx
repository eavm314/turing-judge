"use client"

import { createContext, useContext, useMemo, useRef } from "react";
import { useStore } from 'zustand';
import { useShallow } from "zustand/react/shallow";

import { createPlaygroundStore, PlaygroundState, type PlaygroundStore } from "@/store/playground-store";

type PlaygroundStoreApi = ReturnType<typeof createPlaygroundStore>;

export const PlaygroundStoreContext = createContext<PlaygroundStoreApi | undefined>(undefined);

interface PlaygroundProviderProps {
  children: React.ReactNode,
  initState?: Partial<PlaygroundState>,
};

export const PlaygroundStoreProvider = ({
  children, initState
}: PlaygroundProviderProps) => {
  const storeRef = useRef<PlaygroundStoreApi | null>(null);
  storeRef.current = useMemo(() => createPlaygroundStore(initState), [initState?.isOwner]);

  return (
    <PlaygroundStoreContext.Provider value={storeRef.current}>
      {children}
    </PlaygroundStoreContext.Provider>
  )
}

export const usePlaygroundStore = <T,>(
  selector: (store: PlaygroundStore) => T,
): T => {
  const context = useContext(PlaygroundStoreContext)

  if (!context) {
    throw new Error(`usePlaygroundStore must be used within PlaygroundStoreProvider`)
  }

  return useStore(context, selector)
};

export const useAutomaton = () => usePlaygroundStore(useShallow((state) => ({
  automaton: state.automaton,
  unsavedChanges: state.unsavedChanges,
  setAutomaton: state.setAutomaton,
  updateAutomaton: state.updateAutomaton,
  saveChanges: state.saveChanges,
})));

export const usePlaygroundMode = () => usePlaygroundStore(useShallow((state) => ({
  mode: state.mode,
  setMode: state.setMode
})));

export const useIsOwner = () => usePlaygroundStore((state) => state.isOwner);