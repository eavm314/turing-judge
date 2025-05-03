"use server";

import { notFound, redirect } from "next/navigation";

import { type AutomatonType, type Project } from "@prisma/client";
import { type JsonObject } from "@prisma/client/runtime/library";

import { type AutomatonProjectItem } from "@/lib/schemas";
import { auth } from "@/lib/auth";
import { type JsonFSM } from "@/lib/schemas/finite-state-machine";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "@/hooks/use-server-action";

export const getAutomatonById = async (id: string): Promise<Project> => {
  const session = await auth();
  const savedItem = await prisma.project.findUnique({ where: { id } });
  if (
    !savedItem ||
    (!savedItem.isPublic && savedItem.userId !== session?.user?.id)
  ) {
    notFound();
  }
  return savedItem;
};

export const getUserProjects = async (): Promise<AutomatonProjectItem[]> => {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

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
};

export const getUserProjectsLight = async (): Promise<
  Partial<AutomatonProjectItem>[]
> => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const results = await prisma.project.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      title: true,
      type: true,
    },
  });

  return results;
};

export const createProjectAction = async (body: {
  title: string | null;
  type: AutomatonType;
  isPublic: boolean;
  automaton: JsonFSM;
}): Promise<ServerActionResult<string>> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "User not authenticated" };
  }

  const savedAutomaton = await prisma.project.create({
    data: {
      userId: session.user.id,
      title: body.title,
      type: body.type,
      isPublic: body.isPublic,
      automaton: body.automaton as unknown as JsonObject,
    },
  });
  revalidatePath("/library");
  return {
    success: true,
    message: "Automaton saved successfully",
    data: savedAutomaton.id,
  };
};

export const updateProjectAction = async (
  projectId: string,
  body: {
    title?: string | null;
    type?: AutomatonType;
    isPublic?: boolean;
    automaton?: JsonFSM;
  },
): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");
  const oldAutomaton = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, userId: true },
  });
  if (!oldAutomaton) {
    notFound();
  }
  if (oldAutomaton.userId !== session.user.id) {
    return { success: false, message: "Permission denied" };
  }
  await prisma.project.update({
    where: { id: oldAutomaton.id },
    data: {
      title: body.title?.substring(0, 32),
      type: body.type,
      isPublic: body.isPublic,
      automaton: body.automaton as unknown as JsonObject,
    },
  });
  revalidatePath(`/playground/${projectId}`);
  return { success: true, message: "Automaton saved successfully" };
};

export const deleteAutomaton = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  try {
    await prisma.project.delete({ where: { id, userId: session.user.id } });
    revalidatePath("/library");
    return true;
  } catch (error) {
    console.error("Error deleting automaton:", error);
    return false;
  }
};
