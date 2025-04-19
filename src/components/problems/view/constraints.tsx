import { type ProblemConstraints } from "@/dtos"

export const Constraints = ({ constraints }: { constraints: ProblemConstraints }) => {
  return (
    <div className="mt-4 p-4 rounded-md bg-accent max-h-max">
      <h3 className="text-lg font-medium mb-3">Problem Constraints</h3>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Allowed Automaton Types:</h4>
          <ul className="space-y-1">
            <li className="flex items-center">
              <span
                className={`w-4 h-4 mr-2 inline-block ${constraints.allowFSM ? "text-green-500" : "text-red-500"}`}
              >
                {constraints.allowFSM ? "✓" : "✗"}
              </span>
              Finite State Machine (FSM)
            </li>
            <li className="flex items-center">
              <span
                className={`w-4 h-4 mr-2 inline-block ${constraints.allowPDA ? "text-green-500" : "text-red-500"}`}
              >
                {constraints.allowPDA ? "✓" : "✗"}
              </span>
              Pushdown Automaton (PDA)
            </li>
            <li className="flex items-center">
              <span
                className={`w-4 h-4 mr-2 inline-block ${constraints.allowTM ? "text-green-500" : "text-red-500"}`}
              >
                {constraints.allowTM ? "✓" : "✗"}
              </span>
              Turing Machine (TM)
            </li>
            <li className="flex items-center">
              <span
                className={`w-4 h-4 mr-2 inline-block ${constraints.allowNonDet ? "text-green-500" : "text-red-500"}`}
              >
                {constraints.allowNonDet ? "✓" : "✗"}
              </span>
              Non-deterministic Automatons
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Execution Limits:</h4>
          <ul className="space-y-1">
            <li className="flex items-center">
              <span className="font-medium mr-2">State Limit:</span> {constraints.stateLimit} states
            </li>
            <li className="flex items-center">
              <span className="font-medium mr-2">Step Limit:</span> {constraints.stepLimit} steps
            </li>
            <li className="flex items-center">
              <span className="font-medium mr-2">Time Limit:</span> {constraints.timeLimit}ms
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
