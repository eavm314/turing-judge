import { type JsonFSM } from "@/lib/schemas/finite-state-machine";
import { FsmDesigner } from "./FsmDesigner";
import { FsmExecutor } from "./FsmExecutor";

export const createFSM = (initialCode?: JsonFSM) => {
  const designer = new FsmDesigner(initialCode);
  const executor = new FsmExecutor();
  return {
    type: 'FSM' as const,
    designer,
    executor,
  };
}