import { type JsonFsm } from '@/lib/schemas/finite-state-machine';

export const defaultFsm: JsonFsm = {
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
