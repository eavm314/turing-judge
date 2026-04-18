import { describe, expect, it } from 'vitest';

import { EPSILON } from '@/constants/symbols';
import { FsmExecutor } from '@/lib/automata/finite-state-machine/FsmExecutor';
import { createLinearFsm } from './helpers/fixtures';

describe('FsmExecutor', () => {
  it('accepts a valid input in a simple DFA', () => {
    const executor = new FsmExecutor(createLinearFsm());

    const result = executor.execute('a');
    expect(result.accepted).toBe(true);
    expect(result.maxLimitReached).toBe(false);
  });

  it('rejects invalid input in a simple DFA', () => {
    const executor = new FsmExecutor(createLinearFsm());

    const result = executor.execute('b');
    expect(result.accepted).toBe(false);
  });

  it('explores non-deterministic branches and accepts when any branch reaches final', () => {
    const json = createLinearFsm();
    json.states.q0.transitions = { q0: ['a'], q1: ['a'] };
    const executor = new FsmExecutor(json);

    const result = executor.execute('a');
    expect(result.accepted).toBe(true);
  });

  it('keeps path empty when savePath is false', () => {
    const executor = new FsmExecutor(createLinearFsm());

    const result = executor.execute('a', false);
    expect(result.path).toEqual([]);
  });

  it('records path steps when savePath is true', () => {
    const executor = new FsmExecutor(createLinearFsm());

    const result = executor.execute('a', true);
    expect(result.accepted).toBe(true);
    expect(result.path).toHaveLength(1);
    expect(result.path[0]?.input).toEqual({ state: 'q0', symbol: 'a' });
    expect(result.path[0]?.output).toBe('q1');
  });

  it('marks depthLimitReached on epsilon loops', () => {
    const json = createLinearFsm();
    json.alphabet.push(EPSILON);
    json.states.q0.transitions = { q0: [EPSILON] };
    json.finals = [];

    const executor = new FsmExecutor(json);
    executor.config.depthLimit = 2;

    const result = executor.execute('', false);
    expect(result.accepted).toBe(false);
    expect(result.depthLimitReached).toBe(true);
  });

  it('marks maxLimitReached when exploration exceeds maxSteps', () => {
    const json = createLinearFsm();
    json.alphabet.push(EPSILON);
    json.states.q0.transitions = { q0: [EPSILON] };
    json.finals = [];

    const executor = new FsmExecutor(json);
    executor.config.maxSteps = 1;

    const result = executor.execute('', false);
    expect(result.accepted).toBe(false);
    expect(result.maxLimitReached).toBe(true);
  });
});
