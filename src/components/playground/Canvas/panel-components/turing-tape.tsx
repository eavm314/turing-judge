'use client';

import { BLANK } from '@/constants/symbols';
import { cn } from '@/lib/ui/utils';
import { useSimulationTape } from '@/providers/playground-provider';
import { useEffect, useState } from 'react';

type TapeCell = {
  key: string;
  symbol: string;
  absoluteIndex: number;
};

const size = 50;
const tapeSize = 11;

const buildTape = (symbols: Record<number, string>, position: number): TapeCell[] => {
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

function TapeCellViewer({ cell, speed }: { cell: TapeCell; speed: number }) {
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

  const tape = buildTape(tapeSymbols, position);

  return (
    <div className="flex flex-col items-center gap-4 pb-6">
      {transitionLabel && (
        <div className="flex items-center justify-center text-3xl font-mono bg-background border rounded-xl pt-1 pb-2 px-4">
          {transitionLabel}
        </div>
      )}
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
              <TapeCellViewer key={cell.key} cell={cell} speed={speed} />
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
