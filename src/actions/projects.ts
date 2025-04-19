"use server"

import { notFound, redirect } from "next/navigation";

import { type AutomatonType, type Project } from "@prisma/client";
import { type JsonObject } from "@prisma/client/runtime/library";

import { type AutomatonProjectItem } from "@/dtos";
import { auth } from "@/lib/auth";
import { type JsonFSM } from "@/lib/automaton/FiniteStateMachine";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export const getAutomatonById = async (id: string): Promise<Project> => {
  const session = await auth();
  const savedItem = await prisma.project.findUnique({ where: { id } });
  if (!savedItem || (!savedItem.isPublic && savedItem.userId !== session?.user?.id)) {
    notFound()
  }
  return savedItem;
}

export const getUserProjects = async (): Promise<AutomatonProjectItem[]> => {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');

  const results = await prisma.project.findMany({
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
  title: string | null,
  type: AutomatonType,
  isPublic: boolean,
  automaton: JsonFSM,
}) => {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');

  let savedAutomaton = null;
  try {
    savedAutomaton = await prisma.project.create({
      data: {
        userId: session.user.id,
        title: body.title,
        type: body.type,
        isPublic: body.isPublic,
        automaton: body.automaton as unknown as JsonObject,
      },
    });
    revalidatePath('/library');
  } catch (error) {
    console.error("Error creating automaton:", error);
    return null;
  }
  redirect(`/editor/${savedAutomaton.id}`);
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
  const oldAutomaton = await prisma.project.findUnique({ 
    where: { id: body.id }, 
    select: { id: true, userId: true },
  });
  if (!oldAutomaton) {
    notFound();
  }
  if (oldAutomaton.userId !== session.user.id) {
    console.error("User does not have permission to update this automaton.");
    return false;
  }
  try {
    await prisma.project.update({
      where: { id: oldAutomaton.id },
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
    await prisma.project.delete({ where: { id, userId: session.user.id } });
    revalidatePath('/library');
    return true;
  } catch (error) {
    console.error("Error deleting automaton:", error);
    return false;
  }
}