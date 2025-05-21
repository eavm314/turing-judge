import { type AutomatonType } from "@prisma/client";
import { type AutomatonDesigner } from "./Designer";
import { type AutomatonExecutor } from "./Executor";

export interface Automaton {
  type: AutomatonType;
  designer: AutomatonDesigner;
  executor: AutomatonExecutor;
}
