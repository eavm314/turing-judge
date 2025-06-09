'use server';

import { after } from 'next/server';

import { type ServerActionResult } from '@/hooks/use-server-action';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { automatonCodeSchema, type AutomatonCode } from '@/lib/schemas/automaton-code';
import { Status, Verdict } from '@prisma/client';
import { rateLimiter } from '@/utils/rate-limit';
import { AutomatonManager } from '@/lib/automata/AutomatonManager';

export const getUserSubmissions = async (problemId: string) => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const results = await prisma.submission.findMany({
    where: { problemId, userId: session.user.id },
    select: {
      status: true,
      verdict: true,
      message: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return results;
};

const submitLimiter = rateLimiter({
  interval: 30 * 1000,
  limit: 2,
});

export const submitSolutionAction = async (
  problemId: string,
  projectId: string | null,
  automatonCode: AutomatonCode | null,
): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated' };
  }

  const canSubmit = submitLimiter(session.user.id);
  if (!canSubmit) {
    return { success: false, message: 'Please wait some seconds before submitting again.' };
  }

  let solutionCode;
  if (projectId !== null) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: session.user.id,
      },
      select: {
        automaton: true,
        type: true,
      },
    });
    if (!project) {
      return { success: false, message: 'Project not found' };
    }
    solutionCode = {
      type: project.type,
      automaton: project.automaton,
    };
  } else if (automatonCode !== null) {
    solutionCode = automatonCode;
  } else {
    return { success: false, message: 'No automaton provided' };
  }

  const result = automatonCodeSchema.safeParse(solutionCode);
  if (!result.success) {
    await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        status: 'FINISHED',
        verdict: 'INVALID_FORMAT',
        message: 'The provided code is not a valid automaton.',
      },
    });
    return { success: false, message: 'Invalid automaton code' };
  }
  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      problemId,
      status: Status.PENDING,
    },
  });

  after(async () => {
    try {
      await verifySolution(submission.id, problemId, result.data);
    } catch (error) {
      console.error('Error verifying solution:', error);
      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: Status.FINISHED,
          verdict: Verdict.UNKNOWN_ERROR,
          message: 'An error occurred while verifying the solution. Contact support.',
        },
      });
    }
  });

  return { success: true, message: 'Solution submitted successfully' };
};

type FailedCaseData = {
  input: string;
  result: boolean;
  expectedResult: boolean;
  output?: string;
  expectedOutput?: string;
  depthLimitReached: boolean;
  maxLimitReached: boolean;
};

const verifySolution = async (id: number, problemId: string, solution: AutomatonCode) => {
  const problemTestData = (await prisma.problem.findUnique({
    where: { id: problemId },
    select: {
      allowFSM: true,
      allowPDA: true,
      allowTM: true,
      allowNonDet: true,
      stateLimit: true,
      depthLimit: true,
      maxStepLimit: true,
      testCases: {
        select: {
          input: true,
          expectedResult: true,
          expectedOutput: true,
        },
      },
    },
  }))!;

  if (solution.type === 'FSM' && !problemTestData.allowFSM) {
    await setInvalidFormat(id, 'This problem does not accept FSM solutions.');
    return;
  }
  if (solution.type === 'PDA' && !problemTestData.allowPDA) {
    await setInvalidFormat(id, 'This problem does not accept PDA solutions.');
    return;
  }
  if (solution.type === 'TM' && !problemTestData.allowTM) {
    await setInvalidFormat(id, 'This problem does not accept TM solutions.');
    return;
  }

  const manager = new AutomatonManager(solution);
  const executor = manager.getExecutor();

  if (!executor.isDeterministic() && !problemTestData.allowNonDet) {
    await setInvalidFormat(id, 'This problem does not accept non-deterministic solutions.');
    return;
  }
  if (executor.countStates() > problemTestData.stateLimit) {
    await setInvalidFormat(id, 'The automaton has too many states.');
    return;
  }
  executor.setConfig({
    depthLimit: problemTestData.depthLimit,
    maxSteps: problemTestData.maxStepLimit,
  });

  const totalCases = problemTestData.testCases.length;
  let passedCases = 0;

  let finalVerdict: Verdict = Verdict.ACCEPTED;
  let failedCaseData: FailedCaseData | null = null;
  for (const testCase of problemTestData.testCases) {
    const result = executor.execute(testCase.input);
    if (result.maxLimitReached) {
      finalVerdict = Verdict.STEP_LIMIT_EXCEEDED;
    }
    if (result.accepted !== testCase.expectedResult) {
      finalVerdict = Verdict.WRONG_RESULT;
    }
    if (finalVerdict !== Verdict.ACCEPTED) {
      failedCaseData = {
        input: testCase.input,
        result: result.accepted,
        expectedResult: testCase.expectedResult,
        depthLimitReached: result.depthLimitReached,
        maxLimitReached: result.maxLimitReached,
      };
      break;
    }
    passedCases++;
  }
  await prisma.submission.update({
    where: { id: id },
    data: {
      status: Status.FINISHED,
      verdict: finalVerdict,
      message: buildMessage(totalCases, passedCases, failedCaseData),
    },
  });
};

const buildMessage = (
  totalCases: number,
  passedCases: number,
  failedCaseData: FailedCaseData | null,
) => {
  let message = `(${passedCases}/${totalCases})`;
  if (failedCaseData) {
    message += ` Failed test case: '${failedCaseData.input}'.`;
    if (!failedCaseData.result && failedCaseData.depthLimitReached) {
      message += ' Depth limit reached.';
    }
    if (failedCaseData.maxLimitReached) {
      message += ' Max step limit reached.';
    }
  }
  return message;
};

const setInvalidFormat = async (submissionId: number, message: string) => {
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: Status.FINISHED,
      verdict: Verdict.INVALID_FORMAT,
      message,
    },
  });
};
