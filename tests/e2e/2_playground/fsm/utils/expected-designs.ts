import { EPSILON } from '@/constants/symbols';
import { type JsonFSM } from '@/lib/schemas/finite-state-machine';

export const basicAutomata: JsonFSM = {
  alphabet: ['0', '1'],
  states: {
    q0: {},
  },
  initial: 'q0',
  finals: [],
};

export const evenOnes: JsonFSM = {
  alphabet: ['0', '1'],
  states: {
    q0: {
      transitions: {
        '0': ['q0'],
        '1': ['q1'],
      },
    },
    q1: {
      transitions: {
        '0': ['q1'],
        '1': ['q0'],
      },
    },
  },
  initial: 'q0',
  finals: ['q0'],
};

export const endsWith01: JsonFSM = {
  alphabet: ['0', '1'],
  states: {
    q0: {
      transitions: {
        '0': ['q1'],
        '1': ['q0'],
      },
    },
    q1: {
      transitions: {
        '0': ['q1'],
        '1': ['q2'],
      },
    },
    q2: {
      transitions: {
        '0': ['q1'],
        '1': ['q0'],
      },
    },
  },
  initial: 'q0',
  finals: ['q2'],
};

export const simpleNonDet: JsonFSM = {
  alphabet: ['0', '1'],
  states: {
    q0: {
      transitions: {
        '0': ['q0'],
        '1': ['q0', 'q2'],
      },
    },
    q2: {},
  },
  initial: 'q0',
  finals: ['q2'],
};

export const epsilonTransitions: JsonFSM = {
  alphabet: [EPSILON, '0', '1'],
  states: {
    q0: {
      transitions: {
        [EPSILON]: ['q1', 'q2'],
      },
    },
    q1: {
      transitions: {
        '0': ['q4'],
      },
    },
    q2: {
      transitions: {
        '0': ['q3'],
      },
    },
    q3: {
      transitions: {
        [EPSILON]: ['q2'],
      },
    },
    q4: {
      transitions: {
        '1': ['q5'],
      },
    },
    q5: {},
  },
  initial: 'q0',
  finals: ['q3', 'q5'],
};
