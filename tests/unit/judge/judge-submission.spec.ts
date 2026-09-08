import { describe, expect, it } from 'vitest';

import { buildTimeoutMessage, judgeSubmission } from '@/lib/judge/judge-submission';
import type { JudgeProgress, JudgeRequest, JudgeTestCase } from '@/lib/judge/judge-types';
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

const request = (overrides: Partial<JudgeRequest> = {}): JudgeRequest => ({
  solution: { type: 'FSM', automaton: createLinearFsm() },
  constraints: constraints(),
  testCases: [{ input: 'a', expectedResult: true }],
  ...overrides,
});

describe('judgeSubmission', () => {
  it('accepts when every test case matches', () => {
    const testCases: JudgeTestCase[] = [
      { input: 'a', expectedResult: true },
      { input: 'b', expectedResult: false },
      { input: '', expectedResult: false },
    ];

    const result = judgeSubmission(request({ testCases }));

    expect(result.verdict).toBe('ACCEPTED');
    expect(result.message).toBe('(3/3)');
    expect(result.passedCases).toBe(3);
    expect(result.totalCases).toBe(3);
  });

  it('reports the first failing case and stops there', () => {
    const testCases: JudgeTestCase[] = [
      { input: 'a', expectedResult: true },
      { input: 'b', expectedResult: true },
      { input: 'a', expectedResult: true },
    ];

    const result = judgeSubmission(request({ testCases }));

    expect(result.verdict).toBe('WRONG_RESULT');
    expect(result.passedCases).toBe(1);
    expect(result.message).toContain("Failed test case: 'b'.");
  });

  it('returns STEP_LIMIT_EXCEEDED when the step budget runs out', () => {
    const automaton = createLinearFsm();
    automaton.states.q0.transitions = { q0: ['a'] };

    // The expected result has to match the (rejecting) outcome, because a mismatch would
    // overwrite STEP_LIMIT_EXCEEDED with WRONG_RESULT in the same iteration.
    const result = judgeSubmission(
      request({
        solution: { type: 'FSM', automaton },
        constraints: constraints({ maxStepLimit: 1 }),
        testCases: [{ input: 'aaa', expectedResult: false }],
      }),
    );

    expect(result.verdict).toBe('STEP_LIMIT_EXCEEDED');
    expect(result.message).toContain('Max step limit reached.');
  });

  it.each([
    ['FSM', { allowFSM: false }, 'This problem does not accept FSM solutions.'],
    ['PDA', { allowPDA: false }, 'This problem does not accept PDA solutions.'],
    ['TM', { allowTM: false }, 'This problem does not accept TM solutions.'],
  ] as const)('rejects a %s solution when the type is not allowed', (type, overrides, message) => {
    const result = judgeSubmission(
      request({ solution: { type }, constraints: constraints(overrides) }),
    );

    expect(result.verdict).toBe('INVALID_FORMAT');
    expect(result.message).toBe(message);
  });

  it('rejects a non-deterministic solution when the problem forbids it', () => {
    const automaton = createLinearFsm();
    automaton.states.q0.transitions = { q0: ['a'], q1: ['a'] };

    const result = judgeSubmission(
      request({
        solution: { type: 'FSM', automaton },
        constraints: constraints({ allowNonDet: false }),
      }),
    );

    expect(result.verdict).toBe('INVALID_FORMAT');
    expect(result.message).toBe('This problem does not accept non-deterministic solutions.');
  });

  it('rejects an automaton with more states than the limit', () => {
    const result = judgeSubmission(request({ constraints: constraints({ stateLimit: 1 }) }));

    expect(result.verdict).toBe('INVALID_FORMAT');
    expect(result.message).toBe('The automaton has too many states.');
  });

  it('falls back to the default automaton when the solution carries none', () => {
    const result = judgeSubmission(
      request({
        solution: { type: 'FSM' },
        testCases: [{ input: '0', expectedResult: false }],
      }),
    );

    expect(result.verdict).toBe('ACCEPTED');
  });

  it('reports progress once per passed case', () => {
    const seen: JudgeProgress[] = [];

    judgeSubmission(
      request({
        testCases: [
          { input: 'a', expectedResult: true },
          { input: 'b', expectedResult: false },
          { input: 'b', expectedResult: true },
        ],
      }),
      (progress) => seen.push(progress),
    );

    expect(seen).toEqual([
      { passedCases: 1, totalCases: 3 },
      { passedCases: 2, totalCases: 3 },
    ]);
  });

  it('reports the depth limit on a rejected case', () => {
    const automaton = createLinearFsm();
    automaton.states.q0.transitions = { q0: ['a'] };

    const result = judgeSubmission(
      request({
        solution: { type: 'FSM', automaton },
        constraints: constraints({ depthLimit: 1 }),
        testCases: [{ input: 'aaa', expectedResult: true }],
      }),
    );

    expect(result.verdict).toBe('WRONG_RESULT');
    expect(result.message).toContain('Depth limit reached.');
  });
});

describe('buildTimeoutMessage', () => {
  it('keeps the case count that the message for a finished run uses', () => {
    expect(buildTimeoutMessage({ passedCases: 7, totalCases: 20 })).toBe(
      '(7/20) Time limit exceeded.',
    );
  });
});
