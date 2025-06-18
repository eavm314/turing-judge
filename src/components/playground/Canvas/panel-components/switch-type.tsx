import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useModal } from '@/providers/modal-provider';
import { useAutomatonDesign } from '@/providers/playground-provider';
import { AutomatonType } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';

const valueToText = {
  [AutomatonType.FSM]: 'Finite State Machine',
  [AutomatonType.PDA]: 'Pushdown Automaton',
  [AutomatonType.TM]: 'Turing Machine',
};

export function SwitchType() {
  const { automaton } = useAutomatonDesign();

  const { showConfirm } = useModal();
  const pathname = usePathname();
  const router = useRouter();

  const handleSelectChange = async (value: AutomatonType) => {
    const confirmation = await showConfirm({
      title: 'Save your changes',
      message: `Please save your design before switching the automaton type. This will reset the automaton.`,
      confirmLabel: 'Switch',
      cancelLabel: 'Cancel',
    });
    if (!confirmation) return;
    const params = new URLSearchParams();
    params.set('type', value.toLowerCase());
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  return (
    <Select
      disabled={pathname.split('/').length > 2}
      value={automaton.type}
      onValueChange={handleSelectChange}
    >
      <SelectTrigger className="w-48 disabled:opacity-100 bg-muted text-accent-foreground font-semibold border-none">
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
