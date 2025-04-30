import { z } from "zod";
import { fromZodIssue } from "zod-validation-error";

import { AutomatonCode } from "@/dtos";
import { fsmSchema } from "./finite-state-machine";

const automatonCode = z.object({
  type: z.enum(["FSM", "PDA", "TM"]),
  automaton: z.any(),
});

export const validateCode = (code: string) => {
  try {
    const json = JSON.parse(code) as AutomatonCode;
    const automaton = automatonCode.parse(json);
    if (automaton.type === "FSM") {
      fsmSchema.parse(automaton.automaton);
      return "";
    }
    return "Automaton type not supported yet";
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      const message = fromZodIssue(error.issues[0]).toString();
      return message.substring(18);
    }
    return "Enter a valid JSON";
  }
};
