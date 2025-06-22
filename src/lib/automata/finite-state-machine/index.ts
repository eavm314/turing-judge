import { type JsonFsm } from '@/lib/schemas/finite-state-machine';
import { FsmDesigner } from './FsmDesigner';
import { FsmExecutor } from './FsmExecutor';
import { FsmAnimator } from './FsmAnimator';

const basicAutomata: JsonFsm = {
  alphabet: ['0', '1'],
  states: {
    q0: {
      position: { x: 0, y: 0 },
      transitions: {},
    },
  },
  initial: 'q0',
  finals: [],
};

export const createFSM = (initialCode: JsonFsm = basicAutomata) => {
  let designer: FsmDesigner | undefined;
  let executor: FsmExecutor;
  let animator: FsmAnimator | undefined;
  
  const getDesigner = () => (designer ??= new FsmDesigner(initialCode));
  
  const getExecutor = () => {
    if (!executor) {
      executor = new FsmExecutor(initialCode);
    } else if (designer) {
      executor.startAutomaton(designer.toJson().automaton);
    }
    return executor;
  };

  const getAnimator = () => {
    const executor = getExecutor();
    if (!animator) {
      animator = new FsmAnimator();
    }
    animator.setExecutor(executor);
    return animator;
  };

  return {
    type: 'FSM' as const,
    getDesigner,
    getExecutor,
    getAnimator,
  };
};
