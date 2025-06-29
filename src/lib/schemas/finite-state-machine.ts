import { z } from 'zod';

import { EPSILON } from '@/constants/symbols';

export const alphabetSchema = z.array(
  z
    .string()
    .length(1)
    .refine(symbol => /^[a-zA-Z0-9]+$/.test(symbol) || symbol === EPSILON, {
      message: `Symbols must be alphanumeric or "${EPSILON}"`,
    }),
);

export const positionSchema = z
  .object({
    x: z.number(),
    y: z.number(),
  })
  .optional();

const transitionsSchema = z.record(z.array(z.string())).optional();

const stateSchema = z.object({
  position: positionSchema,
  transitions: transitionsSchema,
});

const statesRecord = z.record(z.string().min(1).max(3), stateSchema);

export const fsmSchema = z
  .object({
    alphabet: alphabetSchema,
    states: statesRecord,
    initial: z.string(),
    finals: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    const stateKeys = new Set(Object.keys(data.states));
    const alphabetSet = new Set(data.alphabet);

    if (!stateKeys.has(data.initial)) {
      ctx.addIssue({
        path: ['initial'],
        message: `Initial state "${data.initial}" is not defined in states.`,
        code: z.ZodIssueCode.custom,
      });
    }

    for (const finalState of data.finals) {
      if (!stateKeys.has(finalState)) {
        ctx.addIssue({
          path: ['finals'],
          message: `Final state "${finalState}" is not defined in states.`,
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // Check transitions
    for (const [stateName, state] of Object.entries(data.states)) {
      for (const [target, symbols] of Object.entries(state.transitions ?? {})) {
        if (!stateKeys.has(target)) {
          ctx.addIssue({
            path: ['states', stateName, 'transitions', target],
            message: `Target state "${target}" does not exist.`,
            code: z.ZodIssueCode.custom,
          });
        }

        for (const symbol of symbols) {
          if (!alphabetSet.has(symbol)) {
            ctx.addIssue({
              path: ['states', stateName, 'transitions', target],
              message: `Symbol "${symbol}" in transitions is not in the alphabet.`,
              code: z.ZodIssueCode.custom,
            });
          }
        }
      }
    }
  });

export type JsonFsm = z.infer<typeof fsmSchema>;
export type JsonFsmState = z.infer<typeof stateSchema>;
