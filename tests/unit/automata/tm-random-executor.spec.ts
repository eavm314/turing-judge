import { afterEach, describe, expect, it, vi } from 'vitest';

import { TmExecutor } from '@/lib/automata/turing-machine/TmExecutor';
import { createBasicTm } from './helpers/fixtures';

describe('TmExecutor.executeRandom', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('chooses one random branch when multiple transitions are available', () => {
    const json = createBasicTm();
    json.states.q0.transitions = {
      q1: [{ read: 'a', write: 'a', move: 'R' }],
      q2: [{ read: 'a', write: 'a', move: 'R' }],
    };
    json.states.q2 = { transitions: {} };

    const executor = new TmExecutor(json);
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    const result = executor.executeRandom('a', true);

    expect(result.accepted).toBe(false);
    expect(result.path).toHaveLength(1);
    expect(result.path[0]?.output.state).toBe('q2');
  });

  it('can still accept when the selected path reaches a final state', () => {
    const json = createBasicTm();
    json.states.q0.transitions = {
      q1: [{ read: 'a', write: 'a', move: 'R' }],
      q2: [{ read: 'a', write: 'a', move: 'R' }],
    };
    json.states.q2 = { transitions: {} };

    const executor = new TmExecutor(json);
    vi.spyOn(Math, 'random').mockReturnValue(0.1);

    const result = executor.executeRandom('a', true);

    expect(result.accepted).toBe(true);
    expect(result.path).toHaveLength(1);
    expect(result.path[0]?.output.state).toBe('q1');
  });

  it('returns a rejecting path when the chosen branch dead-ends', () => {
    const json = createBasicTm();
    json.states.q0.transitions = {
      q2: [{ read: 'a', write: 'a', move: 'R' }],
    };
    json.states.q2 = { transitions: {} };

    const executor = new TmExecutor(json);
    const result = executor.executeRandom('a', true);

    expect(result.accepted).toBe(false);
    expect(result.maxLimitReached).toBe(false);
    expect(result.path).toHaveLength(1);
  });
});
