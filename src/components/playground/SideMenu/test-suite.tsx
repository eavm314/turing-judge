import { useEffect, useRef, useState } from "react";

import { PenLine, Play, Shuffle, CircleStop } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AutomatonExecutor from "@/lib/automaton/AutomatonExecutor";
import { useIsOwner, usePlaygroundMode } from "@/providers/playground-provider";
import { useReactFlow } from "@xyflow/react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { EPSILON } from "@/constants/symbols";

export function TestSuite() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { mode, setMode } = usePlaygroundMode();
  const isOwner = useIsOwner();
  const { updateNodeData, setNodes, updateEdgeData, setEdges } = useReactFlow();
  const { toast } = useToast();

  const isSimulation = mode === "simulation";

  const [simulating, setSimulating] = useState(false);
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
    if (!isSimulation) {
      setMode("simulation");
      return;
    }

    stopSimulation();
    setMode(isOwner ? "states" : "viewer");
  };

  const stopSimulation = () => {
    setSimulating(false);
    clearInterval(simulationInterval.current);
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        data: { ...node.data, visited: false },
      })),
    );
    setEdges((edges) =>
      edges.map((edge) => ({
        ...edge,
        data: { ...edge.data, visited: false },
      })),
    );
  };

  const handleSimulation = () => {
    if (simulating) {
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
    updateNodeData("0", (data) => ({ ...data, visited: true }));

    let step = 0;
    let transition = true;
    simulationInterval.current = setInterval(() => {
      if (step >= path.length) {
        toast({
          title: "Accepted!",
          variant: "success",
        });
        stopSimulation();
        return;
      }
      const [from, to, symbol] = path[step];
      if (transition) {
        updateNodeData(String(from), (data) => ({ ...data, visited: false }));
        updateEdgeData(`${from}->${to}`, (data) => ({
          ...data,
          visited: true,
        }));
      } else {
        updateEdgeData(`${from}->${to}`, (data) => ({
          ...data,
          visited: false,
        }));
        updateNodeData(String(to), (data) => ({ ...data, visited: true }));
        step++;
      }
      transition = !transition;
    }, 800);
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
          variant={isSimulation ? "destructive" : "secondary"}
          className="w-full"
          onClick={switchSimulationMode}
        >
          {isSimulation ? "Exit" : "Simulate"}
        </Button>
      </div>
      {isSimulation && (
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
