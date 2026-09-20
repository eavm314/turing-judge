import { type JsonPda } from '@/lib/schemas/pushdown-automaton';
import { defaultPda } from './default-automaton';
import { PdaDesigner } from './PdaDesigner';
import { PdaExecutor } from './PdaExecutor';
import { PdaAnimator } from './PdaAnimator';

export const createPDA = (initialCode: JsonPda = defaultPda) => {
  let designer: PdaDesigner | undefined;
  let executor: PdaExecutor;
  let animator: PdaAnimator | undefined;

  const getDesigner = () => (designer ??= new PdaDesigner(initialCode));
  const getExecutor = () => {
    if (!executor) {
      executor = new PdaExecutor(initialCode);
    } else if (designer) {
      executor.startAutomaton(designer.toJson().automaton);
    }
    return executor;
  };
  const getAnimator = () => {
    const executor = getExecutor();
    if (!animator) {
      animator = new PdaAnimator();
    }
    animator.setExecutor(executor);
    return animator;
  };
  return {
    type: 'PDA' as const,
    getDesigner,
    getExecutor,
    getAnimator,
  };
};
