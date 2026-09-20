'use client';

import { useState } from 'react';

import { GitBranch, HelpCircle, MousePointer, Move, Pointer, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIsCoarsePointer } from '@/hooks/use-media-query';

export default function ControlsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const isCoarsePointer = useIsCoarsePointer();

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-10 rounded-full"
        onClick={() => setIsOpen(true)}
        aria-label="Show controls help"
      >
        <HelpCircle className="size-6" />
      </Button>
    );
  }

  const controls: { action: string; gesture: string; desktopOnly?: boolean }[] = isCoarsePointer
    ? [
        { action: 'Select state or transition:', gesture: 'Tap' },
        { action: 'Rename or delete:', gesture: 'Tap → toolbar' },
        { action: 'Edit transition symbols:', gesture: 'Tap → toolbar' },
        { action: 'Navigate:', gesture: 'Drag' },
        { action: 'Zoom:', gesture: 'Pinch' },
      ]
    : [
        { action: 'Select state or transition:', gesture: 'Click' },
        { action: 'Rename state or transition:', gesture: 'Double Click' },
        { action: 'Navigate:', gesture: 'Drag' },
        { action: 'Select multiple states:', gesture: 'Shift+Drag' },
        { action: 'Remove state or transition:', gesture: 'Backspace' },
      ];

  return (
    <Card className="relative w-80 max-w-[calc(100vw-1rem)] shadow-xl">
      <button
        className="absolute right-1 top-1 grid size-9 place-items-center text-muted-foreground hover:text-accent-foreground"
        onClick={() => setIsOpen(false)}
        aria-label="Close controls help"
      >
        <X className="size-5" />
      </button>
      <CardContent className="mt-4 max-h-[70dvh] space-y-4 overflow-y-auto">
        <div className="space-y-2">
          <h3 className="font-medium text-neutral-foreground">Edition Modes</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col items-center gap-1 p-2 border rounded-md">
              <div className="flex items-center gap-1">
                <Move className="h-4 w-4 text-blue-500" />
                <span className="font-medium">States</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">Add and move states</p>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 border rounded-md">
              <div className="flex items-center gap-1">
                <GitBranch className="h-4 w-4 text-green-500" />
                <span className="font-medium">Transitions</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Create connections between states
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2 text-neutral-foreground">
            {isCoarsePointer ? <Pointer className="h-4 w-4" /> : <MousePointer className="h-4 w-4" />}
            Controls
          </h3>
          <ul className="space-y-2 text-sm">
            {controls.map(control => (
              <li key={control.action} className="flex items-center justify-between gap-2">
                <span>{control.action}</span>
                <Badge variant="outline" className="mt-0.5 whitespace-nowrap">
                  {control.gesture}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
