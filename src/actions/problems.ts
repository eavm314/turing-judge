"use server"

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";


import { type ProblemEditorItem, type ProblemSetItem, type ProblemView } from "@/dtos";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { ProblemSchema } from "@/lib/schemas/problem-form";

export const getProblemSet = async (): Promise<ProblemSetItem[]> => {
  const session = await auth();
  const results = await prisma.problem.findMany({
    where: { OR: [{ isPublic: true }, { authorId: session?.user?.id }] },
    select: {
      id: true,
      title: true,
      difficulty: true,
      updatedAt: true,
    },
  });

  return results;
}

export const getProblemView = async (id: string): Promise<ProblemView> => {
  const session = await auth();
  const problem = await prisma.problem.findUnique({ where: { id } });

  if (!problem || (!problem.isPublic && problem.authorId !== (session?.user?.id))) {
    notFound();
  }

  const problemView: ProblemView = {
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
      stepLimit: problem.stepLimit,
      timeLimit: problem.timeLimit,
    },
  }

  return problemView;
}

export const getUserProblems = async (): Promise<ProblemEditorItem[]> => {
  const session = await auth();
  const results = await prisma.problem.findMany({
    where: { OR: [{ isPublic: true }, { authorId: session?.user?.id }] },
    select: {
      id: true,
      title: true,
      isPublic: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return results;
}

export const createProblem = async (body: ProblemSchema) => {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');
  if (session.user.role !== 'EDITOR') {
    console.error("User does not have permission to create problems.");
    return false;
  }

  const { testCases, ...fields } = body;
  const testCasesArray = testCases.split("\n").map(line => {
    const [input, accept, expectedOutput] = line.split(",").map(part => part.trim());
    return { input, expectedOutput, expectedResult: Boolean(Number(accept)) };
  });
  try {
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
  } catch (error) {
    console.error("Error creating problem:", error);
    return false;
  }
  redirect('/problems/editor');
}

export const updateProblem = async (problemId: string, body: Partial<ProblemSchema>) => {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');
  if (session.user.role !== 'EDITOR') {
    console.error("User does not have permission to update problems.");
    return false;
  }

  const oldProblem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { id: true, authorId: true },
  });

  if (!oldProblem) {
    notFound();
  }
  if (oldProblem.authorId !== session.user.id) {
    console.error("User does not have permission to update this problem.");
    return false;
  }

  try {
    const { testCases, ...fields } = body;
    let testCasesQuery = undefined;
    if (testCases) {
      const testCasesArray = testCases.split("\n").map(line => {
        const [input, accept, expectedOutput] = line.split(",").map(part => part.trim());
        return { input, expectedOutput, expectedResult: Boolean(Number(accept)) };
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
  } catch (error) {
    console.error("Error updating problem:", error);
    return false;
  }
  redirect('/problems/editor');
}

export const getProblemEditable = async (id: string): Promise<ProblemSchema> => {
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
      stepLimit: true,
      timeLimit: true,
      testCases: {
        select: {
          input: true,
          expectedOutput: true,
          expectedResult: true,
        },
      },
    }
  });

  if (!problem || problem.authorId !== (session?.user?.id)) {
    notFound();
  }

  const testCases = problem.testCases.map((testCase) => {
    if (testCase.expectedOutput === null) {
      return `${testCase.input}, ${Number(testCase.expectedResult)}`;
    }
    return `${testCase.input}, ${Number(testCase.expectedResult)}, ${testCase.expectedOutput}`;
  }).join("\n");

  return { ...problem, testCases };
}