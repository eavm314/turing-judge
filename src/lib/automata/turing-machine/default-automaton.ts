import { type JsonTm } from '@/lib/schemas/turing-machine';

export const defaultTm: JsonTm = {
  alphabet: ['0', '1'],
  states: {
    q0: {
      position: { x: 0, y: 0 },
      transitions: {},
    },
  },
  initial: 'q0',
  finals: [],
};
