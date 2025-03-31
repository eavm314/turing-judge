"use server"

import { prisma } from "@/lib/db/prisma";
import { type ProblemSetItem } from "./types";

export const getProblemSet = async (): Promise<ProblemSetItem[]> => {
  const results = await prisma.problem.findMany({
    where: { isPublic: true },
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