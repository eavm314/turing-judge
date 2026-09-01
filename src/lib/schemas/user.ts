import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type CredentialsSchema = z.infer<typeof credentialsSchema>;

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required.' })
    .max(100, { message: 'Name must be at most 100 characters.' }),
  image: z.union([z.literal(''), z.string().url({ message: 'Invalid image URL.' })]),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

export const passwordChangeSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export type PasswordChangeSchema = z.infer<typeof passwordChangeSchema>;

export const passwordFormSchema = passwordChangeSchema
  .extend({ confirmPassword: z.string() })
  .refine(values => values.newPassword === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type PasswordFormSchema = z.infer<typeof passwordFormSchema>;
