import { useRef } from "react";

import { CircleStop, PenLine, Play, Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EPSILON } from "@/constants/symbols";
import { useToast } from "@/hooks/use-toast";
import AutomatonExecutor from "@/lib/automaton/AutomatonExecutor";
import {
  usePlaygroundMode,
  useSimulation,
} from "@/providers/playground-provider";

export default function SimulationMenu() {
  const { mode, setMode } = usePlaygroundMode();
  const simulating = mode === "simulation";

  const {
    word,
    simulationSpeed,
    setVisitedState,
    setVisitedTransition,
    moveRight,
    stopSimulation,
  } = useSimulation();
  const simulationInterval = useRef<NodeJS.Timeout>(undefined);

  const { toast } = useToast();

  const handleSimulation = () => {
    if (simulating) {
      clearInterval(simulationInterval.current);
      stopSimulation();
      return;
    }

    const { accepted, path } = AutomatonExecutor.execute(word, true);
    if (!accepted) {
      toast({
        title: "No path found",
        variant: "destructive",
      });
      return;
    }

    setMode("simulation");
    setVisitedState("0");

    let step = 0;
    let transition = true;
    simulationInterval.current = setInterval(() => {
      if (step >= path.length) {
        toast({
          title: "Accepted!",
          variant: "success",
        });
        clearInterval(simulationInterval.current);
        stopSimulation();
        return;
      }
      const [from, to, symbol] = path[step];
      if (transition) {
        setVisitedTransition(`${from}->${to}`, symbol);
        if (symbol !== EPSILON) {
          moveRight();
        }
      } else {
        setVisitedState(String(to));
        step++;
      }
      transition = !transition;
    }, simulationSpeed);
  };
  return (
    <div className="space-y-2 p-3">
      <h2>Simulation</h2>
      <Label className="text-muted-foreground">
        Choose how to simulate the automaton
      </Label>
      <div className="space-y-2">
        <Button
          onClick={handleSimulation}
          className="w-full justify-start"
          variant={simulating ? "destructive" : "outline"}
        >
          {simulating ? (
            <CircleStop className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {simulating ? "Stop" : "Find Accepted Path"}
        </Button>
        <Button disabled className="w-full justify-start" variant="outline">
          <Shuffle className="h-4 w-4" />
          Random Path *
        </Button>
        <Button disabled className="w-full justify-start" variant="outline">
          <PenLine className="h-4 w-4" />
          Manual Simulation *
        </Button>
        <span className="text-xs text-muted-foreground/80">* Coming Soon!</span>
      </div>
    </div>
  );
}
