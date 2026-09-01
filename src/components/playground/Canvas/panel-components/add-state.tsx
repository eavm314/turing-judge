import { useReactFlow } from '@xyflow/react';

import { Button } from '@/components/ui/button';
import { useModal } from '@/providers/modal-provider';
import { useAutomatonDesign } from '@/providers/playground-provider';
import { CirclePlus } from 'lucide-react';

export default function AddState() {
  const { automaton, updateDesign } = useAutomatonDesign();
  const { showPrompt } = useModal();
  const { screenToFlowPosition } = useReactFlow();

  const handleAddState = async () => {
    const stateName = await showPrompt({
      title: 'Add State',
      inputLabel: 'Enter the name of the new state:',
      defaultValue: '',
      className: 'gap-1',
      validator: value => {
        if (value.length < 1 || value.length > 3)
          return 'State name must contain 1 to 3 characters';
        if (value.match(/[^a-zA-Z0-9]/)) return 'State name can only contain letters and numbers';
        if (automaton.nodes.filter(node => node.data.name === value).length > 0)
          return 'State name must be unique';
        return '';
      },
    });
    if (!stateName) return;

    // Drop the new state near the center of the visible canvas, cascading
    // consecutive adds so they don't stack on top of each other.
    const canvasRect = document.querySelector('.react-flow')?.getBoundingClientRect();
    const cascade = (automaton.nodes.length % 5) * 24;
    const position = screenToFlowPosition({
      x: (canvasRect ? canvasRect.x + canvasRect.width / 2 : window.innerWidth / 2) + cascade,
      y: (canvasRect ? canvasRect.y + canvasRect.height / 2 : window.innerHeight / 2) + cascade,
    });

    updateDesign(auto => {
      auto.addState(stateName, {
        position: { x: Math.round(position.x), y: Math.round(position.y) },
        transitions: {},
      });
    });
  };

  return (
    <Button className="w-32" variant="secondary" onClick={handleAddState}>
      <CirclePlus size={18}/> Add State
    </Button>
  );
}
