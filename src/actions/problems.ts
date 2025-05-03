"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import {
  type ProblemEditorItem,
  type ProblemSetItem,
  type ProblemView,
} from "@/lib/schemas";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import {
  problemSchema,
  updateProblemSchema,
  type ProblemSchema,
  type UpdateProblemSchema,
} from "@/lib/schemas/problem-form";
import { type ServerActionResult } from "@/hooks/use-server-action";

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
};

export const getProblemView = async (id: string): Promise<ProblemView> => {
  const session = await auth();
  const problem = await prisma.problem.findUnique({ where: { id } });

  if (
    !problem ||
    (!problem.isPublic && problem.authorId !== session?.user?.id)
  ) {
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
      depthLimit: problem.depthLimit,
      maxStepLimit: problem.maxStepLimit,
    },
  };

  return problemView;
};

export const getUserProblems = async (): Promise<ProblemEditorItem[]> => {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const results = await prisma.problem.findMany({
    where: { authorId: session.user.id },
    select: {
      id: true,
      title: true,
      isPublic: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return results;
};

export const createProblemAction = async (
  body: ProblemSchema,
): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "User not authenticated" };
  }
  if (session.user.role !== "EDITOR") {
    return { success: false, message: "Permission denied" };
  }

  const parsedBody = problemSchema.safeParse(body);
  if (!parsedBody.success) {
    return { success: false, message: "Invalid problem data" };
  }

  const { testCases, ...fields } = parsedBody.data;
  const testCasesArray = testCases.split("\n").map((line) => {
    const [input, accept, expectedOutput] = line
      .split(",")
      .map((part) => part.trim());
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
  revalidatePath("/problems");
  revalidatePath(`/problems/${result.id}`);
  revalidatePath("/problems/editor");
  revalidatePath(`/problems/editor/${result.id}`);
  return { success: true, message: "Problem created successfully" };
};

export const updateProblemAction = async (
  body: UpdateProblemSchema,
): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "User not authenticated" };
  }
  if (session.user.role !== "EDITOR") {
    return { success: false, message: "Permission denied" };
  }

  const parsedBody = updateProblemSchema.safeParse(body);
  if (!parsedBody.success) {
    return { success: false, message: "Invalid problem data" };
  }

  const { problemId, testCases, ...fields } = parsedBody.data;

  const oldProblem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { id: true, authorId: true },
  });

  if (!oldProblem) {
    notFound();
  }
  if (oldProblem.authorId !== session.user.id) {
    return { success: false, message: "Permission denied" };
  }

  let testCasesQuery = undefined;
  if (testCases) {
    const testCasesArray = testCases.split("\n").map((line) => {
      const [input, accept, expectedOutput] = line
        .split(",")
        .map((part) => part.trim());
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
  revalidatePath("/problems");
  revalidatePath(`/problems/${problemId}`);
  revalidatePath("/problems/editor");
  revalidatePath(`/problems/editor/${problemId}`);
  return { success: true, message: "Problem updated successfully" };
};

export const getProblemEditable = async (
  id: string,
): Promise<ProblemSchema> => {
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
    notFound();
  }

  const testCases = problem.testCases
    .map((testCase) => {
      if (testCase.expectedOutput === null) {
        return `${testCase.input}, ${Number(testCase.expectedResult)}`;
      }
      return `${testCase.input}, ${Number(testCase.expectedResult)}, ${testCase.expectedOutput}`;
    })
    .join("\n");

  return { ...problem, testCases };
};

export const deleteProblemAction = async (
  id: string,
): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    await prisma.problem.delete({ where: { id, authorId: session.user.id } });
    revalidatePath("/problems");
    revalidatePath("/problems/editor");
    return { success: true, message: "Problem deleted successfully" };
  } catch (error) {
    return { success: false, message: "Problem not found" };
  }
};
