import { create } from "zustand";

type EditorMode = "state" | "transition";

type EditorStore = {
  mode: EditorMode,
  setMode: (newMode: EditorMode) => void,
}

export const useEditor = create<EditorStore>((set) => ({
  mode: "state",
  setMode: (newMode) => set({ mode: newMode }),
}))
