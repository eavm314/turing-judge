import { BOTTOM } from '@/constants/symbols';
import { type JsonPda } from '@/lib/schemas/pushdown-automaton';
import { PdaDesigner } from './PdaDesigner';
import { PdaExecutor } from './PdaExecutor';
import { PdaAnimator } from './PdaAnimator';

const basicAutomata: JsonPda = {
  alphabet: ['0', '1'],
  stackAlphabet: [BOTTOM, 'A'],
  states: {
    q0: {
      position: { x: 0, y: 0 },
      transitions: {},
    },
  },
  initial: 'q0',
  finals: [],
};

export const createPDA = (initialCode: JsonPda = basicAutomata) => {
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
