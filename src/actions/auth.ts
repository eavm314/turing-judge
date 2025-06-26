'use server';

import { signIn, signOut } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export { signIn, signOut };

export const revalidateAll = async () => {
  revalidatePath('/', 'layout');
};
