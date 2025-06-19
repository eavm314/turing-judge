'use client';

import { useEffect, useRef, useState } from 'react';

import { ArrowRight, Edit, Plus, Trash2, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EPSILON } from '@/constants/symbols';
import { type TransitionData } from '@/lib/automata/base/BaseState';
import { PdaDesigner } from '@/lib/automata/pushdown-automaton/PdaDesigner';
import { PdaTransitionData } from '@/lib/automata/pushdown-automaton/PdaState';
import { type CustomContentProps, useModal } from '@/providers/modal-provider';
import { automatonManager } from '@/store/playground-store';
import { AutomatonType } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
    setAlphabet(designer.getAlphabet());
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

const AddPdaTransition = ({
  value,
  setValue: setTransitionData,
  data,
}: CustomContentProps<TransitionData[], AddTransitionProps>) => {
  const [inputAlphabet, setInputAlphabet] = useState<string[]>([]);
  const [stackAlphabet, setStackAlphabet] = useState<string[]>([]);

  useEffect(() => {
    const designer = automatonManager.getDesigner() as PdaDesigner;
    const { source, target } = data;
    const transition = designer.getTransition(source, target);
    setTransitionData(transition);
    setInputAlphabet(designer.getAlphabet());
    setStackAlphabet(designer.getStackAlphabet());
  }, []);

  // Keep state only for values that affect rendering
  const [currentTransition, setCurrentTransition] = useState<PdaTransitionData>({
    input: '',
    pop: '',
    push: [],
  });

  const handleAddPushSymbol = (pushSymbol: string) => {
    setCurrentTransition(prev => ({
      ...prev,
      push: [...prev.push, pushSymbol],
    }));
  };

  const handleRemovePushSymbol = (symbol: string) => {
    setCurrentTransition(prev => ({
      ...prev,
      push: prev.push.filter(s => s !== symbol),
    }));
  };

  const handleAddTransition = () => {
    if (currentTransition.input && currentTransition.pop) {
      // Check for duplicate transitions
      const isDuplicate = transitions.some(
        t => JSON.stringify(t) === JSON.stringify(currentTransition),
      );

      if (!isDuplicate) {
        setTransitionData([...transitions, currentTransition]);
        // Reset form
        setCurrentTransition({
          input: '',
          pop: '',
          push: [],
        });
      }
    }
  };

  const handleRemoveTransition = (index: number) => {
    setTransitionData(transitions.filter((_, i) => i !== index));
  };

  const formatTransition = (transition: PdaTransitionData) => {
    const pushStr = transition.push.length === 0 ? EPSILON : transition.push.join('');
    return `${transition.input}, ${transition.pop} / ${pushStr}`;
  };

  if (value === null) return null;
  const transitions = value as PdaTransitionData[];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Input and Pop Section */}
        <div className="flex items-center gap-2 justify-center">
          <div className="flex flex-col items-center gap-1">
            <Label className="text-xs text-muted-foreground">input</Label>
            <Select
              onValueChange={value => {
                setCurrentTransition(prev => ({
                  ...prev,
                  input: value,
                }));
              }}
              key={`input-${transitions.length}`}
              value={currentTransition.input}
            >
              <SelectTrigger className="w-16 h-10 font-mono text-lg" data-transition-select>
                <SelectValue placeholder="?" />
              </SelectTrigger>
              <SelectContent>
                {inputAlphabet.map(symbol => (
                  <SelectItem key={symbol} value={symbol} className="font-mono text-center">
                    {symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-lg font-mono mt-6">,</span>

          <div className="flex flex-col items-center gap-1">
            <Label className="text-xs text-muted-foreground">pop</Label>
            <Select
              onValueChange={value => {
                setCurrentTransition(prev => ({
                  ...prev,
                  pop: value,
                }));
              }}
              key={`pop-${transitions.length}`}
              value={currentTransition.pop}
            >
              <SelectTrigger className="w-16 h-10 font-mono text-lg" data-transition-select>
                <SelectValue placeholder="?" />
              </SelectTrigger>
              <SelectContent>
                {stackAlphabet.map(symbol => (
                  <SelectItem key={symbol} value={symbol} className="font-mono text-center">
                    {symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-lg font-mono mt-6">/</span>

          <div className="flex flex-col items-center gap-1">
            <Label className="text-xs text-muted-foreground">push</Label>
            <div className="flex flex-col items-center gap-2">
              {currentTransition.push.length > 0 ? (
                <div className="flex flex-wrap gap-1 min-h-[40px] items-center justify-center border rounded-md p-2 bg-background min-w-[80px]">
                  {currentTransition.push.map((symbol, index) => (
                    <Badge key={index} variant="outline" className="h-6 font-mono text-sm">
                      {symbol}
                      <button
                        onClick={() => handleRemovePushSymbol(symbol)}
                        className="ml-1 hover: rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="w-20 h-10 border-2 border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center">
                  <span className="pb-1 text-lg text-muted-foreground">{EPSILON}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Push Symbol Selection */}
        <div className="flex items-center gap-2 justify-center">
          <Label className="text-xs">Add push symbol:</Label>
          <Select onValueChange={handleAddPushSymbol} key={`push-${currentTransition.push.length}`}>
            <SelectTrigger className="w-16 h-8 font-mono" data-push-select>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stackAlphabet.map(symbol => (
                <SelectItem key={symbol} value={symbol} className="font-mono text-center">
                  {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleAddTransition}
          size="sm"
          disabled={!currentTransition.input || !currentTransition.pop}
        >
          <Plus className="h-4 w-4" />
          Add This Rule
        </Button>
      </div>

      {/* Added Transitions List */}
      {transitions.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Added Transitions ({transitions.length})</h4>
            <ScrollArea type="always" className="h-32 px-4">
              <div className="space-y-2">
                {transitions.map((transition, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1 px-3 border rounded bg-background"
                  >
                    <span className="font-mono text-sm">{formatTransition(transition)}</span>
                    <div className="space-x-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setCurrentTransition(transition);
                          handleRemoveTransition(index);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveTransition(index)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};

const AddTMTransition = ({
  value: transitionData,
  setValue: setTransitionData,
  data,
}: CustomContentProps<TransitionData[], AddTransitionProps>) => {
  return null;
};

const componentByType: Record<
  AutomatonType,
  React.FC<CustomContentProps<TransitionData[], AddTransitionProps>>
> = {
  [AutomatonType.FSM]: AddFsmTransition,
  [AutomatonType.PDA]: AddPdaTransition,
  [AutomatonType.TM]: AddTMTransition,
};

export const useAddTransitionPrompt = () => {
  const { showCustomModal } = useModal();

  const addTransition = (data: AddTransitionProps) =>
    showCustomModal<TransitionData[], AddTransitionProps>({
      title: 'Edit Transition',
      message: 'Choose the symbols for the transition',
      customContent: componentByType[automatonManager.getType()],
      customComponentData: data,
    });

  return addTransition;
};
