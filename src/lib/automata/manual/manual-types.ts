import { FsmStep } from "../finite-state-machine/FsmExecutor";
import { PdaStep } from "../pushdown-automaton/PdaExecutor";
import { TmStep } from "../turing-machine/TmExecutor";

export type ManualSessionStatus = 'running' | 'accepted' | 'blocked';

export type FsmManualRuntime = {
  type: 'FSM';
  state: string;
  inputPos: number;
  word: string;
};

export type PdaManualRuntime = {
  type: 'PDA';
  state: string;
  inputPos: number;
  word: string;
  stack: string[];
};

export type TmManualRuntime = {
  type: 'TM';
  state: string;
  inputPos: number;
  word: string;
  tape: Map<number, string>;
};

export type ManualRuntime = FsmManualRuntime | PdaManualRuntime | TmManualRuntime;

export type OptionStep = { type: 'FSM' } & FsmStep | { type: 'PDA' } & PdaStep | { type: 'TM' } & TmStep;

export type ManualTransitionOption = {
  id: string;
  step: OptionStep;
  description: string;
  kind: 'epsilon' | 'consuming';
  nextRuntime: ManualRuntime;
};

export const cloneManualRuntime = (runtime: ManualRuntime): ManualRuntime => {
  if (runtime.type === 'FSM') {
    return { ...runtime };
  }

  if (runtime.type === 'PDA') {
    return {
      ...runtime,
      stack: [...runtime.stack],
    };
  }

  return {
    ...runtime,
    tape: new Map(runtime.tape),
  };
};
