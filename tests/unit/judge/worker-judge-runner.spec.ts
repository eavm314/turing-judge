import { afterEach, describe, expect, it } from 'vitest';

import { EPSILON } from '@/constants/symbols';
import { judgeSubmission } from '@/lib/judge/judge-submission';
import type { JudgeRequest, JudgeTestCase } from '@/lib/judge/judge-types';
import { runInWorker } from '@/lib/judge/worker-judge-runner';
import type { JsonFsm } from '@/lib/schemas/finite-state-machine';
import type { ProblemConstraints } from '@/lib/schemas';
import { createLinearFsm } from '../automata/helpers/fixtures';

const constraints = (overrides: Partial<ProblemConstraints> = {}): ProblemConstraints => ({
  allowFSM: true,
  allowPDA: true,
  allowTM: true,
  allowNonDet: true,
  stateLimit: 10,
  depthLimit: 500,
  maxStepLimit: 10000,
  ...overrides,
});

const acceptingRequest: JudgeRequest = {
  solution: { type: 'FSM', automaton: createLinearFsm() },
  constraints: constraints(),
  testCases: [
    { input: 'a', expectedResult: true },
    { input: 'b', expectedResult: false },
  ],
};

const runaway = (automaton: JsonFsm, testCases: JudgeTestCase[]): JudgeRequest => ({
  solution: { type: 'FSM', automaton },
  constraints: constraints({ depthLimit: 1e9, maxStepLimit: 1e9 }),
  testCases,
});

// Epsilon transitions never consume input, so 'a' can never be accepted. q1 is a dead end, so the
// search stack stays two deep: this burns CPU at flat memory and only a wall-clock kill ends it.
const spinning = (testCases: JudgeTestCase[]) => {
  const automaton = createLinearFsm();
  automaton.states.q0.transitions = { q0: [EPSILON], q1: [EPSILON] };
  return runaway(automaton, testCases);
};

// Same, except q1 loops back, so every pop pushes more than it removes and the stack grows without
// bound. Kept separate from `spinning` so the timeout test cannot race an out-of-memory kill.
const heapEating = () => {
  const automaton = createLinearFsm();
  automaton.states.q0.transitions = { q0: [EPSILON], q1: [EPSILON] };
  automaton.states.q1.transitions = { q0: [EPSILON] };
  return runaway(automaton, [{ input: 'a', expectedResult: true }]);
};

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe('runInWorker', () => {
  it('produces the same result as judging inline', async () => {
    const outcome = await runInWorker(acceptingRequest);

    expect(outcome).toEqual({ ok: true, result: judgeSubmission(acceptingRequest) });
  });

  it('terminates a synchronous run that exceeds the wall-clock timeout', async () => {
    process.env.JUDGE_WORKER_TIMEOUT_MS = '500';

    const outcome = await runInWorker(spinning([{ input: 'a', expectedResult: true }]));

    expect(outcome).toEqual({ ok: false, reason: 'timeout' });
  }, 20_000);

  it('rejects instead of crashing the process when the worker runs out of memory', async () => {
    process.env.JUDGE_WORKER_TIMEOUT_MS = '15000';
    process.env.JUDGE_WORKER_MEMORY_MB = '16';

    await expect(runInWorker(heapEating())).rejects.toThrow(/memory limit/i);
  }, 20_000);

  it('rejects promptly when the worker bundle is missing', async () => {
    process.env.JUDGE_WORKER_PATH = '/nonexistent/verify-worker.cjs';

    await expect(runInWorker(acceptingRequest)).rejects.toThrow();
  }, 20_000);
});
