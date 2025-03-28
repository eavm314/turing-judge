"use server"

import { notFound, redirect } from "next/navigation";

import { type AutomatonType, type UserAutomaton } from "@prisma/client";
import { type JsonObject } from "@prisma/client/runtime/library";

import { auth } from "@/lib/auth";
import { type JsonFSM } from "@/lib/automaton/FiniteStateMachine";
import { AutomatonLibraryItem } from "@/lib/automaton/types";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export const getAutomatonById = async (id: string): Promise<UserAutomaton> => {
  const session = await auth();
  const savedItem = await prisma.userAutomaton.findUnique({ where: { id } });
  if (!savedItem || (!savedItem.isPublic && savedItem.userId !== session?.user?.id)) {
    notFound()
  }
  return savedItem;
}

export const getSavedAutomata = async (): Promise<AutomatonLibraryItem[]> => {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');

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

export const createAutomaton = async (body: {
  title: string,
  type: AutomatonType,
  isPublic: boolean,
  automaton: JsonFSM,
}) => {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');

  try {
    const savedAutomaton = await prisma.userAutomaton.create({
      data: {
        userId: session.user.id,
        title: body.title,
        type: body.type,
        isPublic: body.isPublic,
        automaton: body.automaton as unknown as JsonObject,
      },
    });
    revalidatePath('/library');
    return savedAutomaton.id;
  } catch (error) {
    console.error("Error creating automaton:", error);
    return null;
  }
}

export const updateAutomaton = async (body: {
  id: string,
  title?: string | null,
  type?: AutomatonType,
  isPublic?: boolean,
  automaton?: JsonFSM,
}) => {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');
  const oldAutomaton = await prisma.userAutomaton.findUnique({ where: { id: body.id } });
  if (!oldAutomaton) {
    notFound();
  }
  if (oldAutomaton.userId !== session.user.id) {
    console.error("User does not have permission to update this automaton.");
    return false;
  }
  try {
    await prisma.userAutomaton.update({
      where: { id: body.id },
      data: {
        title: body.title,
        type: body.type,
        isPublic: body.isPublic,
        automaton: body.automaton as unknown as JsonObject,
      },
    });
    revalidatePath(`/editor/${body.id}`);
    return true;
  } catch(error) {
    console.error("Error updating automaton:", error);
    return false;
  }
}

export const deleteAutomaton = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');

  try {
    await prisma.userAutomaton.delete({ where: { id } });
    revalidatePath('/library');
    return true;
  } catch (error) {
    console.error("Error deleting automaton:", error);
    return false;
  }
}