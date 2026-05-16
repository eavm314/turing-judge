import { CircleStop, PenLine, Play, Shuffle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePlaygroundMode, useSimulation } from '@/providers/playground-provider';
import { automatonManager } from '@/store/playground-store';
import ManualSimulationControls from './manual-simulation-controls';
import { useManualSimulation } from './use-manual-simulation';

type SimulationType = 'normal' | 'random' | 'manual';

export default function SimulationMenu() {
  const { mode, setMode } = usePlaygroundMode();
  const [simulationType, setSimulationType] = useState<SimulationType>('normal');

  const simulating = mode === 'simulation';
  const simulatingNormal = simulating && simulationType === 'normal';
  const simulatingRandom = simulating && simulationType === 'random';
  const simulatingManual = simulating && simulationType === 'manual';

  const simulation = useSimulation();
  const manualController = useManualSimulation();

  const { toast } = useToast();

  const handleSimulation = () => {
    setSimulationType('normal');

    const animator = automatonManager.getAnimator();
    animator.setControls(simulation);

    if (simulating) {
      animator.stop();
      simulation.stopSimulation();
      return;
    }

    const accepted = animator.start(simulation.word, {
      onStart: () => {
        setMode('simulation');
      },
      onFinish: () => {
        toast({
          title: 'Accepted!',
          variant: 'success',
        });
        simulation.stopSimulation();
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
    animator.setControls(simulation);

    if (simulating) {
      animator.stop();
      simulation.stopSimulation();
      return;
    }

    const foundPath = animator.startRandom(simulation.word, {
      onStart: () => {
        setMode('simulation');
      },
      onFinish: () => {
        toast({
          title: 'Random path finished',
        });
        simulation.stopSimulation();
      },
    });

    if (!foundPath) {
      toast({
        title: 'No path found',
        variant: 'destructive',
      });
    }
  };

  const handleManualSimulation = () => {
    setSimulationType('manual');

    if (simulating) {
      simulation.stopSimulation();
      return;
    }

    manualController.start();
    setMode('simulation');
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
          onClick={handleManualSimulation}
          disabled={simulating && !simulatingManual}
          className="w-full justify-start"
          variant={simulatingManual ? 'destructive' : 'secondary'}
        >
          {simulatingManual ? <CircleStop className="h-4 w-4" /> : <PenLine className="h-4 w-4" />}
          {simulatingManual ? 'Stop' : 'Manual Simulation'}
        </Button>

        {simulatingManual && <ManualSimulationControls controller={manualController} />}
      </div>
    </div>
  );
}
