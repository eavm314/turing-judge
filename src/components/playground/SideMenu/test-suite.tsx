import { useRef } from "react";

import { PenLine, Play, Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AutomatonExecutor from "@/lib/automaton/AutomatonExecutor";
import { useIsOwner, usePlaygroundMode } from "@/providers/playground-provider";


export function TestSuite() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { mode, setMode } = usePlaygroundMode();
  const isOwner = useIsOwner();

  const isSimulation = mode === 'simulation';

  const handleTest = () => {
    const input = inputRef.current!.value;
    const testResult = AutomatonExecutor.execute(input);
    console.log(testResult);
  }

  const switchSimulationMode = () => {
    setMode(!isSimulation ? 'simulation' : isOwner ? 'states' : 'viewer');
  }

  const startAutoSimulation = () => {
    
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Test Suite</h2>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Enter test string"
      />
      <div className="flex gap-2 my-3">
        <Button variant="secondary" className="w-full" onClick={handleTest}>
          Test
        </Button>
        <Button variant={isSimulation ? 'destructive' : 'default'} className="w-full" onClick={switchSimulationMode}>
          {isSimulation ? 'Stop' : 'Simulate'}
        </Button>
      </div>
      {isSimulation && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-md">Simulation Mode</CardTitle>
            <CardDescription>Choose how to simulate the automaton</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            <Button
              onClick={() => startAutoSimulation()}
              className="w-full justify-start"
              variant="outline"
            >
              <Play className="h-4 w-4" />
              Find Solution
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Shuffle className="h-4 w-4" />
              Random Steps
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <PenLine className="h-4 w-4" />
              Manual Simulation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}