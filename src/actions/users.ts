'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

import { type ServerActionResult } from '@/hooks/use-server-action';
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

export const getMyProfile = async (): Promise<UserProfile | null> => {
  const session = await auth();
  if (!session?.user?.id) return null;

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
        select: { provider: true, providerAccountId: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
  if (!user) return null;

  const { password, ...profile } = user;
  return { ...profile, hasPassword: password !== null };
};

export const updateProfileAction = async (values: ProfileSchema): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated' };
  }

  const result = profileSchema.safeParse(values);
  if (!result.success) {
    return { success: false, message: 'Invalid profile data' };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: result.data.name, image: result.data.image || null },
  });

  revalidatePath('/', 'layout');
  return { success: true, message: 'Profile updated successfully' };
};

const passwordLimiter = rateLimiter({
  interval: 15 * 60 * 1000,
  limit: 5,
});

export const changePasswordAction = async (values: PasswordChangeSchema): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated' };
  }

  if (!passwordLimiter(session.user.id)) {
    return { success: false, message: 'Too many attempts. Please try again later.' };
  }

  const result = passwordChangeSchema.safeParse(values);
  if (!result.success) {
    return { success: false, message: 'Invalid password data' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });
  if (!user) {
    return { success: false, message: 'User not found' };
  }

  if (user.password) {
    if (!result.data.currentPassword) {
      return { success: false, message: 'Current password is required' };
    }
    const currentMatches = await bcrypt.compare(result.data.currentPassword, user.password);
    if (!currentMatches) {
      return { success: false, message: 'Current password is incorrect' };
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

export const unlinkAccountAction = async (
  provider: string,
  providerAccountId: string,
): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'User not authenticated' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      password: true,
      accounts: { select: { provider: true, providerAccountId: true } },
    },
  });
  if (!user) {
    return { success: false, message: 'User not found' };
  }

  const account = user.accounts.find(
    account => account.provider === provider && account.providerAccountId === providerAccountId,
  );
  if (!account) {
    return { success: false, message: 'Linked account not found' };
  }

  if (!user.password && user.accounts.length <= 1) {
    return {
      success: false,
      message: 'Set a password before unlinking your only sign-in method',
    };
  }

  await prisma.account.delete({
    where: { provider_providerAccountId: { provider, providerAccountId } },
  });

  revalidatePath('/profile');
  return { success: true, message: 'Account unlinked successfully' };
};
