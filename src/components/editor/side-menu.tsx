import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AutomatonExecutor from "@/lib/automaton/AutomatonExecutor";
import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SideMenu() {
  const [result, setResult] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTest = () => {
    const input = inputRef.current!.value;
    const testResult = AutomatonExecutor.execute(input);
    setResult(testResult ? "accepted" : "rejected");
  }

  return (
    <div className="w-72 p-4 border-l">
      <h2 className="text-lg font-bold mb-4">Test Cases</h2>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Enter test string"
        className="mb-2"
      />
      <Button className="w-full mb-2" onClick={handleTest}>
        Test
      </Button>
      {result && <div className={`p-2 ${result === "accepted" ? "text-green-500" : "text-red-500"}`}>{result}</div>}
    </div>
  )
}