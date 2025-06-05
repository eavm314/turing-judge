import { ProblemDifficulty } from '@prisma/client';
import { z } from 'zod';

export const optionsSchema = z.object({
  take: z.coerce.number().min(1).max(40).catch(10).default(10),
  page: z.coerce.number().min(1).catch(1).default(1),
  sortKey: z.enum(['title', 'difficulty', 'updatedAt']).catch('updatedAt').default('updatedAt'),
  direction: z.enum(['asc', 'desc']).catch('desc').default('desc'),
  search: z.string().optional().catch(undefined).default(undefined),
  difficulty: z
    .string()
    .transform(diff => ProblemDifficulty[diff.toUpperCase() as keyof typeof ProblemDifficulty])
    .optional()
    .catch(undefined),
});

export type ProblemSetOptions = z.infer<typeof optionsSchema>;
