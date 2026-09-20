'use client';

import { CircleStop, RotateCcw, Undo2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/ui/utils';
import { useSimulation } from '@/providers/playground-provider';
import { automatonManager } from '@/store/playground-store';
import SimulationStack from '../Canvas/panel-components/simulation-stack';
import TuringTape from '../Canvas/panel-components/turing-tape';
import { runtimeCurrentSymbol, statusBadgeVariant } from './manual-simulation-controls';
import { type SimulationType } from './simulation-menu';
import { type ManualSimulationController } from './use-manual-simulation';

type MobileSimulationOverlayProps = {
  controller: ManualSimulationController;
  simulationType: SimulationType;
};

/**
 * Compact simulation controls shown over the bottom of the canvas on mobile,
 * where the side panel sheet is closed so the animation stays visible.
 */
export default function MobileSimulationOverlay({
  controller,
  simulationType,
}: MobileSimulationOverlayProps) {
  const simulation = useSimulation();

  const isManual = simulationType === 'manual';
  const { runtime, choices, status, canUndo, stepCount } = controller.state;
  const canStep = isManual && status === 'running' && !controller.isApplyingStep;

  const handleStop = () => {
    if (!isManual) automatonManager.getAnimator().stop();
    simulation.stopSimulation();
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1 px-2 pb-2 md:hidden">
      {/* Tape and stack live here (instead of canvas panels) so they always
          sit above the controls card without overlapping it. */}
      <div className="relative w-full">
        <div className="absolute -bottom-10 left-0">
          <SimulationStack />
        </div>
      </div>
      <TuringTape />
      <div className="pointer-events-auto w-full max-w-md space-y-2 rounded-lg border bg-background/95 p-2 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={isManual ? statusBadgeVariant(status) : 'outline'}>
            {isManual ? status : 'running'}
          </Badge>
          {isManual && runtime ? (
            <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
              {runtime.state} · pos {runtime.inputPos} · read {runtimeCurrentSymbol(runtime)} ·
              steps {stepCount}
            </p>
          ) : (
            <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
              {simulation.word}
            </p>
          )}
          <div className="flex shrink-0 items-center gap-1">
            {isManual && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10"
                  onClick={controller.undo}
                  disabled={!canUndo || controller.isApplyingStep}
                  aria-label="Undo step"
                >
                  <Undo2 className="!size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10"
                  onClick={controller.reset}
                  disabled={stepCount === 0 || controller.isApplyingStep}
                  aria-label="Reset simulation"
                >
                  <RotateCcw className="!size-4" />
                </Button>
              </>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="size-10"
              onClick={handleStop}
              aria-label="Stop simulation"
            >
              <CircleStop className="!size-5" />
            </Button>
          </div>
        </div>

        {isManual && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => controller.step(choice.id)}
                disabled={!canStep}
                className={cn(
                  'min-h-11 shrink-0 rounded-md border bg-background px-3 font-mono text-sm',
                  canStep ? 'active:bg-accent' : 'opacity-60',
                )}
              >
                {choice.description}
              </button>
            ))}
            {choices.length === 0 && (
              <p className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
                No transitions available in this configuration.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
