import { BOTTOM } from '@/constants/symbols';
import { type JsonPda } from '@/lib/schemas/pushdown-automaton';

export const defaultPda: JsonPda = {
  alphabet: ['0', '1'],
  stackAlphabet: [BOTTOM, 'A'],
  states: {
    q0: {
      position: { x: 0, y: 0 },
      transitions: {},
    },
  },
  initial: 'q0',
  finals: [],
};
