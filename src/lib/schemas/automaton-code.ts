import { z } from 'zod';
import { fromZodIssue } from 'zod-validation-error';

import { fsmSchema, JsonFsmState } from './finite-state-machine';
import { JsonPdaState, pdaSchema } from './pushdown-automaton';
import { tmSchema, JsonTmState } from './turing-machine';

export const automatonCodeSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('FSM'),
    automaton: fsmSchema.optional(),
  }),
  z.object({
    type: z.literal('PDA'),
    automaton: pdaSchema.optional(),
  }),
  z.object({
    type: z.literal('TM'),
    automaton: tmSchema.optional(),
  }),
]);

export type AutomatonCode = z.infer<typeof automatonCodeSchema>;

export type JsonState = JsonFsmState | JsonPdaState | JsonTmState;

export const validateCode = (code: string) => {
  try {
    const json = JSON.parse(code);
    automatonCodeSchema.parse(json);
    return '';
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = fromZodIssue(error.issues[0]).toString();
      return message.substring(18);
    }
    return 'Enter a valid JSON';
  }
};
