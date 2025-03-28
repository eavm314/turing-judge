"use client"

import { createContext, useContext, useRef } from "react";
import { useStore } from 'zustand';
import { useShallow } from "zustand/react/shallow";

import { createEditorStore, EditorState, type EditorStore } from "@/store/editor-store";

type EditorStoreApi = ReturnType<typeof createEditorStore>;

export const EditorStoreContext = createContext<EditorStoreApi | undefined>(undefined);

interface EditorProviderProps {
  children: React.ReactNode,
  initState?: Partial<EditorState>,
};

export const EditorStoreProvider = ({
  children, initState
}: EditorProviderProps) => {
  const storeRef = useRef<EditorStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createEditorStore(initState);
  }

  return (
    <EditorStoreContext.Provider value={storeRef.current}>
      {children}
    </EditorStoreContext.Provider>
  )
}

export const useEditorStore = <T,>(
  selector: (store: EditorStore) => T,
): T => {
  const counterStoreContext = useContext(EditorStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useEditorStore must be used within EditorStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
};

export const useAutomaton = () => useEditorStore(useShallow((state) => ({
  automaton: state.automaton,
  updateAutomaton: state.updateAutomaton,
  setExample: state.setExample
})));

export const useEditorMode = () => useEditorStore(useShallow((state) => ({
  mode: state.mode,
  setMode: state.setMode
})));