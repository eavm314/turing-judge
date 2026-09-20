import type { Verdict } from '@prisma/browser';
import type { ProblemConstraints } from '@/lib/schemas';
import type { AutomatonCode } from '@/lib/schemas/automaton-code';

export type JudgeTestCase = {
  input: string;
  expectedResult: boolean;
};

export type JudgeRequest = {
  solution: AutomatonCode;
  constraints: ProblemConstraints;
  testCases: JudgeTestCase[];
};

export type JudgeVerdict = Extract<
  Verdict,
  'ACCEPTED' | 'WRONG_RESULT' | 'STEP_LIMIT_EXCEEDED' | 'INVALID_FORMAT'
>;

export type JudgeResult = {
  verdict: JudgeVerdict;
  message: string;
  totalCases: number;
  passedCases: number;
};

export type JudgeProgress = {
  passedCases: number;
  totalCases: number;
};

export type JudgeWorkerMessage =
  | { type: 'progress'; progress: JudgeProgress }
  | { type: 'result'; result: JudgeResult };

export type JudgeOutcome =
  | { ok: true; result: JudgeResult }
  | { ok: false; reason: 'timeout'; progress: JudgeProgress };
