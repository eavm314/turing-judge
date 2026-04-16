import { BOTTOM, EPSILON } from '@/constants/symbols';
import { type JsonPda } from '@/lib/schemas/pushdown-automaton';

export const balancedParentheses: JsonPda = {
  alphabet: [EPSILON, '(', ')'],
  stackAlphabet: [BOTTOM, '*'],
  states: {
    q0: {
      transitions: {
        q0: [
          { input: '(', pop: BOTTOM, push: ['*', BOTTOM] },
          { input: '(', pop: '*', push: ['*', '*'] },
          { input: ')', pop: '*', push: [] },
        ],
      },
    },
  },
  initial: 'q0',
  finals: ['q0'],
};

export const anbn: JsonPda = {
  alphabet: [EPSILON, 'a', 'b'],
  stackAlphabet: [BOTTOM, 'A'],
  states: {
    q0: {
      transitions: {
        q0: [
          { input: 'a', pop: BOTTOM, push: ['A', BOTTOM] },
          { input: 'a', pop: 'A', push: ['A', 'A'] },
        ],
        q1: [{ input: 'b', pop: 'A', push: [] }],
      },
    },
    q1: {
      transitions: {
        q1: [{ input: 'b', pop: 'A', push: [] }],
        q2: [{ input: EPSILON, pop: BOTTOM, push: [BOTTOM] }],
      },
    },
    q2: {},
  },
  initial: 'q0',
  finals: ['q2'],
};
