import { BOTTOM, BLANK } from '@/constants/symbols';
import type { JsonFsm } from '@/lib/schemas/finite-state-machine';
import type { JsonPda } from '@/lib/schemas/pushdown-automaton';
import type { JsonTm } from '@/lib/schemas/turing-machine';

export const createBasicFsm = (): JsonFsm => ({
  alphabet: ['a', 'b'],
  states: {
    q0: { transitions: {} },
    q1: { transitions: {} },
  },
  initial: 'q0',
  finals: ['q1'],
});

export const createBasicPda = (): JsonPda => ({
  alphabet: ['a', 'b'],
  stackAlphabet: [BOTTOM, 'A'],
  states: {
    q0: { transitions: {} },
    q1: { transitions: {} },
  },
  initial: 'q0',
  finals: ['q1'],
});

export const createBasicTm = (): JsonTm => ({
  alphabet: ['a', 'b'],
  states: {
    q0: { transitions: {} },
    q1: { transitions: {} },
  },
  initial: 'q0',
  finals: ['q1'],
});

export const createLinearFsm = (): JsonFsm => ({
  alphabet: ['a'],
  states: {
    q0: { transitions: { q1: ['a'] } },
    q1: { transitions: {} },
  },
  initial: 'q0',
  finals: ['q1'],
});

export const createLinearPda = (): JsonPda => ({
  alphabet: ['a'],
  stackAlphabet: [BOTTOM, 'A'],
  states: {
    q0: {
      transitions: {
        q0: [{ input: 'a', pop: BOTTOM, push: [BOTTOM] }],
        q1: [{ input: 'a', pop: BOTTOM, push: [BOTTOM] }],
      },
    },
    q1: { transitions: {} },
  },
  initial: 'q0',
  finals: ['q1'],
});

export const createLinearTm = (): JsonTm => ({
  alphabet: ['a'],
  states: {
    q0: {
      transitions: {
        q1: [{ read: 'a', write: 'a', move: 'R' }],
      },
    },
    q1: {
      transitions: {
        q1: [{ read: BLANK, write: BLANK, move: 'S' }],
      },
    },
  },
  initial: 'q0',
  finals: ['q1'],
});
