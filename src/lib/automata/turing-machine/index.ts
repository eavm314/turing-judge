import { JsonTm } from '@/lib/schemas/turing-machine';
import { defaultTm } from './default-automaton';
import { TmDesigner } from './TmDesigner';
import { TmExecutor } from './TmExecutor';
import { TmAnimator } from './TmAnimator';

export const createTM = (initialCode: JsonTm = defaultTm) => {
  let designer: TmDesigner | undefined;
  let executor: TmExecutor;
  let animator: TmAnimator | undefined;

  const getDesigner = () => (designer ??= new TmDesigner(initialCode));

  const getExecutor = () => {
    if (!executor) {
      executor = new TmExecutor(initialCode);
    } else if (designer) {
      executor.startAutomaton(designer.toJson().automaton);
    }
    return executor;
  };

  const getAnimator = () => {
    const executor = getExecutor();
    if (!animator) {
      animator = new TmAnimator();
    }
    animator.setExecutor(executor);
    return animator;
  };

  return {
    type: 'TM' as const,
    getDesigner,
    getExecutor,
    getAnimator,
  };
};
