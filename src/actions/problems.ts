"use server"

import { prisma } from "@/lib/db/prisma";
import { type ProblemSetItem } from "./types";
import { ProblemSchema } from "@/lib/schemas/problem-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
    revalidatePath(`/problems/view/${result.id}`);
    return true;
  } catch (error) {
    console.error("Error creating problem:", error);
    return false;
  }
}