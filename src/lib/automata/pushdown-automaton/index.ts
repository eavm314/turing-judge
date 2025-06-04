import { BOTTOM } from "@/constants/symbols";
import { type JsonPda } from "@/lib/schemas/pushdown-automata";
import { PdaDesigner } from "./PdaDesigner";
import { PdaExecutor } from "./PdaExecutor";

const basicAutomata: JsonPda = {
  alphabet: ["0", "1"],
  stackAlphabet: [BOTTOM, "A"],
  states: {
    q0: {
      position: { x: 0, y: 0 },
      transitions: {},
    },
  },
  initial: "q0",
  finals: [],
};

export const createPDA = (initialCode: JsonPda = basicAutomata) => {
  let designer: PdaDesigner | undefined;
  let executor: PdaExecutor;
  return {
    type: "PDA" as const,
    getDesigner: () => (designer ??= new PdaDesigner(initialCode)),
    getExecutor: () => {
      if (!executor) {
        executor = new PdaExecutor(initialCode);
      } else if (designer) {
        executor.startAutomaton(designer.toJson().automaton);
      }
      return executor;
    },
  };
};
