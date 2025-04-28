"use client"

import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EPSILON } from "@/constants/symbols";
import { type CustomContentProps, useModal } from "@/providers/modal-provider";

interface TransitionData {
  alphabet: string[];
  initialSymbols: string[];
}

const AddTransitionPrompt = ({
  value: selectedSymbols,
  setValue: setSelectedSymbols,
  data,
}: CustomContentProps<string[], TransitionData>) => {
  useEffect(() => {
    setSelectedSymbols(data.initialSymbols);
  }, []);

  if (selectedSymbols === null) return null;

  const handleSymbolToggle = (symbol: string, checked: boolean) => {
    if (checked) {
      setSelectedSymbols((prev) => [...prev, symbol])
    } else {
      setSelectedSymbols((prev) => prev.filter((s) => s !== symbol))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-2 items-center">
        <Label>Selected:</Label>
        {selectedSymbols.length === 0 ? (
          <span className="text-muted-foreground italic">None</span>
        ) : (
          selectedSymbols.map((symbol) => (
            <Badge key={symbol} variant="outline" className="h-6 font-mono text-sm">
              {symbol}
            </Badge>
          ))
        )}
      </div>

      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-3">
          {data.alphabet.map((symbol) => (
            <div key={symbol} className="flex items-center space-x-2">
              <Checkbox
                id={`symbol-${symbol}`}
                checked={selectedSymbols.includes(symbol)}
                onCheckedChange={(checked) => handleSymbolToggle(symbol, checked === true)}
              />
              <Label htmlFor={`symbol-${symbol}`} className="font-mono">
                {symbol} {symbol === EPSILON && "(empty transition)"}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export const useAddTransitionPrompt = () => {
  const { showCustomModal } = useModal()

  const saveAutomatonPrompt = (data: TransitionData) => showCustomModal<string[], TransitionData>({
    title: data.initialSymbols.length > 0 ? "Edit Transition" : "Add Transition",
    message: "Choose the symbols for the transition",
    customContent: AddTransitionPrompt,
    customComponentData: data,
  });

  return saveAutomatonPrompt;
}