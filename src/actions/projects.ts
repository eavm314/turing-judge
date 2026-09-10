'use server';

import { revalidatePath } from 'next/cache';

import { type Project } from '@prisma/client';

import { PROJECTS_LIMIT } from '@/constants/app';
import { ActionError, serverQuery, type ServerActionResult } from '@/lib/actions/result';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { type AutomatonProjectItem, type AutomatonProjectOption } from '@/lib/schemas';
import { type AutomatonCode } from '@/lib/schemas/automaton-code';

export const getAutomatonById = async (id: string) =>
  serverQuery(async (): Promise<Project> => {
    const session = await auth();
    const savedItem = await prisma.project.findUnique({ where: { id } });
    if (!savedItem || (!savedItem.isPublic && savedItem.userId !== session?.user?.id)) {
      throw new ActionError('NOT_FOUND', 'Automaton not found');
    }
    return savedItem;
  });

export const getUserProjects = async () =>
  serverQuery(async (): Promise<AutomatonProjectItem[]> => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ActionError('UNAUTHENTICATED', 'User not authenticated');
    }

    return prisma.project.findMany({
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
  });

export const getUserProjectsLight = async () =>
  serverQuery(async (): Promise<AutomatonProjectOption[]> => {
    const session = await auth();
    if (!session?.user?.id) return [];

    return prisma.project.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        type: true,
      },
    });
  });

export const createProjectAction = async (body: {
  title: string | null;
  isPublic: boolean;
  automatonCode: AutomatonCode;
}): Promise<ServerActionResult<string>> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated', code: 'UNAUTHENTICATED' };
  }

  const limit = PROJECTS_LIMIT[session.user.role];
  const count = await prisma.project.count({
    where: { userId: session.user.id },
  });

  if (count >= limit) {
    return {
      success: false,
      message: `You have reached the limit of ${limit} projects.`,
      code: 'FORBIDDEN',
    };
  }

  const savedAutomaton = await prisma.project.create({
    data: {
      userId: session.user.id,
      title: body.title,
      type: body.automatonCode.type,
      isPublic: body.isPublic,
      automaton: body.automatonCode.automaton ?? {},
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
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated', code: 'UNAUTHENTICATED' };
  }
  const oldAutomaton = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, userId: true },
  });
  if (!oldAutomaton) {
    return { success: false, message: 'Automaton not found', code: 'NOT_FOUND' };
  }
  if (oldAutomaton.userId !== session.user.id) {
    return { success: false, message: 'Permission denied', code: 'FORBIDDEN' };
  }
  await prisma.project.update({
    where: { id: oldAutomaton.id },
    data: {
      title: body.title?.substring(0, 32),
      type: body.automatonCode?.type,
      isPublic: body.isPublic,
      automaton: body.automatonCode?.automaton ?? {},
    },
  });
  revalidatePath(`/playground/${projectId}`);
  return { success: true, message: 'Automaton saved successfully' };
};

export const deleteAutomatonAction = async (id: string): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated', code: 'UNAUTHENTICATED' };
  }

  try {
    await prisma.project.delete({ where: { id, userId: session.user.id } });
    revalidatePath('/library');
    return { success: true, message: 'Automaton deleted successfully' };
  } catch {
    return { success: false, message: 'Automaton not found', code: 'NOT_FOUND' };
  }
};
