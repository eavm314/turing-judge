import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-media-query';
import { useAutomatonDesign } from '@/providers/playground-provider';
import { AutomatonType } from '@prisma/browser';

const valueToText = {
  [AutomatonType.FSM]: 'Finite State Machine',
  [AutomatonType.PDA]: 'Pushdown Automaton',
  [AutomatonType.TM]: 'Turing Machine',
};

export function SwitchType() {
  const { automaton } = useAutomatonDesign();
  const isMobile = useIsMobile();

  const handleSelectChange = async (value: AutomatonType) => {
    const params = new URLSearchParams();
    params.set('type', value.toLowerCase());
    const url = `/playground?${params.toString()}`;
    // New tabs are hostile on mobile; navigate in place there instead.
    if (isMobile) {
      window.location.assign(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <Select value={automaton.type} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-40 md:w-48 disabled:opacity-100 bg-muted text-accent-foreground font-semibold">
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
