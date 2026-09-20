'use client';

import { useRef } from 'react';

import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  usePlaygroundUiStore,
} from '@/store/playground-ui-store';

export function ResizeHandle() {
  const sidebarWidth = usePlaygroundUiStore(state => state.sidebarWidth);
  const setSidebarWidth = usePlaygroundUiStore(state => state.setSidebarWidth);
  const setSidebarResizing = usePlaygroundUiStore(state => state.setSidebarResizing);

  const dragState = useRef<{ startX: number; startWidth: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragState.current = { startX: e.clientX, startWidth: sidebarWidth };
    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.style.userSelect = 'none';
    setSidebarResizing(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const { startX, startWidth } = dragState.current;
    setSidebarWidth(startWidth + (startX - e.clientX));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    dragState.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    document.body.style.userSelect = '';
    setSidebarResizing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // The panel sits on the right, so moving the handle left makes it wider
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSidebarResizing(true);
      setSidebarWidth(sidebarWidth + 16);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSidebarResizing(true);
      setSidebarWidth(sidebarWidth - 16);
    }
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize side panel"
      aria-valuenow={sidebarWidth}
      aria-valuemin={SIDEBAR_MIN_WIDTH}
      aria-valuemax={SIDEBAR_MAX_WIDTH}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={() => setSidebarWidth(SIDEBAR_DEFAULT_WIDTH)}
      onKeyDown={handleKeyDown}
      onKeyUp={() => setSidebarResizing(false)}
      onBlur={() => setSidebarResizing(false)}
      className="absolute left-0 top-0 z-10 h-full w-2 -translate-x-1/2 cursor-col-resize touch-none bg-transparent transition-colors hover:bg-secondary/40 focus-visible:bg-secondary/40 focus-visible:outline-none"
    />
  );
}
