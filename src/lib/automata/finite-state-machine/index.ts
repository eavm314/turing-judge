import { type JsonFSM } from "@/lib/schemas/finite-state-machine";
import { FsmDesigner } from "./FsmDesigner";
import { FsmExecutor } from "./FsmExecutor";

const basicAutomata: JsonFSM = {
  alphabet: ["0", "1"],
  states: {
    q0: {
      position: { x: 0, y: 0 },
      transitions: {},
    },
  },
  initial: "q0",
  finals: [],
};

export const createFSM = (initialCode: JsonFSM = basicAutomata) => {
  let designer: FsmDesigner | undefined;
  let executor: FsmExecutor;
  return {
    type: "FSM" as const,
    getDesigner: () => (designer ??= new FsmDesigner(initialCode)),
    getExecutor: () => {
      if (!executor) {
        executor = new FsmExecutor(initialCode);
      } else if (designer) {
        executor.startAutomaton(designer.toJson().automaton);
      }
      return executor;
    },
  };
};
