import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAutomatonDesign } from '@/providers/playground-provider';
import { AutomatonType } from '@prisma/browser';

const valueToText = {
  [AutomatonType.FSM]: 'Finite State Machine',
  [AutomatonType.PDA]: 'Pushdown Automaton',
  [AutomatonType.TM]: 'Turing Machine',
};

export function SwitchType() {
  const { automaton } = useAutomatonDesign();

  const handleSelectChange = async (value: AutomatonType) => {
    const params = new URLSearchParams();
    params.set('type', value.toLowerCase());
    window.open(`/playground?${params.toString()}`, '_blank');
  };

  return (
    <Select value={automaton.type} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-48 disabled:opacity-100 bg-muted text-accent-foreground font-semibold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(AutomatonType).map(type => (
          <SelectItem key={type} value={type}>
            {valueToText[type]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
