import type { AutomatonCode } from '@/lib/schemas/automaton-code';
import type { BaseExecutor } from '@/lib/automata/base/BaseExecutor';
import { defaultFsm } from '@/lib/automata/finite-state-machine/default-automaton';
import { defaultPda } from '@/lib/automata/pushdown-automaton/default-automaton';
import { defaultTm } from '@/lib/automata/turing-machine/default-automaton';
import { FsmExecutor } from '@/lib/automata/finite-state-machine/FsmExecutor';
import { PdaExecutor } from '@/lib/automata/pushdown-automaton/PdaExecutor';
import { TmExecutor } from '@/lib/automata/turing-machine/TmExecutor';

// Imports the executors directly rather than through the automata barrels: those also export the
// Designers and Animators, whose module graph reaches React, @xyflow/react and the playground store.
export const createJudgeExecutor = (solution: AutomatonCode): BaseExecutor => {
  switch (solution.type) {
    case 'FSM':
      return new FsmExecutor(solution.automaton ?? defaultFsm);
    case 'PDA':
      return new PdaExecutor(solution.automaton ?? defaultPda);
    case 'TM':
      return new TmExecutor(solution.automaton ?? defaultTm);
  }
};
