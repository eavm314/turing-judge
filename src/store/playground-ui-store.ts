import { create } from 'zustand';

export const SIDEBAR_DEFAULT_WIDTH = 288;
export const SIDEBAR_MIN_WIDTH = 240;
export const SIDEBAR_MAX_WIDTH = 480;

export type SideMenuSection = 'alphabet' | 'stack' | 'testing' | 'simulation';

const ALL_SECTIONS: SideMenuSection[] = ['alphabet', 'stack', 'testing', 'simulation'];

export type PlaygroundUiState = {
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  openSections: SideMenuSection[];
  /** Mobile side-panel sheet. */
  sheetOpen: boolean;
  /** True while the resize handle is driving the width. */
  sidebarResizing: boolean;

  setSidebarWidth: (width: number) => void;
  toggleSidebarCollapsed: () => void;
  setOpenSections: (sections: SideMenuSection[]) => void;
  setSheetOpen: (open: boolean) => void;
  setSidebarResizing: (resizing: boolean) => void;
};

const clampWidth = (width: number) =>
  Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, Math.round(width)));

export const usePlaygroundUiStore = create<PlaygroundUiState>()(set => ({
  sidebarWidth: SIDEBAR_DEFAULT_WIDTH,
  sidebarCollapsed: false,
  openSections: ALL_SECTIONS,
  sheetOpen: false,
  sidebarResizing: false,

  setSidebarWidth: width => set({ sidebarWidth: clampWidth(width) }),
  toggleSidebarCollapsed: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setOpenSections: openSections => set({ openSections }),
  setSheetOpen: sheetOpen => set({ sheetOpen }),
  setSidebarResizing: sidebarResizing => set({ sidebarResizing }),
}));
