import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type CredentialsSchema = z.infer<typeof credentialsSchema>;
