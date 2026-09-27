import { describe, expect, it } from 'vitest';

import exampleProjects from '@/constants/example-projects';
import { judgeSubmission } from '@/lib/judge/judge-submission';
import type { ProblemConstraints } from '@/lib/schemas';
import { automatonCodeSchema } from '@/lib/schemas/automaton-code';
import exampleProblems, { type ExampleProblem } from '../../../prisma/seeders/example-problems';

/** Problem id -> the id of the seeded example project that solves it. */
const solvedByExample: Record<string, string> = {
  ihorezv2kza1rucq8tcdb94z: 'pilw80yiq2vnjy2w1gm8hi5q', // Even Ones
  na072yueizaxjlhp8dhc0zwu: 'y9h6i1odejrjr54mxe79a5n9', // NFA Containing 101
  j6dbw4ehsh45tsiv54sd9zyd: 'a9h6i1odejrjr54mxe79a5n9', // PDA for Balanced Parentheses
  wxdni9ywkp8p96qsv1xdajl4: 'b9h6i1odejrjr54mxe79a5n9', // Turing Machine for a^n b^n c^n
};

const countOf = (word: string, symbol: string) => [...word].filter(char => char === symbol).length;

const reversed = (word: string) => [...word].reverse().join('');

const isBalanced = (word: string) => {
  let open = 0;
  for (const char of word) {
    open += char === '(' ? 1 : -1;
    if (open < 0) return false;
  }
  return open === 0;
};

const isAnBnCn = (word: string) => {
  const groups = /^(a*)(b*)(c*)$/.exec(word);
  if (!groups) return false;
  const [, as, bs, cs] = groups;
  return as.length === bs.length && bs.length === cs.length;
};

const firstHalf = (word: string) => word.slice(0, word.length / 2);
const secondHalf = (word: string) => word.slice(word.length / 2);

/**
 * An independent decision procedure per problem id, so a mislabelled test case in the seed data
 * fails here instead of handing a solver an unsolvable problem.
 */
const belongsToLanguage: Record<string, (word: string) => boolean> = {
  ihorezv2kza1rucq8tcdb94z: word => countOf(word, '1') % 2 === 0,
  xaz57ormmwfmyb5whlxta6uf: word => word.length > 0 && parseInt(word, 2) % 3 === 0,
  na072yueizaxjlhp8dhc0zwu: word => word.includes('101'),
  g428c38c6xtvz1tgjzmisxvs: word => word.length >= 3 && word[word.length - 3] === '1',
  j6dbw4ehsh45tsiv54sd9zyd: isBalanced,
  pd7tzkib1hjot7yn0s4begt8: word => countOf(word, 'a') === countOf(word, 'b'),
  zqc2om70w9ksh884pp0vrirt: word => word.length % 2 === 0 && word === reversed(word),
  wxdni9ywkp8p96qsv1xdajl4: isAnBnCn,
  km7vvz3s1029rrnl2r7xkn63: word =>
    countOf(word, 'a') === countOf(word, 'b') && countOf(word, 'b') === countOf(word, 'c'),
  m9q43cxz6nvgsajmumzecs0x: word => word.length % 2 === 0 && firstHalf(word) === secondHalf(word),
};

const constraintsOf = ({
  allowFSM,
  allowPDA,
  allowTM,
  allowNonDet,
  stateLimit,
  depthLimit,
  maxStepLimit,
}: ExampleProblem): ProblemConstraints => ({
  allowFSM,
  allowPDA,
  allowTM,
  allowNonDet,
  stateLimit,
  depthLimit,
  maxStepLimit,
});

/**
 * Mirrors the bounds in problemSchema. They are duplicated rather than imported because
 * problem-form.ts needs ProblemDifficulty as a value for z.nativeEnum, and prisma/generated is
 * absent in CI, which installs with --ignore-scripts.
 */
const formLimits = {
  title: { min: 3 },
  statement: { min: 20 },
  stateLimit: { min: 1, max: 100 },
  depthLimit: { min: 1, max: 1_000_000 },
  maxStepLimit: { min: 1, max: 1_000_000 },
};

describe('example problems', () => {
  it('covers the four categories in the required proportions', () => {
    const counts = {
      deterministicFsm: exampleProblems.filter(p => p.allowFSM && !p.allowNonDet).length,
      nonDeterministicFsm: exampleProblems.filter(p => p.allowFSM && p.allowNonDet).length,
      pda: exampleProblems.filter(p => p.allowPDA).length,
      tm: exampleProblems.filter(p => p.allowTM).length,
    };

    expect(counts).toEqual({
      deterministicFsm: 2,
      nonDeterministicFsm: 2,
      pda: 3,
      tm: 3,
    });
    expect(exampleProblems).toHaveLength(10);
  });

  it('uses unique ids and titles', () => {
    expect(new Set(exampleProblems.map(p => p.id)).size).toBe(exampleProblems.length);
    expect(new Set(exampleProblems.map(p => p.title)).size).toBe(exampleProblems.length);
  });

  it('has exactly one problem per category solved by a seeded example automaton', () => {
    const solved = exampleProblems.filter(problem => problem.id in solvedByExample);

    expect(solved).toHaveLength(4);
    expect(solved.filter(p => p.allowFSM && !p.allowNonDet)).toHaveLength(1);
    expect(solved.filter(p => p.allowFSM && p.allowNonDet)).toHaveLength(1);
    expect(solved.filter(p => p.allowPDA)).toHaveLength(1);
    expect(solved.filter(p => p.allowTM)).toHaveLength(1);
  });

  it('has a reference decision procedure for every problem', () => {
    expect(Object.keys(belongsToLanguage).sort()).toEqual(exampleProblems.map(p => p.id).sort());
  });

  describe.each(exampleProblems.map(problem => [problem.title, problem] as const))(
    '%s',
    (_title, problem) => {
      it('opens with the problem title as a level-one heading', () => {
        expect(problem.statement.split('\n')[0]).toBe(`# ${problem.title}`);
      });

      it('stays inside the bounds the authoring form enforces', () => {
        expect(problem.title.length).toBeGreaterThanOrEqual(formLimits.title.min);
        expect(problem.statement.length).toBeGreaterThanOrEqual(formLimits.statement.min);

        for (const field of ['stateLimit', 'depthLimit', 'maxStepLimit'] as const) {
          expect(Number.isInteger(problem[field])).toBe(true);
          expect(problem[field]).toBeGreaterThanOrEqual(formLimits[field].min);
          expect(problem[field]).toBeLessThanOrEqual(formLimits[field].max);
        }
      });

      it('has test case inputs the authoring textarea can round-trip', () => {
        for (const { input } of problem.testCases) {
          expect(input).not.toContain(',');
          expect(input).not.toContain('\n');
          expect(input.trim()).toBe(input);
        }
      });

      it('accepts exactly one machine type', () => {
        const allowed = [problem.allowFSM, problem.allowPDA, problem.allowTM].filter(Boolean);

        expect(allowed).toHaveLength(1);
      });

      it('has at least five distinct test cases covering both verdicts', () => {
        const inputs = problem.testCases.map(testCase => testCase.input);

        expect(problem.testCases.length).toBeGreaterThanOrEqual(5);
        expect(new Set(inputs).size).toBe(inputs.length);
        expect(problem.testCases.some(testCase => testCase.expectedResult)).toBe(true);
        expect(problem.testCases.some(testCase => !testCase.expectedResult)).toBe(true);
      });

      it('labels every test case according to its language', () => {
        const belongs = belongsToLanguage[problem.id];

        for (const { input, expectedResult } of problem.testCases) {
          expect(belongs(input), `input ${JSON.stringify(input)}`).toBe(expectedResult);
        }
      });
    },
  );

  describe.each(Object.entries(solvedByExample))(
    'problem %s solved by example project %s',
    (problemId, projectId) => {
      it('is judged ACCEPTED', () => {
        const problem = exampleProblems.find(candidate => candidate.id === problemId)!;
        const project = exampleProjects.find(candidate => candidate.id === projectId)!;

        const solution = automatonCodeSchema.parse({
          type: project.type,
          automaton: project.automaton,
        });

        const result = judgeSubmission({
          solution,
          constraints: constraintsOf(problem),
          testCases: problem.testCases,
        });

        expect(result.message).toBe(`(${problem.testCases.length}/${problem.testCases.length})`);
        expect(result.verdict).toBe('ACCEPTED');
        expect(result.passedCases).toBe(problem.testCases.length);
      });
    },
  );
});
