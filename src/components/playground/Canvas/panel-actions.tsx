import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/utils";
import { useAutomaton, usePlaygroundMode } from "@/providers/playground-provider";
import { useModal } from "@/providers/modal-provider";

export const AddStateButton = () => {
  const { mode } = usePlaygroundMode();
  const { automaton, updateAutomaton } = useAutomaton();
  const { showPrompt } = useModal();

  if (mode !== 'states') return null;

  const handleAddState = async () => {
    const stateName = await showPrompt({
      title: "Add State",
      inputLabel: "Enter the name of the new state:",
      defaultValue: "",
      validator: (value) => {
        if (value.length < 1 || value.length > 3) return "State name must contain 1 to 3 characters";
        if (value.match(/[^a-zA-Z0-9]/)) return "State name can only contain letters and numbers";
        if (automaton.states.has(value)) return "State name must be unique";
        return "";
      }
    });
    if (!stateName) return;

    updateAutomaton((auto) => {
      auto.addState(stateName, {
        position: { x: 0, y: 0 },
        transitions: {}
      });
    });
  };

  return (
    <Button onClick={handleAddState}>
      Add State
    </Button>
  )
}

export function SwitchMode() {
  const { mode, setMode } = usePlaygroundMode();

  return (
    <div>
      <div className="text-sm font-medium text-foreground mb-1">Mode:</div>

      {mode === 'simulation' ? (
        <button
          disabled
          className="rounded-md border bg-background px-6 py-2 text-sm font-medium text-muted-foreground"
        >
          Simulation
        </button>
      ) : mode === 'viewer' ? (
        <button
          disabled
          className="rounded-md border bg-background px-6 py-2 text-sm font-medium text-muted-foreground"
        >
          Only View
        </button>
      ) : (
        <div className="flex overflow-hidden rounded-md border bg-background">
          <button
            onClick={() => setMode('states')}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors",
              mode === 'states' ? "bg-primary text-primary-foreground" : "bg-background text-foreground hover:bg-muted",
            )}
          >
            States
          </button>
          <button
            onClick={() => setMode('transitions')}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors",
              mode === 'transitions' ? "bg-primary text-primary-foreground" : "bg-background text-foreground hover:bg-muted",
            )}
          >
            Transitions
          </button>
        </div>
      )}
    </div>
  )
}