import { afterEach, describe, expect, it, vi } from 'vitest';

import { FsmExecutor } from '@/lib/automata/finite-state-machine/FsmExecutor';
import { createLinearFsm } from './helpers/fixtures';

describe('FsmExecutor.executeRandom', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('chooses one random branch when multiple transitions are available', () => {
    const json = createLinearFsm();
    json.states.q0.transitions = {
      q1: ['a'],
      q2: ['a'],
    };
    json.states.q2 = { transitions: {} };

    const executor = new FsmExecutor(json);
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    const result = executor.executeRandom('a', true);

    expect(result.accepted).toBe(false);
    expect(result.path).toHaveLength(1);
    expect(result.path[0]?.output).toBe('q2');
  });

  it('can still accept when the selected path reaches a final state', () => {
    const json = createLinearFsm();
    json.states.q0.transitions = {
      q1: ['a'],
      q2: ['a'],
    };
    json.states.q2 = { transitions: {} };

    const executor = new FsmExecutor(json);
    vi.spyOn(Math, 'random').mockReturnValue(0.1);

    const result = executor.executeRandom('a', true);

    expect(result.accepted).toBe(true);
    expect(result.path).toHaveLength(1);
    expect(result.path[0]?.output).toBe('q1');
  });

  it('returns a rejecting path when no further transitions are possible', () => {
    const json = createLinearFsm();
    json.states.q0.transitions = {
      q2: ['a'],
    };
    json.states.q2 = { transitions: {} };

    const executor = new FsmExecutor(json);
    const result = executor.executeRandom('a', true);

    expect(result.accepted).toBe(false);
    expect(result.maxLimitReached).toBe(false);
    expect(result.path).toHaveLength(1);
  });
});
