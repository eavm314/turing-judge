import { z } from 'zod';

import { BLANK, TM_MOVES } from '@/constants/symbols';
import { alphabetSchema, positionSchema } from './finite-state-machine';

const headMovementSchema = z.enum(TM_MOVES);

const transitionsSchema = z
  .record(
    z.array(
      z.object({
        read: z.string(),
        write: z.string(),
        move: headMovementSchema,
      }),
    ),
  )
  .optional();

const stateSchema = z.object({
  position: positionSchema,
  transitions: transitionsSchema,
});

const statesRecord = z.record(z.string().min(1).max(3), stateSchema);

export const tmSchema = z
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
      for (const [target, transitions] of Object.entries(state.transitions ?? {})) {
        if (!stateKeys.has(target)) {
          ctx.addIssue({
            path: ['states', stateName, 'transitions', target],
            message: `Target state "${target}" does not exist.`,
            code: z.ZodIssueCode.custom,
          });
        }

        for (const transition of transitions) {
          if (transition.read !== BLANK && !alphabetSet.has(transition.read)) {
            ctx.addIssue({
              path: ['states', stateName, 'transitions', target, 'read'],
              message: `Read symbol "${transition.read}" is not in the tape alphabet.`,
              code: z.ZodIssueCode.custom,
            });
          }

          if (transition.write !== BLANK && !alphabetSet.has(transition.write)) {
            ctx.addIssue({
              path: ['states', stateName, 'transitions', target, 'write'],
              message: `Write symbol "${transition.write}" is not in the tape alphabet.`,
              code: z.ZodIssueCode.custom,
            });
          }
        }
      }
    }
  });

export type JsonTm = z.infer<typeof tmSchema>;
export type JsonTmState = z.infer<typeof stateSchema>;
