'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/ui/utils';
import { useSimulationStack } from '@/providers/playground-provider';

const size = 50;
const stackSize = 9;

export default function SimulationStack() {
  const { stack, speed } = useSimulationStack();

  if (!stack) return null;

  const totalElements = stack.length;
  const toMove = Math.max(0, totalElements - stackSize);
  const opSpeed = speed / 2;

  return (
    <>
      <style jsx>{`
        .stack-element {
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .stack-element.entering {
          animation-name: slideInFromTop;
          animation-duration: ${opSpeed}ms;
          animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .stack-element.exiting {
          animation-name: slideOutToTop;
          animation-duration: ${opSpeed}ms;
          animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
        }

        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideOutToTop {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0.8);
          }
        }
      `}</style>

      {/* Stack Visualization */}
      <div className="flex flex-col items-center bg-transparent border-none mr-10 mb-5">
        <Badge variant="outline" className="text-sm mb-2 bg-background">
          <span className="text-base font-bold mr-1">{totalElements}</span>
          element
          {totalElements != 1 && 's'}
        </Badge>

        {/* Stack elements */}
        <div
          className="relative border rounded-xl pointer-events-auto overflow-hidden"
          style={{
            width: `${size + 2}px`,
            height: `${stackSize * size}px`,
          }}
        >
          <div
            className="flex flex-col-reverse h-full w-full transition-transform"
            style={{
              transform: `translateY(${toMove * size}px)`,
              transitionDuration: `${opSpeed}ms`,
            }}
          >
            {stack.map(element => (
              <div
                key={element.id}
                className={cn(
                  'stack-element flex-shrink-0 flex items-center justify-center bg-background border-t relative font-mono',
                  element.isExiting &&
                    'exiting bg-red-200 text-red-800 border-red-400 ring-2 ring-red-300 shadow-lg',
                  element.isEntering &&
                    'entering bg-green-200 text-green-800 border-green-400 ring-2 ring-green-300 shadow-lg',
                )}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  fontSize: `${size / 2}px`,
                }}
              >
                <span>{element.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
