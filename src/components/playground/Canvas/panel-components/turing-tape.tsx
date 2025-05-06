"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/utils";
import { useSimulationTape } from "@/providers/playground-provider";
import { ArrowRight } from "lucide-react";

const size = 50;
const tapeSize = 11;

export default function TuringTape() {
  const {
    word,
    speed,
    position,
    translation,
    visitedSymbol,
    moveLeft,
    moveRight,
  } = useSimulationTape();

  const extraWord =
    " ".repeat((tapeSize + 1) / 2) + word + " ".repeat((tapeSize + 1) / 2);

  return (
    <div className="flex flex-col items-center gap-4 pb-6">
      {visitedSymbol && (
        <div className="flex items-center justify-center text-3xl bg-background border border-border rounded-xl p-2 pl-4">
          {visitedSymbol}
          <ArrowRight className="relative w-10 top-0.5" />
        </div>
      )}
      <div
        className={`relative overflow-hidden border rounded-xl`}
        style={{ width: `${tapeSize * size}px`, height: `${size}px` }}
      >
        <div
          className={cn(
            "flex transition-none",
            translation !== 0 && "transition-transform ease-in-out",
          )}
          style={{
            width: `${(tapeSize + 2) * size}px`,
            transform: `translateX(${(translation - 1) * size}px)`,
            transitionDuration: `${speed}ms`,
            animationDuration: `${speed}ms`,
          }}
        >
          {extraWord
            .split("")
            .slice(position, position + tapeSize + 2)
            .map((symbol, index) => (
              <div
                key={index + position}
                className={cn(
                  "flex items-center justify-center border border-muted",
                  symbol !== " " && "bg-background",
                )}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  fontSize: `${size / 2}px`,
                }}
              >
                {symbol}
                {/* {index + position} */}
              </div>
            ))}
        </div>

        {/* Center indicator */}
        <div
          className="absolute -top-[1px] bottom-0 left-1/2 -translate-x-[47%] border-4 border-primary pointer-events-none rounded"
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      </div>

      {/* Control Button */}
      {/* <div className="flex gap-2">
        <Button onClick={moveLeft}>Move Left</Button>
        <Button onClick={moveRight}>Move Right</Button>
      </div> */}
    </div>
  );
}
