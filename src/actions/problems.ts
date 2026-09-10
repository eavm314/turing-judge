'use server';

import { revalidatePath } from 'next/cache';

import { ActionError, serverQuery, type ServerActionResult } from '@/lib/actions/result';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { type ProblemEditorItem, type ProblemSetItem, type ProblemView } from '@/lib/schemas';
import {
  problemSchema,
  updateProblemSchema,
  type ProblemSchema,
  type UpdateProblemSchema,
} from '@/lib/schemas/problem-form';
import { ProblemSetOptions } from '@/lib/schemas/problem-set';

export const getProblemsCount = async (
  search: string,
  difficulty: ProblemSetOptions['difficulty'],
) =>
  serverQuery(async (): Promise<number> => {
    return prisma.problem.count({
      where: {
        isPublic: true,
        difficulty,
        title: {
          contains: search,
        },
      },
    });
  });

export const getProblemSet = async ({
  take,
  page,
  sortKey,
  direction,
  search,
  difficulty,
}: ProblemSetOptions) =>
  serverQuery(async (): Promise<ProblemSetItem[]> => {
    return prisma.problem.findMany({
      where: {
        isPublic: true,
        difficulty,
        title: {
          contains: search,
        },
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        updatedAt: true,
      },
      take,
      skip: (page - 1) * take,
      orderBy: { [sortKey]: direction },
    });
  });

export const getProblemView = async (id: string) =>
  serverQuery(async (): Promise<ProblemView> => {
    const session = await auth();
    const problem = await prisma.problem.findUnique({ where: { id } });

    if (!problem || (!problem.isPublic && problem.authorId !== session?.user?.id)) {
      throw new ActionError('NOT_FOUND', 'Problem not found');
    }

    return {
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      statement: problem.statement,
      constraints: {
        allowFSM: problem.allowFSM,
        allowPDA: problem.allowPDA,
        allowTM: problem.allowTM,
        allowNonDet: problem.allowNonDet,
        stateLimit: problem.stateLimit,
        depthLimit: problem.depthLimit,
        maxStepLimit: problem.maxStepLimit,
      },
    };
  });

export const getUserProblems = async () =>
  serverQuery(async (): Promise<ProblemEditorItem[]> => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ActionError('UNAUTHENTICATED', 'User not authenticated');
    }

    return prisma.problem.findMany({
      where: { authorId: session.user.id },
      select: {
        id: true,
        title: true,
        isPublic: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  });

export const createProblemAction = async (body: ProblemSchema): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated', code: 'UNAUTHENTICATED' };
  }
  if (session.user.role === 'USER') {
    return { success: false, message: 'Permission denied', code: 'FORBIDDEN' };
  }

  const parsedBody = problemSchema.safeParse(body);
  if (!parsedBody.success) {
    return { success: false, message: 'Invalid problem data', code: 'VALIDATION' };
  }

  const { testCases, ...fields } = parsedBody.data;
  const testCasesArray = testCases.split('\n').map(line => {
    const [input, accept, expectedOutput] = line.split(',').map(part => part.trim());
    return { input, expectedOutput, expectedResult: Boolean(Number(accept)) };
  });

  const result = await prisma.problem.create({
    data: {
      ...fields,
      isPublic: false,
      authorId: session.user.id,
      testCases: {
        createMany: {
          data: testCasesArray,
        },
      },
    },
  });
  revalidatePath('/problems');
  revalidatePath(`/problems/${result.id}`);
  revalidatePath('/problems/editor');
  revalidatePath(`/problems/editor/${result.id}`);
  return { success: true, message: 'Problem created successfully' };
};

export const updateProblemAction = async (
  body: UpdateProblemSchema,
): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated', code: 'UNAUTHENTICATED' };
  }
  if (session.user.role === 'USER') {
    return { success: false, message: 'Permission denied', code: 'FORBIDDEN' };
  }

  const parsedBody = updateProblemSchema.safeParse(body);
  if (!parsedBody.success) {
    return { success: false, message: 'Invalid problem data', code: 'VALIDATION' };
  }

  const { problemId, testCases, ...fields } = parsedBody.data;

  const oldProblem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { id: true, authorId: true },
  });

  if (!oldProblem) {
    return { success: false, message: 'Problem not found', code: 'NOT_FOUND' };
  }
  if (oldProblem.authorId !== session.user.id) {
    return { success: false, message: 'Permission denied', code: 'FORBIDDEN' };
  }

  let testCasesQuery = undefined;
  if (testCases) {
    const testCasesArray = testCases.split('\n').map(line => {
      const [input, accept, expectedOutput] = line.split(',').map(part => part.trim());
      return {
        input,
        expectedOutput,
        expectedResult: Boolean(Number(accept)),
      };
    });
    testCasesQuery = {
      deleteMany: {},
      createMany: {
        data: testCasesArray,
      },
    };
  }

  await prisma.problem.update({
    where: { id: oldProblem.id },
    data: {
      ...fields,
      testCases: testCasesQuery,
    },
  });
  revalidatePath('/problems');
  revalidatePath(`/problems/${problemId}`);
  revalidatePath('/problems/editor');
  revalidatePath(`/problems/editor/${problemId}`);
  return { success: true, message: 'Problem updated successfully' };
};

export const getProblemEditable = async (id: string) =>
  serverQuery(async (): Promise<ProblemSchema> => {
    const session = await auth();
    const problem = await prisma.problem.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
        title: true,
        isPublic: true,
        difficulty: true,
        statement: true,
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
            expectedOutput: true,
            expectedResult: true,
          },
        },
      },
    });

    if (!problem || problem.authorId !== session?.user?.id) {
      throw new ActionError('NOT_FOUND', 'Problem not found');
    }

    const testCases = problem.testCases
      .map(testCase => {
        if (testCase.expectedOutput === null) {
          return `${testCase.input}, ${Number(testCase.expectedResult)}`;
        }
        return `${testCase.input}, ${Number(testCase.expectedResult)}, ${testCase.expectedOutput}`;
      })
      .join('\n');

    return { ...problem, testCases };
  });

export const deleteProblemAction = async (id: string): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated', code: 'UNAUTHENTICATED' };
  }

  try {
    await prisma.problem.delete({ where: { id, authorId: session.user.id } });
    revalidatePath('/problems');
    revalidatePath('/problems/editor');
    return { success: true, message: 'Problem deleted successfully' };
  } catch {
    return { success: false, message: 'Problem not found', code: 'NOT_FOUND' };
  }
};
