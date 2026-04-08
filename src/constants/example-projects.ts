import { AutomatonType } from '@prisma/browser';

const exampleProjects = [
  {
    id: 'pilw80yiq2vnjy2w1gm8hi5q',
    title: 'Even Ones',
    type: AutomatonType.FSM,
    automaton: {
      finals: ['q0'],
      states: {
        q0: { position: { x: -150, y: 0 }, transitions: { q0: ['0'], q1: ['1'] } },
        q1: { position: { x: 150, y: 0 }, transitions: { q0: ['1'], q1: ['0'] } },
      },
      initial: 'q0',
      alphabet: ['0', '1'],
    },
  },
  {
    id: 'q25bcbnu07apqx6iiv08qhx2',
    title: 'Ends with "01"',
    type: AutomatonType.FSM,
    automaton: {
      finals: ['q2'],
      states: {
        q0: { position: { x: -200, y: 0 }, transitions: { q0: ['1'], q1: ['0'] } },
        q1: { position: { x: 0, y: -200 }, transitions: { q1: ['0'], q2: ['1'] } },
        q2: { position: { x: 200, y: 0 }, transitions: { q0: ['1'], q1: ['0'] } },
      },
      initial: 'q0',
      alphabet: ['0', '1'],
    },
  },
  {
    id: 'h147pt8jj29gpztrpob0oeft',
    title: '3-Char Palindrome',
    type: AutomatonType.FSM,
    automaton: {
      finals: ['q_a'],
      states: {
        q0: { position: { x: -360, y: 28 }, transitions: { q1: ['0'], q2: ['1'] } },
        q1: { position: { x: -168, y: -106 }, transitions: { q3: ['0'], q4: ['1'] } },
        q2: { position: { x: -185, y: 93 }, transitions: { q5: ['0'], q6: ['1'] } },
        q3: { position: { x: 0, y: -154 }, transitions: { q_a: ['0'], q_r: ['1'] } },
        q4: { position: { x: 0, y: -50 }, transitions: { q_a: ['0'], q_r: ['1'] } },
        q5: { position: { x: 0, y: 50 }, transitions: { q_a: ['1'], q_r: ['0'] } },
        q6: { position: { x: 0, y: 150 }, transitions: { q_a: ['1'], q_r: ['0'] } },
        q_a: { position: { x: 373, y: 154 }, transitions: {} },
        q_r: { position: { x: 395, y: -174 }, transitions: {} },
      },
      initial: 'q0',
      alphabet: ['0', '1'],
    },
  },
  {
    id: 'x9h6i1odejrjr54mxe79a5n9',
    title: 'Simple NFA',
    type: AutomatonType.FSM,
    automaton: {
      finals: ['q2'],
      states: {
        q0: { position: { x: -190, y: -71 }, transitions: { q0: ['0', '1'], q2: ['1'] } },
        q2: { position: { x: 160, y: -70 }, transitions: {} },
      },
      initial: 'q0',
      alphabet: ['0', '1'],
    },
  },
  {
    id: 'y9h6i1odejrjr54mxe79a5n9',
    title: 'NFA Containing 101',
    type: AutomatonType.FSM,
    automaton: {
      alphabet: ['0', '1'],
      states: {
        q0: {
          position: {
            x: 100,
            y: 100,
          },
          transitions: {
            q0: ['0', '1'],
            q1: ['1'],
          },
        },
        q1: {
          position: {
            x: 300,
            y: 100,
          },
          transitions: {
            q2: ['0'],
          },
        },
        q2: {
          position: {
            x: 500,
            y: 100,
          },
          transitions: {
            q3: ['1'],
          },
        },
        q3: {
          position: {
            x: 700,
            y: 100,
          },
          transitions: {
            q3: ['0', '1'],
          },
        },
      },
      initial: 'q0',
      finals: ['q3'],
    },
  },
  {
    id: 'a9h6i1odejrjr54mxe79a5n9',
    title: 'PDA for Balanced Parentheses',
    type: AutomatonType.PDA,
    automaton: {
      alphabet: ['ε', '(', ')'],
      stackAlphabet: ['⊥', '*'],
      states: {
        q0: {
          position: {
            x: 100,
            y: 150,
          },
          transitions: {
            q1: [
              {
                input: '(',
                pop: '⊥',
                push: ['*', '⊥'],
              },
            ],
          },
        },
        q1: {
          position: {
            x: 400,
            y: 150,
          },
          transitions: {
            q1: [
              {
                input: '(',
                pop: '*',
                push: ['*', '*'],
              },
              {
                input: ')',
                pop: '*',
                push: [],
              },
            ],
            q0: [
              {
                input: 'ε',
                pop: '⊥',
                push: ['⊥'],
              },
            ],
          },
        },
      },
      initial: 'q0',
      finals: ['q0'],
    },
  },
  {
    id: 'z9h6i1odejrjr54mxe79a5n9',
    title: 'PDA for a^n b^n',
    type: AutomatonType.PDA,
    automaton: {
      alphabet: ['ε', 'a', 'b'],
      stackAlphabet: ['⊥', 'A'],
      states: {
        q0: {
          position: {
            x: 100,
            y: 100,
          },
          transitions: {
            q0: [
              {
                input: 'a',
                pop: '⊥',
                push: ['A', '⊥'],
              },
              {
                input: 'a',
                pop: 'A',
                push: ['A', 'A'],
              },
            ],
            q1: [
              {
                input: 'b',
                pop: 'A',
                push: [],
              },
            ],
            q2: [
              {
                input: 'ε',
                pop: '⊥',
                push: ['⊥'],
              },
            ],
          },
        },
        q1: {
          position: {
            x: 300,
            y: 250,
          },
          transitions: {
            q1: [
              {
                input: 'b',
                pop: 'A',
                push: [],
              },
            ],
            q2: [
              {
                input: 'ε',
                pop: '⊥',
                push: ['⊥'],
              },
            ],
          },
        },
        q2: {
          position: {
            x: 500,
            y: 100,
          },
          transitions: {},
        },
      },
      initial: 'q0',
      finals: ['q2'],
    },
  },
  {
    id: 'b9h6i1odejrjr54mxe79a5n9',
    title: 'Turing Machine for a^n b^n c^n',
    type: AutomatonType.TM,
    automaton: {
      alphabet: ['a', 'b', 'c', 'X', 'Y', 'Z'],
      states: {
        q0: {
          position: {
            x: 100,
            y: 100,
          },
          transitions: {
            q0: [
              {
                read: 'X',
                write: 'X',
                move: 'R',
              },
            ],
            q1: [
              {
                read: 'a',
                write: 'X',
                move: 'R',
              },
            ],
            q4: [
              {
                read: 'Y',
                write: 'Y',
                move: 'R',
              },
              {
                read: 'Z',
                write: 'Z',
                move: 'R',
              },
            ],
            qf: [
              {
                read: '_',
                write: '_',
                move: 'S',
              },
            ],
          },
        },
        q1: {
          position: {
            x: 300,
            y: 100,
          },
          transitions: {
            q1: [
              {
                read: 'a',
                write: 'a',
                move: 'R',
              },
              {
                read: 'X',
                write: 'X',
                move: 'R',
              },
              {
                read: 'Y',
                write: 'Y',
                move: 'R',
              },
            ],
            q2: [
              {
                read: 'b',
                write: 'Y',
                move: 'R',
              },
            ],
          },
        },
        q2: {
          position: {
            x: 500,
            y: 100,
          },
          transitions: {
            q2: [
              {
                read: 'b',
                write: 'b',
                move: 'R',
              },
              {
                read: 'Y',
                write: 'Y',
                move: 'R',
              },
              {
                read: 'Z',
                write: 'Z',
                move: 'R',
              },
            ],
            q3: [
              {
                read: 'c',
                write: 'Z',
                move: 'L',
              },
            ],
          },
        },
        q3: {
          position: {
            x: 700,
            y: 100,
          },
          transitions: {
            q3: [
              {
                read: 'a',
                write: 'a',
                move: 'L',
              },
              {
                read: 'b',
                write: 'b',
                move: 'L',
              },
              {
                read: 'c',
                write: 'c',
                move: 'L',
              },
              {
                read: 'X',
                write: 'X',
                move: 'L',
              },
              {
                read: 'Y',
                write: 'Y',
                move: 'L',
              },
              {
                read: 'Z',
                write: 'Z',
                move: 'L',
              },
            ],
            q0: [
              {
                read: '_',
                write: '_',
                move: 'R',
              },
            ],
          },
        },
        q4: {
          position: {
            x: 300,
            y: 300,
          },
          transitions: {
            q4: [
              {
                read: 'Y',
                write: 'Y',
                move: 'R',
              },
              {
                read: 'Z',
                write: 'Z',
                move: 'R',
              },
            ],
            qf: [
              {
                read: '_',
                write: '_',
                move: 'S',
              },
            ],
          },
        },
        qf: {
          position: {
            x: 500,
            y: 300,
          },
          transitions: {},
        },
      },
      initial: 'q0',
      finals: ['qf'],
    },
  },
  {
    id: 'c9h6i1odejrjr54mxe79a5n9',
    title: 'Turing Machine for Binary Multiplication',
    type: AutomatonType.TM,
    automaton: {
      alphabet: ['#', '0', '1'],
      states: {
        q0: {
          position: {
            x: 100,
            y: 100,
          },
          transitions: {
            q0: [
              {
                read: '0',
                write: '0',
                move: 'R',
              },
            ],
            q1: [
              {
                read: '1',
                write: '0',
                move: 'R',
              },
            ],
            qf: [
              {
                read: '#',
                write: '#',
                move: 'R',
              },
            ],
          },
        },
        q1: {
          position: {
            x: 350,
            y: 100,
          },
          transitions: {
            q1: [
              {
                read: '1',
                write: '1',
                move: 'R',
              },
              {
                read: '0',
                write: '0',
                move: 'R',
              },
            ],
            q2: [
              {
                read: '#',
                write: '#',
                move: 'R',
              },
            ],
          },
        },
        q2: {
          position: {
            x: 600,
            y: 100,
          },
          transitions: {
            q3: [
              {
                read: '1',
                write: '0',
                move: 'R',
              },
            ],
            q5: [
              {
                read: '_',
                write: '_',
                move: 'L',
              },
            ],
          },
        },
        q3: {
          position: {
            x: 850,
            y: 100,
          },
          transitions: {
            q3: [
              {
                read: '1',
                write: '1',
                move: 'R',
              },
              {
                read: '0',
                write: '0',
                move: 'R',
              },
              {
                read: '#',
                write: '#',
                move: 'R',
              },
            ],
            q3r: [
              {
                read: '_',
                write: '_',
                move: 'R',
              },
            ],
          },
        },
        q3r: {
          position: {
            x: 1100,
            y: 100,
          },
          transitions: {
            q3r: [
              {
                read: '1',
                write: '1',
                move: 'R',
              },
            ],
            q4: [
              {
                read: '_',
                write: '1',
                move: 'L',
              },
            ],
          },
        },
        q4: {
          position: {
            x: 1100,
            y: 350,
          },
          transitions: {
            q4: [
              {
                read: '1',
                write: '1',
                move: 'L',
              },
            ],
            q4b: [
              {
                read: '_',
                write: '_',
                move: 'L',
              },
            ],
          },
        },
        q4b: {
          position: {
            x: 850,
            y: 350,
          },
          transitions: {
            q4b: [
              {
                read: '1',
                write: '1',
                move: 'L',
              },
              {
                read: '#',
                write: '#',
                move: 'L',
              },
            ],
            q2: [
              {
                read: '0',
                write: '0',
                move: 'R',
              },
            ],
          },
        },
        q5: {
          position: {
            x: 600,
            y: 350,
          },
          transitions: {
            q5: [
              {
                read: '0',
                write: '1',
                move: 'L',
              },
              {
                read: '1',
                write: '1',
                move: 'L',
              },
            ],
            q6: [
              {
                read: '#',
                write: '#',
                move: 'L',
              },
            ],
          },
        },
        q6: {
          position: {
            x: 350,
            y: 350,
          },
          transitions: {
            q6: [
              {
                read: '1',
                write: '1',
                move: 'L',
              },
            ],
            q0: [
              {
                read: '0',
                write: '0',
                move: 'R',
              },
            ],
          },
        },
        qf: {
          position: {
            x: 100,
            y: 350,
          },
          transitions: {},
        },
      },
      initial: 'q0',
      finals: ['qf'],
    },
  },
];

export default exampleProjects;
