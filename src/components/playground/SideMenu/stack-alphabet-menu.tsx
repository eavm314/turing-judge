import { useRef } from 'react';

import { PlusCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BOTTOM, EPSILON } from '@/constants/symbols';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/ui/utils';
import { useAutomatonDesign, useIsOwner, usePlaygroundMode } from '@/providers/playground-provider';
import { PdaDesigner } from '@/lib/automata/pushdown-automaton/PdaDesigner';
import { PdaTransitionData } from '@/lib/automata/pushdown-automaton/PdaState';

export default function StackAlphabetMenu() {
  const inputRef = useRef<HTMLInputElement>(null);

  const isOwner = useIsOwner();
  const { automaton, updateDesign } = useAutomatonDesign();
  const { mode } = usePlaygroundMode();
  const { toast } = useToast();

  const handleAddToAlphabet = () => {
    const inputChar = inputRef.current!.value.trim();
    if (inputChar.match(/^[a-zA-Z0-9]$/)) {
      updateDesign(automaton => {
        (automaton as PdaDesigner).addStackSymbol(inputChar);
      });
      inputRef.current!.value = '';
    }
  };

  const handleRemoveFromAlphabet = (symbol: string) => {
    const usedSymbols = new Set(
      automaton.edges.flatMap(edge =>
        edge.data!.transition.flatMap(t => {
          const pt = t as PdaTransitionData;
          return [pt.pop, ...pt.push];
        }),
      ),
    );
    if (usedSymbols.has(symbol)) {
      toast({
        title: 'Cannot remove symbol',
        description: `Symbol "${symbol}" is used in transitions`,
        variant: 'warning',
        duration: 4000,
      });
      return;
    }
    updateDesign(automaton => {
      (automaton as PdaDesigner).removeStackSymbol(symbol);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddToAlphabet();
    }
  };

  const disabled = mode === 'simulation' || !isOwner;

  return (
    <div className="space-y-2 p-3">
      <h2>Stack Alphabet</h2>
      <Label htmlFor="alphabet-input" className="text-muted-foreground">
        Only alphanumeric characters
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          id="stack-alphabet-input"
          data-testid="stack-alphabet-input"
          ref={inputRef}
          className="w-12"
          maxLength={1}
          minLength={1}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <Button variant="secondary" size="sm" onClick={handleAddToAlphabet} disabled={disabled}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 font-mono">
        {automaton.stackAlphabet?.map(symbol => (
          <Badge key={symbol} variant="outline" className="flex items-center gap-1 p-0 w-11">
            <span className="py-1 pl-2 pr-0 text-sm">{symbol}</span>
            {symbol !== BOTTOM && (
              <button
                className={cn(
                  'p-2 pt-1 text-muted-foreground select-none',
                  !disabled && 'hover:text-foreground',
                )}
                onClick={() => handleRemoveFromAlphabet(symbol)}
                disabled={disabled}
              >
                x
              </button>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}
