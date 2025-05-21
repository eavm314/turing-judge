import { type AutomatonType } from "@prisma/client";
import { type BaseDesigner } from "./BaseDesigner";
import { type BaseExecutor } from "./BaseExecutor";

export interface Automaton {
  type: AutomatonType;
  getDesigner: () => BaseDesigner;
  getExecutor: () => BaseExecutor;
}
