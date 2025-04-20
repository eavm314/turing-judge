import { useEffect, useRef, useState } from "react";

import { PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EPSILON } from "@/constants/symbols";
import { useAutomaton } from "@/providers/playground-provider";

export function AlphabetEditor() {
  const { automaton, updateAutomaton } = useAutomaton();
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="space-y-2">
      <h2 className="text-lg font-bold">Alphabet</h2>
      <Label htmlFor="alphabet-input" className="text-left text-sm text-muted-foreground">
        Only alphanumeric characters.
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          id="alphabet-input"
          ref={inputRef}
          className="w-12"
          maxLength={1}
          minLength={1}
          onKeyDown={handleKeyDown}
        />
        <Button size="sm" onClick={handleAddToAlphabet}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {!automaton.alphabet.includes(EPSILON) &&
          <Button variant="outline" size="sm"
            className="flex items-center gap-1 px-2 w-11 h-[30px]"
            onClick={handleAddEpsilonToAlphabet}
          >
            <span className="font-mono">{EPSILON}</span>
            <PlusCircle />
          </Button>}
        {automaton.alphabet.map((symbol) => (
          <Badge key={symbol} variant="outline" className="flex items-center gap-1 p-0 w-11">
            <span className="font-mono py-1 pl-2 pr-0">{symbol}</span>
            <button
              className="p-2 pt-1 text-muted-foreground hover:text-foreground select-none"
              onClick={() => handleRemoveFromAlphabet(symbol)}
            >
              x
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
