import { useEffect, useRef, useState } from "react";

import { PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EPSILON } from "@/constants/symbols";
import { useAutomaton, useIsOwner } from "@/providers/playground-provider";
import { cn } from "@/lib/ui/utils";
import { useToast } from "@/hooks/use-toast";

export function AlphabetEditor() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isOwner = useIsOwner();
  const { automaton, updateAutomaton } = useAutomaton();
  const { toast } = useToast();

  const handleAddToAlphabet = () => {
    const inputChar = inputRef.current!.value.trim();
    if (inputChar.match(/^[a-zA-Z0-9]$/)) {
      if (!automaton.alphabet.includes(inputChar)) {
        updateAutomaton(automaton => {
          automaton.setAlphabet([...automaton.alphabet, inputChar]);
        });
      }
      inputRef.current!.value = "";
    }
  }

  const handleAddEpsilonToAlphabet = () => {
    if (!automaton.alphabet.includes(EPSILON)) {
      updateAutomaton(automaton => {
        automaton.setAlphabet([EPSILON, ...automaton.alphabet]);
      });
    }
  }

  const handleRemoveFromAlphabet = (symbol: string) => {
    if (automaton.getUsedSymbols().has(symbol)) {
      toast({
        title: "Cannot remove symbol",
        description: `Symbol "${symbol}" is used in transitions`,
        variant: "warning",
        duration: 4000,
      });
      return;
    }
    updateAutomaton(automaton => {
      automaton.setAlphabet(automaton.alphabet.filter((s) => s !== symbol));
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddToAlphabet();
    }
  }

  return (
    <div className="space-y-2 p-4">
      <h2 className="text-lg font-bold text-neutral-foreground">Alphabet</h2>
      <Label htmlFor="alphabet-input" className="text-muted-foreground">
        Only alphanumeric characters
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          id="alphabet-input"
          ref={inputRef}
          className="w-12"
          maxLength={1}
          minLength={1}
          onKeyDown={handleKeyDown}
          disabled={!isOwner}
        />
        <Button variant="secondary" size="sm" onClick={handleAddToAlphabet} disabled={!isOwner}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2 font-mono">
        {!automaton.alphabet.includes(EPSILON) &&
          <Button variant="outline" size="default"
            className="flex items-center gap-1 px-2 w-11 h-[30px]"
            onClick={handleAddEpsilonToAlphabet}
            disabled={!isOwner}
          >
            <span>{EPSILON}</span>
            <PlusCircle size={16} />
          </Button>}
        {automaton.alphabet.map((symbol) => (
          <Badge key={symbol} variant="outline" className="flex items-center gap-1 p-0 w-11">
            <span className="py-1 pl-2 pr-0 text-sm">{symbol}</span>
            <button
              className={cn("p-2 pt-1 text-muted-foreground select-none", isOwner && 'hover:text-foreground')}
              onClick={() => handleRemoveFromAlphabet(symbol)}
              disabled={!isOwner}
            >
              x
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
