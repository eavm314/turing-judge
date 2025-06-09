'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EPSILON } from '@/constants/symbols';
import { automatonManager } from '@/store/playground-store';
import { type TransitionData } from '@/lib/automata/base/BaseState';
import { type CustomContentProps, useModal } from '@/providers/modal-provider';

interface AddTransitionProps {
  source: number;
  target: number;
}

const AddFsmTransition = ({
  value: transitionData,
  setValue: setTransitionData,
  data,
}: CustomContentProps<TransitionData[], AddTransitionProps>) => {
  const [alphabet, setAlphabet] = useState<string[]>([]);

  useEffect(() => {
    const designer = automatonManager.getDesigner();
    const { source, target } = data;
    const transition = designer.getTransition(source, target);
    setTransitionData(transition);
    setAlphabet(Array.from(designer.getAlphabet()));
  }, []);

  const handleSymbolToggle = (inputSymbol: string, checked: boolean) => {
    if (checked) {
      setTransitionData(prev => [...prev, { input: inputSymbol }]);
    } else {
      setTransitionData(prev => prev.filter(s => s.input !== inputSymbol));
    }
  };

  if (transitionData === null) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-2 items-center">
        <Label>Selected:</Label>
        {transitionData.length === 0 ? (
          <span className="text-muted-foreground italic">None</span>
        ) : (
          transitionData.map(data => (
            <Badge key={data.input} variant="outline" className="h-6 font-mono text-sm">
              {data.input}
            </Badge>
          ))
        )}
      </div>

      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-3">
          {alphabet.map(symbol => (
            <div key={symbol} className="flex items-center space-x-2">
              <Checkbox
                id={`symbol-${symbol}`}
                checked={transitionData.map(t => t.input).includes(symbol)}
                onCheckedChange={checked => handleSymbolToggle(symbol, checked === true)}
              />
              <Label htmlFor={`symbol-${symbol}`} className="font-mono">
                {symbol} {symbol === EPSILON && '(empty transition)'}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export const useAddTransitionPrompt = () => {
  const { showCustomModal } = useModal();

  const addTransition = (data: AddTransitionProps) =>
    showCustomModal<TransitionData[], AddTransitionProps>({
      title: 'Add Transition',
      message: 'Choose the symbols for the transition',
      customContent: AddFsmTransition,
      customComponentData: data,
    });

  return addTransition;
};
