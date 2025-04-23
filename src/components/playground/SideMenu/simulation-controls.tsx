import { useState } from "react";

import { Pause, PenLine, Play, RefreshCw, Shuffle, SkipBack } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SimulationControls() {
  const [simulationMode, setSimulationMode] = useState<"manual" | "auto" | null>(null);
  const [autoSimulationType, setAutoSimulationType] = useState<"random" | "solution" | null>(null);

  const possibleTransitions = [
    { state: "q1", symbol: "0" },
    { state: "q2", symbol: "1" },
  ];

  const startTest = () => {
    // setResult(null)
    // setIsSimulating(true)
    // setSimulationMode(null)

    // // Find initial state
    // const initialState = automaton.states.find((state) => state.isInitial)
    // setCurrentState(initialState?.id || null)
  }

  const resetSimulation = () => {
    // setIsSimulating(false)
    // setSimulationMode(null)
    // setAutoSimulationType(null)
    // setCurrentState(null)
  }

  const startManualSimulation = () => {
    setSimulationMode("manual")
  }

  const startAutoSimulation = (type: "random" | "solution") => {
    // setSimulationMode("auto")
    // setAutoSimulationType(type)
  }

  const stopAutoSimulation = () => {
    // setSimulationMode("manual")
    // setAutoSimulationType(null)
  }

  const goToPreviousState = () => {
    // This would be implemented with actual logic
    // console.log("Go to previous state")
  }

  const goToNextState = (nextState: string, symbol: string) => {
    // This would be implemented with actual logic
    // setCurrentState(nextState)
    // console.log(`Transition to ${nextState} with symbol ${symbol}`)
  }

  return (
    <>
      {!simulationMode && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-md">Simulation Mode</CardTitle>
            <CardDescription>Choose how to simulate the automaton</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            <Button
              onClick={() => startAutoSimulation("solution")}
              className="w-full justify-start"
              variant="outline"
            >
              <Play className="h-4 w-4" />
              Find Solution
            </Button>
            <Button onClick={() => startAutoSimulation("random")}
              className="w-full justify-start" variant="outline"
            >
              <Shuffle className="h-4 w-4" />
              Random Steps
            </Button>
            <Button onClick={() => startManualSimulation()}
              className="w-full justify-start" variant="outline"
            >
              <PenLine className="h-4 w-4" />
              Manual Simulation
            </Button>
          </CardContent>
        </Card>
      )}

      {simulationMode === "manual" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Manual Simulation</CardTitle>
            <CardDescription>
              Current State:{" "}
              {/* {currentState ? (
                <Badge variant="outline" className="ml-1">
                  {automaton.states.find((s) => s.id === currentState)?.label || currentState}
                </Badge>
              ) : (
                "None"
              )} */}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex space-x-2 mb-2">
              <Button onClick={goToPreviousState} size="sm" variant="outline">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button onClick={resetSimulation} size="sm" variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Possible Transitions:</p>
              {possibleTransitions.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {possibleTransitions.map((transition, index) => (
                    <Button
                      key={index}
                      onClick={() => goToNextState(transition.state, transition.symbol)}
                      size="sm"
                      variant="secondary"
                    >
                      {transition.symbol} → {transition.state}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No possible transitions</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {simulationMode === "auto" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">
              {autoSimulationType === "random" ? "Random Simulation" : "Processing Input"}
            </CardTitle>
            <CardDescription>
              Current State:{" "}
              {/* {currentState ? (
                <Badge variant="outline" className="ml-1">
                  {automaton.states.find((s) => s.id === currentState)?.label || currentState}
                </Badge>
              ) : (
                "None"
              )} */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={stopAutoSimulation} className="w-full" variant="destructive">
              <Pause className="mr-2 h-4 w-4" />
              Stop Simulation
            </Button>

            {autoSimulationType === "solution" && (
              <div className="mt-2 p-2 bg-gray-200 rounded text-sm font-mono">
                <p>Processing: 123</p>
                <p>
                  Position: <span className="font-bold">0</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}