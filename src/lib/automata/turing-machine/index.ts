import { type JsonFsm } from '@/lib/schemas/finite-state-machine';
import { TmDesigner } from './TmDesigner';
import { JsonTm } from '@/lib/schemas/turing-machine';
// import { FsmExecutor } from './FsmExecutor';
// import { FsmAnimator } from './FsmAnimator';

const basicAutomata: JsonTm = {
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

export const createTM = (initialCode: JsonTm = basicAutomata) => {
  let designer: TmDesigner | undefined;
  // let executor: FsmExecutor;
  // let animator: FsmAnimator | undefined;

  const getDesigner = () => (designer ??= new TmDesigner(initialCode));

  // const getExecutor = () => {
  //   if (!executor) {
  //     executor = new FsmExecutor(initialCode);
  //   } else if (designer) {
  //     executor.startAutomaton(designer.toJson().automaton);
  //   }
  //   return executor;
  // };

  // const getAnimator = () => {
  //   const executor = getExecutor();
  //   if (!animator) {
  //     animator = new FsmAnimator();
  //   }
  //   animator.setExecutor(executor);
  //   return animator;
  // };

  return {
    type: 'TM' as const,
    getDesigner,
    // getExecutor,
    // getAnimator,
  };
};
