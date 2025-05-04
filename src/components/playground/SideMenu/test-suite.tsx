import { useRef } from "react";

import { CircleStop, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EPSILON } from "@/constants/symbols";
import { useToast } from "@/hooks/use-toast";
import AutomatonExecutor from "@/lib/automaton/AutomatonExecutor";
import {
  useIsOwner,
  usePlaygroundMode,
  useSimulation,
} from "@/providers/playground-provider";

export function TestSuite() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { mode, setMode } = usePlaygroundMode();
  const isOwner = useIsOwner();
  const { toast } = useToast();

  const isSimulationMode = mode === "simulation";

  const {
    simulating,
    simulationSpeed,
    setSimulating,
    setSimulationWord,
    setVisitedState,
    setVisitedTransition,
    moveRight,
    stopSimulation,
  } = useSimulation();
  const simulationInterval = useRef<NodeJS.Timeout>(undefined);

  const handleTest = () => {
    const input = inputRef.current!.value;
    const { accepted } = AutomatonExecutor.execute(input);
    if (accepted) {
      toast({
        title: "Accepted!",
        variant: "success",
      });
    } else {
      toast({
        title: "Rejected!",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTest();
    }
  };

  const switchSimulationMode = () => {
    if (!isSimulationMode) {
      setMode("simulation");
      return;
    }

    stopSimulation();
    setMode(isOwner ? "states" : "viewer");
  };

  const handleSimulation = () => {
    if (simulating) {
      clearInterval(simulationInterval.current);
      stopSimulation();
      return;
    }

    const input = inputRef.current!.value;
    const { accepted, path } = AutomatonExecutor.execute(input);
    if (!accepted) {
      toast({
        title: "No path found",
        variant: "destructive",
      });
      return;
    }

    setSimulating(true);
    setSimulationWord(input);
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
        moveRight();
      } else {
        setVisitedState(String(to));
        step++;
      }
      transition = !transition;
    }, simulationSpeed);
  };

  return (
    <div className="p-4 space-y-1">
      <h2>Test Suite</h2>
      <Label htmlFor="test-input" className="text-muted-foreground">
        Enter test string
      </Label>
      <Input
        id="test-input"
        ref={inputRef}
        disabled={simulating}
        type="text"
        className="font-mono placeholder:font-mono"
        placeholder={EPSILON}
        onKeyDown={handleKeyDown}
      />
      <div className="flex gap-2 py-2">
        <Button className="w-full" onClick={handleTest}>
          Test
        </Button>
        <Button
          variant={isSimulationMode ? "destructive" : "secondary"}
          className="w-full"
          onClick={switchSimulationMode}
        >
          {isSimulationMode ? "Exit" : "Simulate"}
        </Button>
      </div>
      {isSimulationMode && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-md">Simulation Mode</CardTitle>
            <CardDescription>
              Choose how to simulate the automaton
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
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
              {simulating ? "Stop" : "Find Path"}
            </Button>
            {/* <Button className="w-full justify-start" variant="outline">
              <Shuffle className="h-4 w-4" />
              Random Steps
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <PenLine className="h-4 w-4" />
              Manual Simulation
            </Button> */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
