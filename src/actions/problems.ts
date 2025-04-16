"use server"

import { type ProblemView, type ProblemSetItem } from "@/dtos";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { ProblemSchema } from "@/lib/schemas/problem-form";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export const getProblemSet = async (): Promise<ProblemSetItem[]> => {
  const session = await auth();
  const results = await prisma.problem.findMany({
    where: { OR: [{ isPublic: true }, { authorId: session?.user?.id }] },
    select: {
      id: true,
      title: true,
      difficulty: true,
      createdAt: true,
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

export const createProblem = async (data: ProblemSchema) => {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');
  if (session.user.role !== 'EDITOR') {
    console.error("User does not have permission to create problems.");
    return false;
  }

  const { testCases, ...fields } = data;
  const testCasesArray = testCases.split("\n").map(line => {
    const [input, expectedOutput, isValid] = line.split(",").map(part => part.trim());
    return { input, expectedOutput, expectedResult: Boolean(Number(isValid)) };
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
  } catch (error) {
    console.error("Error creating problem:", error);
    return false;
  }
  redirect('/problems');
}