import { ProblemDifficulty } from "@prisma/client"
import { z } from "zod"

const DifficultyEnum = z.nativeEnum(ProblemDifficulty)

export const problemSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  difficulty: DifficultyEnum,
  statement: z.string().min(20, {
    message: "Problem statement must be at least 20 characters.",
  }),
  allowFSM: z.boolean(),
  allowPDA: z.boolean(),
  allowTM: z.boolean(),
  allowNonDet: z.boolean(),
  stateLimit: z.number().int().min(1),
  depthLimit: z.number().int().min(1),
  maxStepLimit: z.number().int().min(1),
  testCases: z.string().refine((text) => {
    const lines = text.split("\n");
    const trimmedLines = lines.map(line => line.trim()).filter(line => line.length > 0);
    if (trimmedLines.length < 1) return false;
    for (const line of trimmedLines) {
      const parts = line.split(",");
      if (parts.length < 2 || parts.length > 3) return false;
      if (!['0','1'].includes(parts[1].trim())) return false;
    }
    return true;
  }, {
    message: "Invalid format for test cases.",
  }),
})

export type ProblemSchema = z.infer<typeof problemSchema>;