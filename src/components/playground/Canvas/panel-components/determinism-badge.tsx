import { Badge } from '@/components/ui/badge';
import { useAutomatonDesign } from '@/providers/playground-provider';

export default function DeterminismBadge() {
  const { automaton } = useAutomatonDesign();
  return (
    <Badge
      data-testid="determinism-badge"
      variant="outline"
      className="w-full text-center text-sm bg-background"
    >
      {automaton.isDeterministic ? 'Deterministic' : 'Non-deterministic'}
    </Badge>
  );
}
