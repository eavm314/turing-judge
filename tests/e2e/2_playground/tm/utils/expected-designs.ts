import { BLANK } from '@/constants/symbols';
import { type JsonTm } from '@/lib/schemas/turing-machine';

export const unaryIncrement: JsonTm = {
  alphabet: ['0', '1'],
  states: {
    q0: {
      transitions: {
        q0: [{ read: '1', write: '1', move: 'R' }],
        q1: [{ read: BLANK, write: '1', move: 'S' }],
      },
    },
    q1: {},
  },
  initial: 'q0',
  finals: ['q1'],
};

export const invertBinary: JsonTm = {
  alphabet: ['0', '1'],
  states: {
    q0: {
      transitions: {
        q0: [
          { read: '0', write: '1', move: 'R' },
          { read: '1', write: '0', move: 'R' },
        ],
        q1: [{ read: BLANK, write: BLANK, move: 'S' }],
      },
    },
    q1: {},
  },
  initial: 'q0',
  finals: ['q1'],
};
