import { type AutomatonType } from '@prisma/client';
import { type BaseDesigner } from './BaseDesigner';
import { type BaseExecutor } from './BaseExecutor';
import { BaseAnimator } from './BaseAnimator';

export interface Automaton {
  type: AutomatonType;
  getDesigner: () => BaseDesigner;
  getExecutor: () => BaseExecutor<unknown, unknown>;
  getAnimator: () => BaseAnimator;
}
