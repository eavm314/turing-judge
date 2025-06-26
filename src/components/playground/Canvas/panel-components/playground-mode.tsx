import { cn } from '@/lib/ui/utils';
import { usePlaygroundMode } from '@/providers/playground-provider';

export default function PlaygroundMode() {
  const { mode, setMode } = usePlaygroundMode();

  return (
    <div>
      <div className="font-medium text-neutral-foreground mb-1 text-sm">Mode:</div>
      {mode === 'simulation' ? (
        <button
          disabled
          className="rounded-md border bg-accent text-accent-foreground px-6 py-2 text-sm font-medium"
        >
          Simulation
        </button>
      ) : mode === 'viewer' ? (
        <button
          disabled
          className="rounded-md border bg-accent text-accent-foreground px-6 py-2 text-sm font-medium"
        >
          Only View
        </button>
      ) : (
        <div className="flex overflow-hidden rounded-md border bg-background">
          <button
            onClick={() => setMode('states')}
            className={cn(
              'relative px-4 py-2 text-sm font-medium transition-colors',
              mode === 'states'
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-background text-foreground hover:bg-muted',
            )}
          >
            States
          </button>
          <button
            onClick={() => setMode('transitions')}
            className={cn(
              'relative px-4 py-2 text-sm font-medium transition-colors',
              mode === 'transitions'
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-background text-foreground hover:bg-muted',
            )}
          >
            Transitions
          </button>
        </div>
      )}
    </div>
  );
}
