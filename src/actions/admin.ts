'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

import { ActionError, serverQuery, type ServerActionResult } from '@/lib/actions/result';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { type AdminUserItem, type AdminUserResources } from '@/lib/schemas';
import {
  createUserSchema,
  resetPasswordSchema,
  updateRoleSchema,
  type AdminUsersOptions,
  type CreateUserSchema,
  type ResetPasswordSchema,
  type UpdateRoleSchema,
} from '@/lib/schemas/admin-users';
import { rateLimiter } from '@/utils/rate-limit';
import { type Prisma, type Role } from '@prisma/client';

const getAdminSession = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || user.role !== 'ADMIN') return null;
  return { userId: user.id };
};

const buildUserWhere = (search: string, role?: Role): Prisma.UserWhereInput => ({
  role,
  OR: [
    { name: { contains: search, mode: 'insensitive' } },
    { email: { contains: search, mode: 'insensitive' } },
  ],
});

export const getUsersCount = async (search: string, role: AdminUsersOptions['role']) =>
  serverQuery(async (): Promise<number> => {
    const session = await getAdminSession();
    if (!session) {
      throw new ActionError('FORBIDDEN', 'Permission denied');
    }

    return prisma.user.count({ where: buildUserWhere(search, role) });
  });

export const getUsers = async ({
  take,
  page,
  sortKey,
  direction,
  search,
  role,
}: AdminUsersOptions) =>
  serverQuery(async (): Promise<AdminUserItem[]> => {
    const session = await getAdminSession();
    if (!session) {
      throw new ActionError('FORBIDDEN', 'Permission denied');
    }

    const users = await prisma.user.findMany({
      where: buildUserWhere(search, role),
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        password: true,
        _count: {
          select: { userAutomatons: true, problems: true, submissions: true },
        },
      },
      take,
      skip: (page - 1) * take,
      orderBy: { [sortKey]: direction },
    });

    return users.map(({ password, _count, ...user }) => ({
      ...user,
      hasPassword: password !== null,
      counts: {
        projects: _count.userAutomatons,
        problems: _count.problems,
        submissions: _count.submissions,
      },
    }));
  });

export const createUserAction = async (values: CreateUserSchema): Promise<ServerActionResult> => {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, message: 'Permission denied', code: 'FORBIDDEN' };
  }

  const result = createUserSchema.safeParse(values);
  if (!result.success) {
    return { success: false, message: 'Invalid user data', code: 'VALIDATION' };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: result.data.email },
    select: { id: true },
  });
  if (existingUser) {
    return { success: false, message: 'A user with this email already exists', code: 'VALIDATION' };
  }

  const password = await bcrypt.hash(result.data.password, 10);
  await prisma.user.create({
    data: {
      name: result.data.name,
      email: result.data.email,
      role: result.data.role,
      password,
    },
  });

  revalidatePath('/admin');
  return { success: true, message: 'User created successfully' };
};

export const updateUserRoleAction = async (
  values: UpdateRoleSchema,
): Promise<ServerActionResult> => {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, message: 'Permission denied', code: 'FORBIDDEN' };
  }

  const result = updateRoleSchema.safeParse(values);
  if (!result.success) {
    return { success: false, message: 'Invalid role data', code: 'VALIDATION' };
  }

  if (result.data.userId === session.userId) {
    return { success: false, message: 'You cannot change your own role', code: 'FORBIDDEN' };
  }

  const user = await prisma.user.findUnique({
    where: { id: result.data.userId },
    select: { id: true },
  });
  if (!user) {
    return { success: false, message: 'User not found', code: 'NOT_FOUND' };
  }

  await prisma.user.update({
    where: { id: result.data.userId },
    data: { role: result.data.role },
  });

  revalidatePath('/admin');
  return { success: true, message: 'Role updated successfully' };
};

const resetLimiter = rateLimiter({
  interval: 15 * 60 * 1000,
  limit: 10,
});

export const resetUserPasswordAction = async (
  values: ResetPasswordSchema,
): Promise<ServerActionResult> => {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, message: 'Permission denied', code: 'FORBIDDEN' };
  }

  if (!resetLimiter(session.userId)) {
    return {
      success: false,
      message: 'Too many attempts. Please try again later.',
      code: 'RATE_LIMITED',
    };
  }

  const result = resetPasswordSchema.safeParse(values);
  if (!result.success) {
    return { success: false, message: 'Invalid password data', code: 'VALIDATION' };
  }

  if (result.data.userId === session.userId) {
    return {
      success: false,
      message: 'Change your own password from your profile',
      code: 'FORBIDDEN',
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: result.data.userId },
    select: { id: true },
  });
  if (!user) {
    return { success: false, message: 'User not found', code: 'NOT_FOUND' };
  }

  const password = await bcrypt.hash(result.data.temporaryPassword, 10);
  await prisma.user.update({
    where: { id: result.data.userId },
    data: { password },
  });

  revalidatePath('/admin');
  return { success: true, message: 'Password reset successfully' };
};

export const getUserResources = async (userId: string) =>
  serverQuery(async (): Promise<AdminUserResources> => {
    const session = await getAdminSession();
    if (!session) {
      throw new ActionError('FORBIDDEN', 'Permission denied');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        userAutomatons: {
          select: { id: true, title: true, type: true, isPublic: true, updatedAt: true },
          orderBy: { updatedAt: 'desc' },
        },
        problems: {
          select: { id: true, title: true, difficulty: true, isPublic: true, updatedAt: true },
          orderBy: { updatedAt: 'desc' },
        },
        submissions: {
          select: {
            id: true,
            verdict: true,
            status: true,
            createdAt: true,
            problem: { select: { title: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: { userAutomatons: true, problems: true, submissions: true },
        },
      },
    });
    if (!user) {
      throw new ActionError('NOT_FOUND', 'User not found');
    }

    const { userAutomatons, submissions, _count, ...userData } = user;
    return {
      ...userData,
      projects: userAutomatons,
      submissions: submissions.map(({ problem, ...submission }) => ({
        ...submission,
        problemTitle: problem.title,
      })),
      totals: {
        projects: _count.userAutomatons,
        problems: _count.problems,
        submissions: _count.submissions,
      },
    };
  });
