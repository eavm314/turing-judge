'use server';

import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { signIn, signOut } from '@/lib/auth';
import { type ServerActionResult } from '@/hooks/use-server-action';
import { credentialsSchema, type CredentialsSchema } from '@/lib/schemas/user';

export { signIn, signOut };

export const revalidateAll = async () => {
  revalidatePath('/', 'layout');
};

export const signInWithCredentialsAction = async (
  values: CredentialsSchema,
): Promise<ServerActionResult> => {
  const result = credentialsSchema.safeParse(values);
  if (!result.success) {
    return { success: false, message: 'Invalid email or password' };
  }

  try {
    await signIn('credentials', { ...result.data, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      const message =
        error.type === 'CredentialsSignin'
          ? 'Invalid email or password'
          : 'Something went wrong. Please try again.';
      return { success: false, message };
    }
    throw error;
  }

  return { success: true, message: 'Signed in successfully' };
};
