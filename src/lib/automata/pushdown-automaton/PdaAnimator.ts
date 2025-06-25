import { BOTTOM, EPSILON } from '@/constants/symbols';
import { type AnimationCallbacks, BaseAnimator } from '../base/BaseAnimator';
import { PdaExecutor } from './PdaExecutor';

export interface StackElement {
  id: string;
  symbol: string;
  isEntering: boolean;
  isExiting: boolean;
}

export class PdaAnimator extends BaseAnimator {
  private executor!: PdaExecutor;
  private stack!: StackElement[];

  setExecutor(executor: PdaExecutor) {
    this.executor = executor;
  }

  start(word: string, { onFinish, onStart, setAnimatedData, move }: AnimationCallbacks) {
    const initialState = this.executor.getInitialState();
    const { accepted, path } = this.executor.execute(word, true);
    if (!accepted) return false;

    onStart?.();

    this.resetStack();
    setAnimatedData({
      state: initialState,
      transition: null,
      symbol: null,
      stack: this.stack,
    });

    let step = 0;
    let transition = true;
    this.intervalId = setInterval(() => {
      if (step >= path.length) {
        onFinish?.();
        this.stop();
        return;
      }

      const { input, output } = path[step];
      if (transition) {
        const setStack = (newStack: StackElement[]) => {
          this.stack = newStack;
          setAnimatedData({
            state: null,
            transition: `${input.state}->${output.state}`,
            symbol: `${input.inputSymbol},${input.stackTop}/${output.push.length > 0 ? output.push.toReversed().join('') : EPSILON}`,
            stack: this.stack,
          });
        };
        this.executeTransition(input.stackTop, output.push, setStack);
        if (input.inputSymbol !== EPSILON) {
          move('R');
        }
      } else {
        this.stack = this.stack.map(el => ({ ...el, isEntering: false }));
        setAnimatedData({
          state: output.state,
          transition: null,
          symbol: null,
          stack: this.stack,
        });
        step++;
      }
      transition = !transition;
    }, this.speed);
    return true;
  }

  resetStack() {
    this.stack = [
      {
        id: 'bottom',
        symbol: BOTTOM,
        isEntering: false,
        isExiting: false,
      },
    ];
  }

  async executeTransition(
    popSymbol: string,
    pushSymbols: string[],
    setStack: (newStack: StackElement[]) => void,
  ) {
    const opSpeed = this.speed / 2;
    // Phase 1: Pop operation
    const topElement = this.stack[this.stack.length - 1];
    if (topElement && topElement.symbol === popSymbol) {
      // Start exit animation
      setStack(this.stack.map(el => (el.id === topElement.id ? { ...el, isExiting: true } : el)));

      await new Promise(resolve => setTimeout(resolve, opSpeed));
      setStack(this.stack.filter(el => el.id !== topElement.id));
    }

    // Phase 2: Push operations (one by one)
    if (pushSymbols.length > 0) {
      // Add the new elements with entering state
      const newElements: StackElement[] = pushSymbols.map((symbol, i) => ({
        id: `${symbol}-${Date.now()}-${i}`,
        symbol: symbol,
        isEntering: true,
        isExiting: false,
      }));

      setStack([...this.stack, ...newElements]);
    }
  }
}
