"use client";

import { useState } from "react";

import { GitBranch, HelpCircle, MousePointer, Move, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ControlsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => setIsOpen(true)}
        aria-label="Show controls help"
      >
        <HelpCircle className="size-6" />
      </Button>
    );
  }

  return (
    <Card className="relative w-80 shadow-xl">
      <X
        className="absolute top-2 right-2 size-5 cursor-pointer text-muted-foreground hover:text-accent-foreground"
        onClick={() => setIsOpen(false)}
      />
      <CardContent className="space-y-4 mt-4">
        <div className="space-y-2">
          <h3 className="font-medium text-neutral-foreground">Edition Modes</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col items-center gap-1 p-2 border rounded-md">
              <div className="flex items-center gap-1">
                <Move className="h-4 w-4 text-blue-500" />
                <span className="font-medium">States</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Add and move states
              </p>
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
            <MousePointer className="h-4 w-4" />
            Controls
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between gap-2">
              <span>Select state or transition:</span>
              <Badge variant="outline" className="mt-0.5">
                Click
              </Badge>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span>Rename state or transition:</span>
              <Badge variant="outline" className="mt-0.5">
                Double Click
              </Badge>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span>Navigate:</span>
              <Badge variant="outline" className="mt-0.5">
                Drag
              </Badge>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span>Select multiple states:</span>
              <Badge variant="outline" className="mt-0.5">
                Shift+Drag
              </Badge>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span>Remove state or transition:</span>
              <Badge variant="outline" className="mt-0.5">
                Backspace
              </Badge>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
