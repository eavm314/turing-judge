import { z } from "zod";
import { fromZodIssue } from "zod-validation-error";

import { fsmSchema } from "./finite-state-machine";

export const automatonCodeSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("FSM"),
    automaton: fsmSchema,
  }),
  z.object({
    type: z.literal("PDA"),
    automaton: z.object({}),
  }),
  z.object({
    type: z.literal("TM"),
    automaton: z.object({}),
  }),
]);

export type AutomatonCode = z.infer<typeof automatonCodeSchema>;

export const validateCode = (code: string) => {
  try {
    const json = JSON.parse(code);
    const automaton = automatonCodeSchema.parse(json);
    if (automaton.type !== "FSM") {
      return "Automaton type not supported yet";
    }
    return "";
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      const message = fromZodIssue(error.issues[0]).toString();
      return message.substring(18);
    }
    return "Enter a valid JSON";
  }
};
