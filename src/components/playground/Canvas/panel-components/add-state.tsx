import { Button } from '@/components/ui/button';
import { useModal } from '@/providers/modal-provider';
import { useAutomatonDesign } from '@/providers/playground-provider';

export default function AddState() {
  const { automaton, updateDesign } = useAutomatonDesign();
  const { showPrompt } = useModal();

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

    updateDesign(auto => {
      auto.addState(stateName, {
        position: { x: 0, y: 0 },
        transitions: {},
      });
    });
  };

  return (
    <Button variant="secondary" onClick={handleAddState}>
      Add State
    </Button>
  );
}
