'use server';

import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { type Project } from '@prisma/client';
import { type JsonObject } from '@prisma/client/runtime/library';

import { PROJECTS_LIMIT } from '@/constants/app';
import { ServerActionResult } from '@/hooks/use-server-action';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { type AutomatonProjectItem } from '@/lib/schemas';
import { type AutomatonCode } from '@/lib/schemas/automaton-code';

export const getAutomatonById = async (id: string): Promise<Project> => {
  const session = await auth();
  const savedItem = await prisma.project.findUnique({ where: { id } });
  if (!savedItem || (!savedItem.isPublic && savedItem.userId !== session?.user?.id)) {
    notFound();
  }
  return savedItem;
};

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
};

export const getUserProjectsLight = async (): Promise<Partial<AutomatonProjectItem>[]> => {
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
  isPublic: boolean;
  automatonCode: AutomatonCode;
}): Promise<ServerActionResult<string>> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated' };
  }

  const limit = PROJECTS_LIMIT[session.user.role];
  const count = await prisma.project.count({
    where: { userId: session.user.id },
  });

  if (count >= limit) {
    return {
      success: false,
      message: `You have reached the limit of ${limit} projects.`,
    };
  }

  const savedAutomaton = await prisma.project.create({
    data: {
      userId: session.user.id,
      title: body.title,
      type: body.automatonCode.type,
      isPublic: body.isPublic,
      automaton: body.automatonCode.automaton as unknown as JsonObject,
    },
  });
  revalidatePath('/library');
  return {
    success: true,
    message: 'Automaton saved successfully',
    data: savedAutomaton.id,
  };
};

export const updateProjectAction = async (
  projectId: string,
  body: {
    title?: string | null;
    isPublic?: boolean;
    automatonCode?: AutomatonCode;
  },
): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');
  const oldAutomaton = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, userId: true },
  });
  if (!oldAutomaton) {
    notFound();
  }
  if (oldAutomaton.userId !== session.user.id) {
    return { success: false, message: 'Permission denied' };
  }
  await prisma.project.update({
    where: { id: oldAutomaton.id },
    data: {
      title: body.title?.substring(0, 32),
      type: body.automatonCode?.type,
      isPublic: body.isPublic,
      automaton: body.automatonCode?.automaton as unknown as JsonObject,
    },
  });
  revalidatePath(`/playground/${projectId}`);
  return { success: true, message: 'Automaton saved successfully' };
};

export const deleteAutomatonAction = async (id: string): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated' };
  }

  try {
    await prisma.project.delete({ where: { id, userId: session.user.id } });
    revalidatePath('/library');
    return { success: true, message: 'Automaton deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Automaton not found' };
  }
};
