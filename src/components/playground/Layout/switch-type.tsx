import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useModal } from '@/providers/modal-provider';
import { useAutomatonDesign, useIsOwner } from '@/providers/playground-provider';
import { AutomatonType } from '@prisma/client';

const valueToText = {
  [AutomatonType.FSM]: 'Finite State Machine',
  [AutomatonType.PDA]: 'Pushdown Automaton',
  [AutomatonType.TM]: 'Turing Machine',
};

export function SwitchType() {
  const { automaton, setAutomaton } = useAutomatonDesign();
  const isOwner = useIsOwner();

  const { showConfirm } = useModal();

  const handleSelectChange = async (value: AutomatonType) => {
    const confirmation = await showConfirm({
      title: `Switch to ${valueToText[value]}`,
      message: `Please save your design before switching the automaton type. This will reset the automaton.`,
      confirmLabel: 'Switch',
      cancelLabel: 'Cancel',
    });
    if (!confirmation) return;
    setAutomaton({type: value})
  };
  return (
    <Select disabled={!isOwner} value={automaton.type} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-20 disabled:opacity-100">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(AutomatonType).map(type => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
