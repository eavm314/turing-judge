import { type ProblemConstraints } from '@/lib/schemas';

export const Constraints = ({ constraints }: { constraints: ProblemConstraints }) => {
  return (
    <div className="mt-4 p-4 rounded-md bg-accent text-neutral-foreground max-h-max w-72">
      <h3 className="text-lg font-bold mb-4">Problem Constraints</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <ul className="space-y-1">
            <li className="flex items-center">
              <span className="font-medium mr-auto">State Limit:</span> {constraints.stateLimit} states
            </li>
            <li className="flex items-center">
              <span className="font-medium mr-auto">Depth Limit:</span> {constraints.depthLimit} steps
            </li>
            <li className="flex items-center">
              <span className="font-medium mr-auto">Maximum Step Limit:</span>{' '}
              {constraints.maxStepLimit} steps
            </li>
          </ul>
        </div>
        <div>
          <ul className="space-y-1">
            <li className="flex items-center">
              <span
                className={`w-4 h-4 mr-2 inline-block ${constraints.allowFSM ? 'text-green-500' : 'text-red-500'}`}
              >
                {constraints.allowFSM ? '✓' : '✗'}
              </span>
              Finite State Machine (FSM)
            </li>
            <li className="flex items-center">
              <span
                className={`w-4 h-4 mr-2 inline-block ${constraints.allowPDA ? 'text-green-500' : 'text-red-500'}`}
              >
                {constraints.allowPDA ? '✓' : '✗'}
              </span>
              Pushdown Automaton (PDA)
            </li>
            <li className="flex items-center">
              <span
                className={`w-4 h-4 mr-2 inline-block ${constraints.allowTM ? 'text-green-500' : 'text-red-500'}`}
              >
                {constraints.allowTM ? '✓' : '✗'}
              </span>
              Turing Machine (TM)
            </li>
            <li className="flex items-center">
              <span
                className={`w-4 h-4 mr-2 inline-block ${constraints.allowNonDet ? 'text-green-500' : 'text-red-500'}`}
              >
                {constraints.allowNonDet ? '✓' : '✗'}
              </span>
              Non-deterministic
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
