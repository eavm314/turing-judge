'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

import { ActionError, serverQuery, type ServerActionResult } from '@/lib/actions/result';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { type UserProfile } from '@/lib/schemas';
import {
  passwordChangeSchema,
  profileSchema,
  type PasswordChangeSchema,
  type ProfileSchema,
} from '@/lib/schemas/user';
import { rateLimiter } from '@/utils/rate-limit';

export const getMyProfile = async () =>
  serverQuery(async (): Promise<UserProfile> => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ActionError('UNAUTHENTICATED', 'User not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        password: true,
        accounts: {
          select: { provider: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!user) {
      throw new ActionError('NOT_FOUND', 'User not found');
    }

    const { password, ...profile } = user;
    return { ...profile, hasPassword: password !== null };
  });

export const updateProfileAction = async (values: ProfileSchema): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated', code: 'UNAUTHENTICATED' };
  }

  const result = profileSchema.safeParse(values);
  if (!result.success) {
    return { success: false, message: 'Invalid profile data', code: 'VALIDATION' };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: result.data.name },
  });

  revalidatePath('/', 'layout');
  return { success: true, message: 'Profile updated successfully' };
};

const passwordLimiter = rateLimiter({
  interval: 15 * 60 * 1000,
  limit: 5,
});

export const changePasswordAction = async (
  values: PasswordChangeSchema,
): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated', code: 'UNAUTHENTICATED' };
  }

  if (!passwordLimiter(session.user.id)) {
    return {
      success: false,
      message: 'Too many attempts. Please try again later.',
      code: 'RATE_LIMITED',
    };
  }

  const result = passwordChangeSchema.safeParse(values);
  if (!result.success) {
    return { success: false, message: 'Invalid password data', code: 'VALIDATION' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });
  if (!user) {
    return { success: false, message: 'User not found', code: 'NOT_FOUND' };
  }

  if (user.password) {
    if (!result.data.currentPassword) {
      return { success: false, message: 'Current password is required', code: 'VALIDATION' };
    }
    const currentMatches = await bcrypt.compare(result.data.currentPassword, user.password);
    if (!currentMatches) {
      return { success: false, message: 'Current password is incorrect', code: 'VALIDATION' };
    }
  }

  const password = await bcrypt.hash(result.data.newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password },
  });

  revalidatePath('/profile');
  return {
    success: true,
    message: user.password ? 'Password changed successfully' : 'Password set successfully',
  };
};
