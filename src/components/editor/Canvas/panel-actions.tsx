import { Button } from "@/components/ui/button"
import { useAutomaton, useEditorMode } from "@/store/editor-context"
import { Panel } from "@xyflow/react"

export const PanelActions = () => {
  const { mode, setMode } = useEditorMode();
  const { automaton, updateAutomaton } = useAutomaton();

  const handleAddState = () => {
    const stateName = prompt("Enter State Name:");
    if (!stateName) return;
    if (automaton.states.has(stateName)) {
      alert("State name must be unique");
      return;
    }
    
    updateAutomaton((auto) => {
      auto.addState({
        name: stateName,
        position: { x: 0, y: 0 },
        transitions: {}
      });
    });
  };

  return (
    <Panel>
      <div className="flex flex-col gap-2">
        <Button onClick={() => setMode(mode === 'transition' ? 'state' : 'transition')}>
          Mode: {mode}
        </Button>
        {mode === 'state' &&
          <Button onClick={handleAddState}>
            Add State
          </Button>
        }
      </div>
    </Panel>
  )
}