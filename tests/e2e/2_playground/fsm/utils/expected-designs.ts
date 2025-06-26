import { EPSILON } from '@/constants/symbols';
import { type JsonFsm } from '@/lib/schemas/finite-state-machine';

export const basicAutomata: JsonFsm = {
  alphabet: ['0', '1'],
  states: {
    q0: {},
  },
  initial: 'q0',
  finals: [],
};

export const evenOnes: JsonFsm = {
  alphabet: ['0', '1'],
  states: {
    q0: {
      transitions: {
        q0: ['0'],
        q1: ['1'],
      },
    },
    q1: {
      transitions: {
        q1: ['0'],
        q0: ['1'],
      },
    },
  },
  initial: 'q0',
  finals: ['q0'],
};

export const endsWith01: JsonFsm = {
  alphabet: ['0', '1'],
  states: {
    q0: {
      transitions: {
        q1: ['0'],
        q0: ['1'],
      },
    },
    q1: {
      transitions: {
        q1: ['0'],
        q2: ['1'],
      },
    },
    q2: {
      transitions: {
        q1: ['0'],
        q0: ['1'],
      },
    },
  },
  initial: 'q0',
  finals: ['q2'],
};

export const simpleNonDet: JsonFsm = {
  alphabet: ['0', '1'],
  states: {
    q0: {
      transitions: {
        q0: ['0', '1'],
        q2: ['1'],
      },
    },
    q2: {},
  },
  initial: 'q0',
  finals: ['q2'],
};

export const epsilonTransitions: JsonFsm = {
  alphabet: [EPSILON, '0', '1'],
  states: {
    q0: {
      transitions: {
        q1: [EPSILON],
        q2: [EPSILON],
      },
    },
    q1: {
      transitions: {
        q4: ['0'],
      },
    },
    q2: {
      transitions: {
        q3: ['0'],
      },
    },
    q3: {
      transitions: {
        q2: [EPSILON],
      },
    },
    q4: {
      transitions: {
        q5: ['1'],
      },
    },
    q5: {},
  },
  initial: 'q0',
  finals: ['q3', 'q5'],
};
