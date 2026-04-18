import { describe, expect, it } from 'vitest';

import { BOTTOM, EPSILON } from '@/constants/symbols';
import { PdaExecutor } from '@/lib/automata/pushdown-automaton/PdaExecutor';
import { createBasicPda } from './helpers/fixtures';

describe('PdaExecutor', () => {
  it('accepts when input is consumed and final state is reached', () => {
    const json = createBasicPda();
    json.states.q0.transitions = {
      q1: [{ input: 'a', pop: BOTTOM, push: [BOTTOM] }],
    };

    const executor = new PdaExecutor(json);
    const result = executor.execute('a', true);

    expect(result.accepted).toBe(true);
    expect(result.path).toHaveLength(1);
  });

  it('rejects when no transition matches input and stack top', () => {
    const json = createBasicPda();
    json.states.q0.transitions = {
      q1: [{ input: 'a', pop: BOTTOM, push: [BOTTOM] }],
    };

    const executor = new PdaExecutor(json);
    const result = executor.execute('b');

    expect(result.accepted).toBe(false);
  });

  it('stores push symbols in reverse order from transition definition', () => {
    const json = createBasicPda();
    json.states.q0.transitions = {
      q1: [{ input: 'a', pop: BOTTOM, push: ['A', BOTTOM] }],
    };

    const executor = new PdaExecutor(json);
    const result = executor.execute('a', true);

    expect(result.accepted).toBe(true);
    expect(result.path[0]?.output.push).toEqual([BOTTOM, 'A']);
  });

  it('keeps path empty when savePath is false', () => {
    const json = createBasicPda();
    json.states.q0.transitions = {
      q1: [{ input: 'a', pop: BOTTOM, push: [BOTTOM] }],
    };

    const executor = new PdaExecutor(json);
    const result = executor.execute('a', false);

    expect(result.accepted).toBe(true);
    expect(result.path).toEqual([]);
  });

  it('marks depthLimitReached on epsilon loops', () => {
    const json = createBasicPda();
    json.alphabet.push(EPSILON);
    json.states.q0.transitions = {
      q0: [{ input: EPSILON, pop: BOTTOM, push: [BOTTOM] }],
    };
    json.finals = [];

    const executor = new PdaExecutor(json);
    executor.config.depthLimit = 2;

    const result = executor.execute('', false);
    expect(result.accepted).toBe(false);
    expect(result.depthLimitReached).toBe(true);
  });

  it('marks maxLimitReached when exploration exceeds maxSteps', () => {
    const json = createBasicPda();
    json.alphabet.push(EPSILON);
    json.states.q0.transitions = {
      q0: [{ input: EPSILON, pop: BOTTOM, push: [BOTTOM] }],
    };
    json.finals = [];

    const executor = new PdaExecutor(json);
    executor.config.maxSteps = 1;

    const result = executor.execute('', false);
    expect(result.accepted).toBe(false);
    expect(result.maxLimitReached).toBe(true);
  });

  it('safely rejects branches that underflow the stack', () => {
    const json = createBasicPda();
    json.alphabet.push(EPSILON);
    json.states.q0.transitions = {
      q0: [{ input: EPSILON, pop: BOTTOM, push: [] }],
    };
    json.finals = [];

    const executor = new PdaExecutor(json);
    const result = executor.execute('', false);

    expect(result.accepted).toBe(false);
    expect(result.maxLimitReached).toBe(false);
  });
});
