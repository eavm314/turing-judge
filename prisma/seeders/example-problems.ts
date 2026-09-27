import type { ProblemDifficulty } from '@prisma/browser';

export type ExampleTestCase = {
  input: string;
  expectedResult: boolean;
};

export type ExampleProblem = {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  statement: string;
  allowFSM: boolean;
  allowPDA: boolean;
  allowTM: boolean;
  allowNonDet: boolean;
  stateLimit: number;
  depthLimit: number;
  maxStepLimit: number;
  testCases: ExampleTestCase[];
};

const accept = (...inputs: string[]) => inputs.map(input => ({ input, expectedResult: true }));
const reject = (...inputs: string[]) => inputs.map(input => ({ input, expectedResult: false }));

const exampleProblems: ExampleProblem[] = [
  {
    id: 'ihorezv2kza1rucq8tcdb94z',
    title: 'Even Number of Ones',
    difficulty: 'EASY',
    statement: `# Even Number of Ones

Design a **deterministic** finite state machine that accepts a binary string exactly when the number of \`1\`s it contains is even.

$L = \\{\\, w \\in \\{0,1\\}^* \\mid \\#_1(w) \\bmod 2 = 0 \\,\\}$

The empty string contains zero \`1\`s, and zero is even, so $\\varepsilon \\in L$.

## Input

Strings over the alphabet $\\{0, 1\\}$.

## Examples

| Input | Verdict | Why |
| --- | --- | --- |
| \`ε\` | accepted | no \`1\`s |
| \`0\` | accepted | no \`1\`s |
| \`101\` | accepted | two \`1\`s |
| \`1\` | rejected | one \`1\` |
| \`1101\` | rejected | three \`1\`s |

## Notes

Only deterministic solutions are accepted: no state may have two transitions on the same symbol, and ε-transitions are not allowed. Two states are enough.`,
    allowFSM: true,
    allowPDA: false,
    allowTM: false,
    allowNonDet: false,
    stateLimit: 4,
    depthLimit: 40,
    maxStepLimit: 1000,
    testCases: [
      ...accept('', '0', '11', '101', '111111', '0101110'),
      ...reject('1', '10', '1101', '10101', '000111', '1000'),
    ],
  },
  {
    id: 'xaz57ormmwfmyb5whlxta6uf',
    title: 'Binary Multiples of Three',
    difficulty: 'MEDIUM',
    statement: `# Binary Multiples of Three

A binary string can be read as a natural number written in base two, most significant bit first — \`1100\` denotes $12$. Design a **deterministic** finite state machine that accepts a non-empty binary string exactly when the number it denotes is a multiple of three.

$L = \\{\\, w \\in \\{0,1\\}^+ \\mid \\mathrm{value}_2(w) \\equiv 0 \\pmod 3 \\,\\}$

Leading zeros are allowed, so \`0\`, \`00\` and \`0110\` are all valid inputs. The empty string denotes no number at all and must be rejected.

## Input

Strings over the alphabet $\\{0, 1\\}$.

## Examples

| Input | Verdict | Why |
| --- | --- | --- |
| \`0\` | accepted | $0 = 3 \\times 0$ |
| \`11\` | accepted | $3 = 3 \\times 1$ |
| \`1100\` | accepted | $12 = 3 \\times 4$ |
| \`ε\` | rejected | not a number |
| \`10\` | rejected | $2$ |
| \`111\` | rejected | $7$ |

## Notes

Reading one more bit doubles the value and then adds the bit, so the remainder modulo three is all you need to remember. Four states are enough: three for the remainder, plus a start state that keeps $\\varepsilon$ out of the language.`,
    allowFSM: true,
    allowPDA: false,
    allowTM: false,
    allowNonDet: false,
    stateLimit: 6,
    depthLimit: 60,
    maxStepLimit: 2000,
    testCases: [
      ...accept('0', '00', '11', '110', '1001', '1100', '1111', '10010'),
      ...reject('', '1', '10', '111', '101', '10001'),
    ],
  },
  {
    id: 'na072yueizaxjlhp8dhc0zwu',
    title: 'Contains the Pattern 101',
    difficulty: 'EASY',
    statement: `# Contains the Pattern 101

Design a finite state machine that accepts a binary string exactly when \`101\` occurs somewhere inside it as a contiguous substring.

$L = \\{\\, x\\,101\\,y \\mid x, y \\in \\{0,1\\}^* \\,\\}$

## Input

Strings over the alphabet $\\{0, 1\\}$.

## Examples

| Input | Verdict | Why |
| --- | --- | --- |
| \`101\` | accepted | the whole string is the pattern |
| \`1101\` | accepted | the pattern starts at position 2 |
| \`11011\` | accepted | the pattern starts at position 2 |
| \`ε\` | rejected | too short |
| \`1100\` | rejected | no \`101\` anywhere |

## Notes

Non-deterministic solutions are allowed here. The shortest answer is a four-state NFA that loops on the start state, guesses where the pattern begins, walks through \`1\`, \`0\`, \`1\`, and then loops on an accepting state. A DFA also works if you prefer one.`,
    allowFSM: true,
    allowPDA: false,
    allowTM: false,
    allowNonDet: true,
    stateLimit: 6,
    depthLimit: 60,
    maxStepLimit: 5000,
    testCases: [
      ...accept('101', '1101', '0101', '11011', '0101110', '1010101'),
      ...reject('', '100', '1100', '111000', '010', '000111'),
    ],
  },
  {
    id: 'g428c38c6xtvz1tgjzmisxvs',
    title: 'Third Symbol from the End is One',
    difficulty: 'MEDIUM',
    statement: `# Third Symbol from the End is One

Design a finite state machine that accepts a binary string exactly when its third symbol counted from the right is \`1\`. Strings shorter than three symbols are rejected.

$L = \\{\\, x\\,1\\,y \\mid x \\in \\{0,1\\}^*,\\ y \\in \\{0,1\\}^2 \\,\\}$

## Input

Strings over the alphabet $\\{0, 1\\}$.

## Examples

| Input | Verdict | Why |
| --- | --- | --- |
| \`100\` | accepted | third from the right is \`1\` |
| \`0100\` | accepted | third from the right is \`1\` |
| \`00100\` | accepted | third from the right is \`1\` |
| \`1000\` | rejected | third from the right is \`0\` |
| \`11\` | rejected | fewer than three symbols |

## Notes

This problem allows at most **6 states**. The smallest DFA for this language needs eight — one for every window of the last three symbols — so a deterministic solution will not fit inside the limit.

Use non-determinism instead: loop on the start state, guess that the \`1\` you are reading is the third symbol from the end, and then count off exactly two more symbols before accepting. That takes four states.`,
    allowFSM: true,
    allowPDA: false,
    allowTM: false,
    allowNonDet: true,
    stateLimit: 6,
    depthLimit: 60,
    maxStepLimit: 5000,
    testCases: [
      ...accept('100', '0100', '110', '11111', '00100', '101'),
      ...reject('', '1', '11', '000', '1000', '010', '00011'),
    ],
  },
  {
    id: 'j6dbw4ehsh45tsiv54sd9zyd',
    title: 'Balanced Parentheses',
    difficulty: 'MEDIUM',
    statement: `# Balanced Parentheses

Design a pushdown automaton that accepts a string of parentheses exactly when it is balanced: every \`(\` is closed by a later \`)\`, and no prefix of the string contains more \`)\` than \`(\`.

$L = \\{\\, w \\mid w \\text{ is a balanced string of parentheses} \\,\\}$

The empty string is balanced and must be accepted.

## Input

Strings over the alphabet $\\{\\,(\\,, \\,)\\,\\}$.

## Examples

| Input | Verdict | Why |
| --- | --- | --- |
| \`ε\` | accepted | nothing to close |
| \`()\` | accepted | balanced |
| \`()(())\` | accepted | balanced |
| \`(()\` | rejected | one \`(\` never closes |
| \`())\` | rejected | one \`)\` too many |
| \`)(\` | rejected | closes before it opens |

## Notes

A submission is accepted when the whole input has been consumed **and** the machine is in a final state — acceptance is by final state, not by empty stack. Push a marker for each \`(\` and pop one for each \`)\`; when the bottom-of-stack symbol $\\bot$ is back on top you know the counts match, and an ε-transition can move you to the accepting state from there.

Remember that every transition pops the stack, so push the popped symbol back when you mean to keep it.`,
    allowFSM: false,
    allowPDA: true,
    allowTM: false,
    allowNonDet: true,
    stateLimit: 6,
    depthLimit: 100,
    maxStepLimit: 5000,
    testCases: [
      ...accept('', '()', '(())', '()()', '((()))', '()(())'),
      ...reject('(', ')', '())', '(()', ')(', '(()))('),
    ],
  },
  {
    id: 'pd7tzkib1hjot7yn0s4begt8',
    title: 'Equal Numbers of a and b',
    difficulty: 'MEDIUM',
    statement: `# Equal Numbers of a and b

Design a pushdown automaton that accepts a string over $\\{a, b\\}$ exactly when it contains as many \`a\`s as \`b\`s. The letters may appear in any order.

$L = \\{\\, w \\in \\{a,b\\}^* \\mid \\#_a(w) = \\#_b(w) \\,\\}$

The empty string has zero of each letter and is accepted.

## Input

Strings over the alphabet $\\{a, b\\}$.

## Examples

| Input | Verdict | Why |
| --- | --- | --- |
| \`ε\` | accepted | zero of each |
| \`ba\` | accepted | one of each |
| \`abba\` | accepted | two of each |
| \`aab\` | rejected | two \`a\`s, one \`b\` |
| \`aaabb\` | rejected | three \`a\`s, two \`b\`s |

## Notes

This is harder than $a^n b^n$, because the letters are interleaved and the surplus can swing either way. Keep a single counter on the stack that records the current surplus together with which letter is ahead: push when the incoming letter agrees with the surplus, pop when it cancels one off.

Acceptance is by final state with the whole input consumed, so you need to detect that the stack is back to just $\\bot$.`,
    allowFSM: false,
    allowPDA: true,
    allowTM: false,
    allowNonDet: true,
    stateLimit: 8,
    depthLimit: 120,
    maxStepLimit: 10000,
    testCases: [
      ...accept('', 'ab', 'ba', 'aabb', 'abab', 'bbaa', 'abba', 'aaabbb'),
      ...reject('a', 'b', 'aab', 'abb', 'aaabb'),
    ],
  },
  {
    id: 'zqc2om70w9ksh884pp0vrirt',
    title: 'Even-Length Palindromes',
    difficulty: 'HARD',
    statement: `# Even-Length Palindromes

Design a pushdown automaton that accepts a binary string exactly when it is a palindrome of even length — that is, when it can be split into two halves where the second half is the reverse of the first.

$L = \\{\\, w w^R \\mid w \\in \\{0,1\\}^* \\,\\}$

Taking $w = \\varepsilon$ shows that the empty string is accepted. Odd-length strings are always rejected, even when they read the same in both directions: \`111\` is not in $L$.

## Input

Strings over the alphabet $\\{0, 1\\}$.

## Examples

| Input | Verdict | Why |
| --- | --- | --- |
| \`0110\` | accepted | $w = \\texttt{01}$ |
| \`110011\` | accepted | $w = \\texttt{110}$ |
| \`0101\` | rejected | reverse of \`01\` is \`10\` |
| \`111\` | rejected | odd length |
| \`110110\` | rejected | reverse of \`110\` is \`011\` |

## Notes

No deterministic pushdown automaton recognises this language — a DPDA has no way to tell where the first half ends. Your machine has to **guess** the midpoint with an ε-transition, so non-deterministic solutions are allowed here.

Push each symbol of the first half onto the stack, then pop one symbol per input symbol of the second half, checking that they match. The guess that succeeds is the one that counts: the judge accepts the string as soon as any branch of the computation reaches a final state with the input consumed.`,
    allowFSM: false,
    allowPDA: true,
    allowTM: false,
    allowNonDet: true,
    stateLimit: 8,
    depthLimit: 120,
    maxStepLimit: 20000,
    testCases: [
      ...accept('', '00', '11', '0110', '1001', '010010', '100001', '110011'),
      ...reject('0', '01', '0101', '111', '110110'),
    ],
  },
  {
    id: 'wxdni9ywkp8p96qsv1xdajl4',
    title: 'The Language aⁿbⁿcⁿ',
    difficulty: 'HARD',
    statement: `# The Language aⁿbⁿcⁿ

Design a Turing machine that accepts a string exactly when it is some number of \`a\`s, followed by the same number of \`b\`s, followed by the same number of \`c\`s.

$L = \\{\\, a^n b^n c^n \\mid n \\geq 0 \\,\\}$

$n = 0$ is allowed, so the empty string is accepted. The order matters: \`abcabc\` has three of each letter but is not of the form $a^n b^n c^n$.

## Input

Strings over the alphabet $\\{a, b, c\\}$.

## Examples

| Input | Verdict | Why |
| --- | --- | --- |
| \`ε\` | accepted | $n = 0$ |
| \`abc\` | accepted | $n = 1$ |
| \`aaabbbccc\` | accepted | $n = 3$ |
| \`aabbc\` | rejected | only one \`c\` |
| \`abcabc\` | rejected | wrong order |

## Notes

This language is not context-free, which is why a pushdown automaton cannot do the job. The standard approach sweeps the tape over and over, rewriting one \`a\`, one \`b\` and one \`c\` per pass with marker symbols, and accepts once nothing unmarked is left. Declare the marker symbols in the tape alphabet; the blank \`_\` is always available and does not need declaring.

The machine accepts the instant it enters a final state, wherever the head happens to be, so leave your final state without outgoing transitions.`,
    allowFSM: false,
    allowPDA: false,
    allowTM: true,
    allowNonDet: true,
    stateLimit: 10,
    depthLimit: 500,
    maxStepLimit: 10000,
    testCases: [
      ...accept('', 'abc', 'aabbcc', 'aaabbbccc'),
      ...reject('ab', 'abcc', 'aabbc', 'acb', 'ba', 'abcabc', 'aabbbcc', 'ccc'),
    ],
  },
  {
    id: 'km7vvz3s1029rrnl2r7xkn63',
    title: 'Equal Counts of a, b and c',
    difficulty: 'HARD',
    statement: `# Equal Counts of a, b and c

Design a Turing machine that accepts a string over $\\{a, b, c\\}$ exactly when it contains the same number of \`a\`s, \`b\`s and \`c\`s. Unlike $a^n b^n c^n$, the letters may appear in any order.

$L = \\{\\, w \\in \\{a,b,c\\}^* \\mid \\#_a(w) = \\#_b(w) = \\#_c(w) \\,\\}$

The empty string has zero of each letter and is accepted.

## Input

Strings over the alphabet $\\{a, b, c\\}$.

## Examples

| Input | Verdict | Why |
| --- | --- | --- |
| \`ε\` | accepted | zero of each |
| \`bca\` | accepted | one of each |
| \`cbacba\` | accepted | two of each |
| \`aabbc\` | rejected | one \`c\` short |
| \`aaa\` | rejected | no \`b\`s or \`c\`s |

## Notes

This language is not context-free either, so a pushdown automaton will not get you there. One workable strategy is repeated crossing off: on each pass scan the whole tape for one unmarked \`a\`, one unmarked \`b\` and one unmarked \`c\` and mark all three; accept when a pass finds nothing left to mark, and reject when it finds some letters but not all three.

The head may move left past the start of the input — the tape is unbounded in both directions and unwritten cells read as the blank \`_\`.`,
    allowFSM: false,
    allowPDA: false,
    allowTM: true,
    allowNonDet: true,
    stateLimit: 15,
    depthLimit: 1500,
    maxStepLimit: 50000,
    testCases: [
      ...accept('', 'abc', 'acb', 'bca', 'aabbcc', 'abcabc', 'cbacba', 'ccbbaa'),
      ...reject('ab', 'aaa', 'aabbc', 'abcc', 'aabbbccc'),
    ],
  },
  {
    id: 'm9q43cxz6nvgsajmumzecs0x',
    title: 'The Copy Language ww',
    difficulty: 'EXPERT',
    statement: `# The Copy Language ww

Design a Turing machine that accepts a binary string exactly when it is some string written twice in a row.

$L = \\{\\, w w \\mid w \\in \\{0,1\\}^* \\,\\}$

Taking $w = \\varepsilon$ shows that the empty string is accepted.

Note how this differs from a palindrome: \`1001\` reads the same in both directions but is not of the form $ww$, while \`1010\` is $ww$ for $w = \\texttt{10}$ yet is not a palindrome.

## Input

Strings over the alphabet $\\{0, 1\\}$.

## Examples

| Input | Verdict | Why |
| --- | --- | --- |
| \`ε\` | accepted | $w = \\varepsilon$ |
| \`0101\` | accepted | $w = \\texttt{01}$ |
| \`110110\` | accepted | $w = \\texttt{110}$ |
| \`1001\` | rejected | a palindrome, but not $ww$ |
| \`101\` | rejected | odd length |

## Notes

This is the hardest problem in the set. The language is not context-free, and unlike $a^n b^n c^n$ the two halves are not separated by a marker you can look for — you have to find the midpoint yourself.

A common plan is to walk the two ends of the tape inwards marking as you go, which locates the centre, and then to compare the two halves symbol by symbol, marking each matched pair. Give yourself room: the tape alphabet will need a few marker symbols on top of \`0\` and \`1\`.`,
    allowFSM: false,
    allowPDA: false,
    allowTM: true,
    allowNonDet: true,
    stateLimit: 20,
    depthLimit: 2000,
    maxStepLimit: 100000,
    testCases: [
      ...accept('', '00', '11', '0101', '1010', '010010', '110110'),
      ...reject('0', '01', '0110', '101', '110011', '1001'),
    ],
  },
];

export default exampleProblems;
