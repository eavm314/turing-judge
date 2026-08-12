import { RotateCcw, Undo2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BLANK } from '@/constants/symbols';
import {
  type ManualRuntime,
  type ManualSessionStatus,
} from '@/lib/automata/manual/manual-types';
import { cn } from '@/lib/ui/utils';
import { type ManualSimulationController } from './use-manual-simulation';

export const runtimeCurrentSymbol = (runtime: ManualRuntime | null) =>
  runtime && runtime.type === 'TM'
    ? (runtime.tape.get(runtime.inputPos) ?? BLANK)
    : (runtime?.word[runtime?.inputPos ?? 0] ?? BLANK);

export const statusBadgeVariant = (status: ManualSessionStatus) =>
  status === 'accepted' ? 'secondary' : status === 'blocked' ? 'destructive' : 'outline';

type ManualSimulationControlsProps = {
  controller: ManualSimulationController;
};

export default function ManualSimulationControls({ controller }: ManualSimulationControlsProps) {
  const { state: { runtime, choices, status, canUndo, stepCount }, isApplyingStep } = controller;

  const runtimeSymbol = runtimeCurrentSymbol(runtime);

  const statusTitle =
    status === 'accepted'
      ? 'Accepted configuration reached'
      : status === 'blocked'
        ? 'No transitions available from this configuration'
        : 'Select one transition to execute the next step';

  const canManualStep = status === 'running' && !isApplyingStep;

  return (
    <div className="space-y-3 rounded-md border bg-muted/20 p-2">
      <div className="flex items-center justify-between">
        <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Manual Controls
        </Label>
        <Badge variant={statusBadgeVariant(status)}>{status}</Badge>
      </div>

      {runtime && (
        <>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border bg-background px-2 py-1">
              <p className="text-muted-foreground">Current state</p>
              <p className="font-mono text-sm">{runtime.state}</p>
            </div>
            <div className="rounded border bg-background px-2 py-1">
              <p className="text-muted-foreground">Head position</p>
              <p className="font-mono text-sm">{runtime.inputPos}</p>
            </div>
            <div className="rounded border bg-background px-2 py-1">
              <p className="text-muted-foreground">Current symbol</p>
              <p className="font-mono text-sm">{runtimeSymbol}</p>
            </div>
            <div className="rounded border bg-background px-2 py-1">
              <p className="text-muted-foreground">Steps</p>
              <p className="font-mono text-sm">{stepCount}</p>
            </div>
            {runtime.type === 'PDA' && (
              <div className="col-span-2 rounded border bg-background px-2 py-1">
                <p className="text-muted-foreground">Stack</p>
                <p className="font-mono text-sm">
                  depth {runtime.stack.length} · top {runtime.stack.at(-1) ?? BLANK}
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">{statusTitle}</p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={controller.undo}
              disabled={!canUndo || isApplyingStep}
            >
              <Undo2 className="h-3.5 w-3.5" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={controller.reset}
              disabled={stepCount === 0 || isApplyingStep}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Available paths</Label>
            <ScrollArea className="h-52 rounded-md border bg-background">
              <div className="space-y-2 p-2">
                {choices.map((choice, index) => (
                  <button
                    key={choice.id}
                    className={cn(
                      'w-full rounded-md border px-2 py-2 text-left transition-colors',
                      canManualStep ? 'hover:bg-accent hover:text-accent-foreground' : 'opacity-60',
                    )}
                    onClick={() => controller.step(choice.id)}
                    disabled={!canManualStep}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-muted-foreground">Path {index + 1}</p>
                      <Badge variant={choice.kind === 'epsilon' ? 'outline' : 'secondary'}>
                        {choice.kind}
                      </Badge>
                    </div>
                    <p className="font-mono text-sm">{choice.description}</p>
                  </button>
                ))}

                {choices.length === 0 && (
                  <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                    No transitions available in this configuration.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}
