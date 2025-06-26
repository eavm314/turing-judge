'use client';

import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/ui/utils';
import { useSimulationTape } from '@/providers/playground-provider';

const size = 50;
const tapeSize = 11;

export default function TuringTape() {
  const { word, speed, position, translation, visitedSymbol } = useSimulationTape();

  const extraWord = ' '.repeat((tapeSize + 1) / 2) + word + ' '.repeat((tapeSize + 1) / 2);

  return (
    <div className="flex flex-col items-center gap-4 pb-6">
      {visitedSymbol && (
        <div className="flex items-center justify-center text-3xl font-mono bg-background border rounded-xl pt-1 pb-2 px-4">
          {visitedSymbol}
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
            {extraWord
              .split('')
              .slice(position, position + tapeSize + 2)
              .map((symbol, index) => (
                <div
                  key={index + position}
                  className={cn(
                    'flex items-center justify-center border font-mono',
                    symbol !== ' ' && 'bg-background',
                  )}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    fontSize: `${size / 2}px`,
                  }}
                >
                  {symbol}
                </div>
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
