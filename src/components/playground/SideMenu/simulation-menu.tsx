import { useRef } from 'react';

import { CircleStop, PenLine, Play, Shuffle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EPSILON } from '@/constants/symbols';
import { useToast } from '@/hooks/use-toast';
import { automatonManager } from '@/store/playground-store';
import { usePlaygroundMode, useSimulation } from '@/providers/playground-provider';
import { FsmStep } from '@/lib/automata/finite-state-machine/FsmExecutor';

export default function SimulationMenu() {
  const { mode, setMode } = usePlaygroundMode();
  const simulating = mode === 'simulation';

  const { word, simulationSpeed, setAnimatedData, move, stopSimulation } = useSimulation();

  const { toast } = useToast();

  const handleSimulation = () => {
    const animator = automatonManager.getAnimator();
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
      setAnimatedData,
      move,
    });

    if (!accepted) {
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
          variant={simulating ? 'destructive' : 'secondary'}
        >
          {simulating ? <CircleStop className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {simulating ? 'Stop' : 'Find Accepted Path'}
        </Button>
        <Button disabled className="w-full justify-start" variant="outline">
          <Shuffle className="h-4 w-4" />
          Random Path *
        </Button>
        <Button disabled className="w-full justify-start" variant="outline">
          <PenLine className="h-4 w-4" />
          Manual Simulation *
        </Button>
        <span className="text-xs text-muted-foreground">* Coming Soon!</span>
      </div>
    </div>
  );
}
