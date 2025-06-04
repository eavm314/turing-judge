import { z } from 'zod';
import { fromZodIssue } from 'zod-validation-error';

import { fsmSchema } from './finite-state-machine';
import { pdaSchema } from './pushdown-automata';

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
    automaton: z.object({}),
  }),
]);

export type AutomatonCode = z.infer<typeof automatonCodeSchema>;

export const validateCode = (code: string) => {
  try {
    const json = JSON.parse(code);
    const automaton = automatonCodeSchema.parse(json);
    if (automaton.type === 'TM') {
      return 'Automaton type not supported yet. Come back later!';
    }
    return '';
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = fromZodIssue(error.issues[0]).toString();
      return message.substring(18);
    }
    return 'Enter a valid JSON';
  }
};
