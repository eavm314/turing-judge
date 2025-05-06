import { Badge } from "@/components/ui/badge";
import { useAutomaton } from "@/providers/playground-provider";

export default function DeterminismBadge() {
  const { automaton } = useAutomaton();
  return (
    <Badge
      variant="outline"
      className="w-full text-center text-sm bg-background"
    >
      {automaton.isDeterministic() ? "Deterministic" : "Non-deterministic"}
    </Badge>
  );
}
