'use client';

import { BLANK } from '@/constants/symbols';
import { useIsMobile } from '@/hooks/use-media-query';
import { cn } from '@/lib/ui/utils';
import { useSimulationTape } from '@/providers/playground-provider';
import { useEffect, useState, useSyncExternalStore } from 'react';

type TapeCell = {
  key: string;
  symbol: string;
  absoluteIndex: number;
};

const DESKTOP_CELL_SIZE = 50;
const MOBILE_CELL_SIZE = 36;
const MAX_TAPE_SIZE = 11;

const useViewportWidth = () =>
  useSyncExternalStore(
    onChange => {
      window.addEventListener('resize', onChange);
      return () => window.removeEventListener('resize', onChange);
    },
    () => window.innerWidth,
    () => 1280,
  );

const buildTape = (
  symbols: Record<number, string>,
  position: number,
  tapeSize: number,
): TapeCell[] => {
  const half = Math.floor((tapeSize + 1) / 2);
  const tape: TapeCell[] = [];
  for (let i = 0; i < tapeSize + 2; i++) {
    const absoluteIndex = position + i - half;
    const key = `tape-cell-${absoluteIndex}`;
    const symbol = symbols[absoluteIndex] || BLANK;
    tape.push({ key, symbol, absoluteIndex });
  }
  return tape;
};

function TapeCellViewer({
  cell,
  speed,
  size,
}: {
  cell: TapeCell;
  speed: number;
  size: number;
}) {
  const [animate, setAnimate] = useState(false);
  const [prevSymbol, setPrevSymbol] = useState(cell.symbol);
  const [prevIndex, setPrevIndex] = useState(cell.absoluteIndex);

  useEffect(() => {
    if (cell.absoluteIndex === prevIndex && cell.symbol !== prevSymbol) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(t);
    }
    setPrevSymbol(cell.symbol);
    setPrevIndex(cell.absoluteIndex);
  }, [cell.symbol, cell.absoluteIndex, prevSymbol, prevIndex]);

  return (
    <div
      className={cn(
        'flex items-center justify-center border font-mono transition-all',
        cell.symbol !== BLANK && 'bg-background',
        animate && 'scale-125 text-primary',
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2}px`,
        transitionDuration: `${speed / 4}ms`,
      }}
    >
      {cell.symbol !== BLANK ? cell.symbol : ''}
    </div>
  );
}

export default function TuringTape() {
  const { tapeSymbols, speed, position, translation, transitionLabel } = useSimulationTape();

  const isMobile = useIsMobile();
  const viewportWidth = useViewportWidth();

  const size = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  // Largest odd cell count that fits the viewport (with breathing room),
  // capped at the classic 11 cells.
  const fittingCells = Math.floor((viewportWidth - 24) / size);
  const tapeSize = Math.max(
    3,
    Math.min(MAX_TAPE_SIZE, fittingCells % 2 === 0 ? fittingCells - 1 : fittingCells),
  );

  const tape = buildTape(tapeSymbols, position, tapeSize);

  return (
    <div className="flex flex-col items-center gap-2 md:gap-4 md:mb-2">
      <div className="flex h-10 items-center justify-center md:h-12">
        {transitionLabel && (
          <div className="flex items-center justify-center text-xl md:text-3xl font-mono bg-background border rounded-xl pt-1 pb-2 px-4">
            {transitionLabel}
          </div>
        )}
      </div>
      <div className="relative">
        <div
          className="overflow-hidden border rounded-xl"
          style={{ width: `${tapeSize * size}px`, height: `${size + 2}px` }}
        >
          <div
            className={cn(
              'flex transition-none',
              translation !== 0 && 'transition-transform ease-in-out',
            )}
            style={{
              width: `${(tapeSize + 2) * size}px`,
              transform: `translateX(${(translation - 1) * size}px)`,
              transitionDuration: `${speed}ms`,
              animationDuration: `${speed}ms`,
            }}
          >
            {tape.map(cell => (
              <TapeCellViewer key={cell.key} cell={cell} speed={speed} size={size} />
            ))}
          </div>
        </div>
        {/* Center indicator */}
        <div
          className="absolute -bottom-[1px] left-1/2 -translate-x-[47%] border-4 border-primary pointer-events-none rounded"
          style={{
            width: `${size + 2}px`,
            height: `${size + 4}px`,
          }}
        />
      </div>
    </div>
  );
}
