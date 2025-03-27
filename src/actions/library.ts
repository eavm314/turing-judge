"use server"

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { AutomatonLibraryItem } from "@/lib/automaton/types";

export const getSavedAutomata = async (): Promise<AutomatonLibraryItem[]> => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin');
  }
  const results = await prisma.userAutomaton.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      title: true,
      type: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return results;
}

export const saveAutomaton = async (automaton: any) => {
  const session = await auth();
  if (!session?.user) {
    redirect('/signin');
  }
}