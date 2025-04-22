import { useRef } from "react";

import { Button } from "@/components/ui/button";
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

  const handleSimulation = () => {
    setMode(!isSimulation ? 'simulation' : isOwner ? 'states' : 'viewer');
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Test Suite</h2>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Enter test string"
      />
      <div className="flex gap-2 mt-4">
        <Button variant="secondary" className="w-full" onClick={handleTest}>
          Test
        </Button>
        <Button variant={isSimulation ? 'destructive' : 'default'} className="w-full" onClick={handleSimulation}>
          {isSimulation ? 'Stop' : 'Simulate'}
        </Button>
      </div>
    </div>
  )
}