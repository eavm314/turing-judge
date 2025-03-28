"use server"

import { redirect } from "next/navigation";

import { type AutomatonType } from "@prisma/client";
import { type JsonObject } from "@prisma/client/runtime/library";

import { auth } from "@/lib/auth";
import { type JsonFSM } from "@/lib/automaton/FiniteStateMachine";
import { AutomatonLibraryItem } from "@/lib/automaton/types";
import { prisma } from "@/lib/db/prisma";

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

export const saveAutomaton = async (
  title: string,
  type: AutomatonType,
  isPublic: boolean,
  automaton: JsonFSM
) => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const savedAutomaton = await prisma.userAutomaton.create({
    data: {
      userId: session.user.id,
      title,
      type,
      isPublic,
      automaton: automaton as unknown as JsonObject,
    },
  });

  return savedAutomaton.id;
}