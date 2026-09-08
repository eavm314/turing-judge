'use server';

import { after } from 'next/server';

import { serverQuery, type ServerActionResult } from '@/lib/actions/result';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { type SubmissionItem } from '@/lib/schemas';
import { automatonCodeSchema, type AutomatonCode } from '@/lib/schemas/automaton-code';
import { Status, Verdict } from '@prisma/client';
import { rateLimiter } from '@/utils/rate-limit';
import { runJudge } from '@/lib/judge/judge-runner';
import { buildTimeoutMessage } from '@/lib/judge/judge-submission';

export const getUserSubmissions = async (problemId: string) =>
  serverQuery(async (): Promise<SubmissionItem[]> => {
    const session = await auth();
    if (!session?.user?.id) return [];

    return prisma.submission.findMany({
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
  });

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
    return { success: false, message: 'User not authenticated', code: 'UNAUTHENTICATED' };
  }

  const canSubmit = submitLimiter(session.user.id);
  if (!canSubmit) {
    return {
      success: false,
      message: 'Please wait some seconds before submitting again.',
      code: 'RATE_LIMITED',
    };
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
      return { success: false, message: 'Project not found', code: 'NOT_FOUND' };
    }
    solutionCode = {
      type: project.type,
      automaton: project.automaton,
    };
  } else if (automatonCode !== null) {
    solutionCode = automatonCode;
  } else {
    return { success: false, message: 'No automaton provided', code: 'VALIDATION' };
  }

  const result = automatonCodeSchema.safeParse(solutionCode);
  if (!result.success) {
    await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        status: Status.FINISHED,
        verdict: Verdict.INVALID_FORMAT,
        message: 'The provided code is not a valid automaton.',
      },
    });
    return { success: false, message: 'Invalid automaton code', code: 'VALIDATION' };
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

const verifySolution = async (submissionId: number, problemId: string, solution: AutomatonCode) => {
  const { testCases, ...constraints } = (await prisma.problem.findUnique({
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

  const outcome = await runJudge({ solution, constraints, testCases });

  await prisma.submission.update({
    where: { id: submissionId },
    data: outcome.ok
      ? {
          status: Status.FINISHED,
          verdict: outcome.result.verdict,
          message: outcome.result.message,
        }
      : {
          status: Status.FINISHED,
          verdict: Verdict.TIME_LIMIT_EXCEEDED,
          message: buildTimeoutMessage(outcome.progress),
        },
  });
};
