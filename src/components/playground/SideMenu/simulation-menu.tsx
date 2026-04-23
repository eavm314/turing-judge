import { CircleStop, PenLine, Play, Shuffle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePlaygroundMode, useSimulation } from '@/providers/playground-provider';
import { automatonManager } from '@/store/playground-store';
import { useState } from 'react';

type SimulationType = 'normal' | 'random' | 'manual';

export default function SimulationMenu() {
  const { mode, setMode } = usePlaygroundMode();
  const [simulationType, setSimulationType] = useState<SimulationType>('normal');

  const simulating = mode === 'simulation';
  const simulatingNormal = simulating && simulationType === 'normal';
  const simulatingRandom = simulating && simulationType === 'random';
  const simulatingManual = simulating && simulationType === 'manual';

  const { word, setAnimatedData, move, stopSimulation, setTape } = useSimulation();

  const { toast } = useToast();

  const handleSimulation = () => {
    setSimulationType('normal');
    const animator = automatonManager.getAnimator();
    animator.setControls({ setAnimatedData, move, setTape });

    if (simulating) {
      animator.stop();
      stopSimulation();
      return;
    }

    const accepted = animator.start(word, {
      onStart: () => {
        setMode('simulation');
      },
      onFinish: () => {
        toast({
          title: 'Accepted!',
          variant: 'success',
        });
        stopSimulation();
      },
    });

    if (!accepted) {
      toast({
        title: 'No path found',
        variant: 'destructive',
      });
    }
  };

  const handleRandomSimulation = () => {
    setSimulationType('random');
    const animator = automatonManager.getAnimator();
    animator.setControls({ setAnimatedData, move, setTape });

    if (simulating) {
      animator.stop();
      stopSimulation();
      return;
    }

    const foundPath = animator.startRandom(word, {
      onStart: () => {
        setMode('simulation');
      },
      onFinish: () => {
        toast({
          title: 'Random path finished',
        });
        stopSimulation();
      },
    });

    if (!foundPath) {
      toast({
        title: 'No path found',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-2 p-3">
      <h2>Simulation</h2>
      <Label className="text-muted-foreground">Choose how to simulate the automaton</Label>
      <div className="space-y-2">
        <Button
          onClick={handleSimulation}
          className="w-full justify-start"
          disabled={simulating && !simulatingNormal}
          variant={simulatingNormal ? 'destructive' : 'secondary'}
        >
          {simulatingNormal ? <CircleStop className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {simulatingNormal ? 'Stop' : 'Find Accepted Path'}
        </Button>
        <Button
          onClick={handleRandomSimulation}
          className="w-full justify-start"
          disabled={simulating && !simulatingRandom}
          variant={simulatingRandom ? 'destructive' : 'secondary'}
        >
          {simulatingRandom ? <CircleStop className="h-4 w-4" /> : <Shuffle className="h-4 w-4" />}
          {simulatingRandom ? 'Stop' : 'Random Path'}
        </Button>
        <Button
          disabled={true || simulating && !simulatingManual}
          className="w-full justify-start"
          variant={simulatingManual ? 'destructive' : 'secondary'}
        >
          {simulatingManual ? <CircleStop className="h-4 w-4" /> : <PenLine className="h-4 w-4" />}
          {simulatingManual ? 'Stop' : 'Manual Simulation'}
        </Button>
        <span className="text-xs text-muted-foreground">* Manual simulation coming soon.</span>
      </div>
    </div>
  );
}
