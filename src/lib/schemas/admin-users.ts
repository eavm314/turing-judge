import { Role } from '@prisma/browser';
import { z } from 'zod';

export const adminUsersOptionsSchema = z.object({
  take: z.coerce.number().min(1).max(40).catch(20).default(20),
  page: z.coerce.number().min(1).catch(1).default(1),
  sortKey: z.enum(['name', 'email', 'role', 'createdAt']).catch('createdAt').default('createdAt'),
  direction: z.enum(['asc', 'desc']).catch('desc').default('desc'),
  search: z.string().catch('').default(''),
  role: z
    .string()
    .transform(role => Role[role.toUpperCase() as keyof typeof Role])
    .optional()
    .catch(undefined),
});

export type AdminUsersOptions = z.infer<typeof adminUsersOptionsSchema>;

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required.' })
    .max(100, { message: 'Name must be at most 100 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  role: z.nativeEnum(Role),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateRoleSchema = z.object({
  userId: z.string(),
  role: z.nativeEnum(Role),
});

export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;

export const resetPasswordSchema = z.object({
  userId: z.string(),
  temporaryPassword: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
