import { describe, expect, it } from 'vitest';

import { BLANK, EPSILON } from '@/constants/symbols';
import { TmExecutor } from '@/lib/automata/turing-machine/TmExecutor';
import { createBasicTm } from './helpers/fixtures';

describe('TmExecutor', () => {
  it('accepts once a final state is reached', () => {
    const json = createBasicTm();
    json.states.q0.transitions = {
      q1: [{ read: 'a', write: 'a', move: 'R' }],
    };

    const executor = new TmExecutor(json);
    const result = executor.execute('a', true);

    expect(result.accepted).toBe(true);
    expect(result.path).toHaveLength(1);
  });

  it('handles blank reads on empty input', () => {
    const json = createBasicTm();
    json.states.q0.transitions = {
      q1: [{ read: BLANK, write: BLANK, move: 'S' }],
    };

    const executor = new TmExecutor(json);
    const result = executor.execute('', true);

    expect(result.accepted).toBe(true);
    expect(result.path[0]?.input.readSymbol).toBe(BLANK);
  });

  it('supports left moves and records head position in path input', () => {
    const json = createBasicTm();
    json.states.q0.transitions = {
      q1: [{ read: 'a', write: 'a', move: 'L' }],
    };

    const executor = new TmExecutor(json);
    const result = executor.execute('a', true);

    expect(result.accepted).toBe(true);
    expect(result.path[0]?.input.position).toBe(0);
    expect(result.path[0]?.output.direction).toBe('L');
  });

  it('keeps path empty when savePath is false', () => {
    const json = createBasicTm();
    json.states.q0.transitions = {
      q1: [{ read: 'a', write: 'a', move: 'R' }],
    };

    const executor = new TmExecutor(json);
    const result = executor.execute('a', false);

    expect(result.accepted).toBe(true);
    expect(result.path).toEqual([]);
  });

  it('marks depthLimitReached on epsilon loops', () => {
    const json = createBasicTm();
    json.alphabet.push(EPSILON);
    json.states.q0.transitions = {
      q0: [{ read: EPSILON, write: 'a', move: 'S' }],
    };
    json.finals = [];

    const executor = new TmExecutor(json);
    executor.config.depthLimit = 2;

    const result = executor.execute('', false);
    expect(result.accepted).toBe(false);
    expect(result.depthLimitReached).toBe(true);
  });

  it('marks maxLimitReached when exploration exceeds maxSteps', () => {
    const json = createBasicTm();
    json.alphabet.push(EPSILON);
    json.states.q0.transitions = {
      q0: [{ read: EPSILON, write: 'a', move: 'S' }],
    };
    json.finals = [];

    const executor = new TmExecutor(json);
    executor.config.maxSteps = 1;

    const result = executor.execute('', false);
    expect(result.accepted).toBe(false);
    expect(result.maxLimitReached).toBe(true);
  });

  it('rejects when no transition matches and state is not final', () => {
    const json = createBasicTm();
    json.finals = [];

    const executor = new TmExecutor(json);
    const result = executor.execute('a', true);

    expect(result.accepted).toBe(false);
    expect(result.path).toEqual([]);
  });
});
