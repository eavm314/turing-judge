import { z } from 'zod';

import { BOTTOM } from '@/constants/symbols';
import { alphabetSchema, positionSchema } from './finite-state-machine';

export const stackAphabetSchema = z.array(
  z
    .string()
    .min(1)
    .max(1)
    .refine(symbol => /^[a-zA-Z0-9]+$/.test(symbol) || symbol === BOTTOM, {
      message: `Symbols must be alphanumeric or "${BOTTOM}"`,
    }),
);

const transitionsSchema = z
  .record(
    z.array(
      z.object({
        input: z.string(),
        top: z.string(),
        push: z.array(z.string()).optional(),
      }),
    ),
  )
  .optional();

const stateSchema = z.object({
  position: positionSchema,
  transitions: transitionsSchema,
});

const statesRecord = z.record(z.string().min(1).max(3), stateSchema);

export const pdaSchema = z
  .object({
    alphabet: alphabetSchema,
    stackAlphabet: stackAphabetSchema,
    states: statesRecord,
    initial: z.string(),
    finals: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    const stateKeys = new Set(Object.keys(data.states));
    const alphabetSet = new Set(data.alphabet);
    const stackAphabetSet = new Set(data.stackAlphabet);

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
      for (const [target, transitions] of Object.entries(state.transitions ?? {})) {
        if (!stateKeys.has(target)) {
          ctx.addIssue({
            path: ['states', stateName, 'transitions', target],
            message: `Target state "${target}" does not exist.`,
            code: z.ZodIssueCode.custom,
          });
        }

        for (const transition of transitions) {
          if (!alphabetSet.has(transition.input)) {
            ctx.addIssue({
              path: ['states', stateName, 'transitions', target, 'input'],
              message: `Symbol "${transition.input}" is not in the input alphabet.`,
              code: z.ZodIssueCode.custom,
            });
          }
          if (!stackAphabetSet.has(transition.top)) {
            ctx.addIssue({
              path: ['states', stateName, 'transitions', target, 'top'],
              message: `Symbol "${transition.top}" is not in the stack alphabet.`,
              code: z.ZodIssueCode.custom,
            });
          }
          for (const symbol of transition.push ?? []) {
            if (!stackAphabetSet.has(symbol)) {
              ctx.addIssue({
                path: ['states', stateName, 'transitions', target, 'push'],
                message: `Symbol "${symbol}" is not in the stack alphabet.`,
                code: z.ZodIssueCode.custom,
              });
            }
          }
        }
      }
    }
  });

export type JsonPda = z.infer<typeof pdaSchema>;
export type JsonPdaState = z.infer<typeof stateSchema>;
