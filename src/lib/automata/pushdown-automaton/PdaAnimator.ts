import { BLANK, BOTTOM, EPSILON } from '@/constants/symbols';
import {
  type ManualRuntime,
  type ManualTransitionOption,
} from '@/lib/automata/manual/manual-types';
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

  start(word: string, { onFinish, onStart }: AnimationCallbacks) {
    const initialState = this.executor.getInitialState();
    const { accepted, path } = this.executor.execute(word, true);
    if (!accepted) return false;

    onStart?.();

    this.resetStack();
    this.controls.setTape(Object.fromEntries(word.split('').map((s, i) => [i, s])));
    this.controls.setAnimatedData({
      state: initialState,
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
          this.controls.setAnimatedData({
            transition: `${input.state}->${output.state}`,
            label: `${input.inputSymbol},${input.stackTop}/${output.push.length > 0 ? output.push.toReversed().join('') : EPSILON}`,
            stack: this.stack,
          });
        };
        this.executeTransition(input.stackTop, output.push, setStack);
        if (input.inputSymbol !== EPSILON) {
          this.controls.move('R');
        }
      } else {
        this.stack = this.stack.map(el => ({ ...el, isEntering: false }));
        this.controls.setAnimatedData({
          state: output.state,
          stack: this.stack,
        });
        step++;
      }
      transition = !transition;
    }, this.speed);
    return true;
  }

  startRandom(word: string, { onFinish, onStart }: AnimationCallbacks) {
    const initialState = this.executor.getInitialState();
    const { accepted, path } = this.executor.executeRandom(word, true);
    if (!accepted && path.length === 0) return false;

    onStart?.();

    this.resetStack();
    this.controls.setTape(Object.fromEntries(word.split('').map((s, i) => [i, s])));
    this.controls.setAnimatedData({
      state: initialState,
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
          this.controls.setAnimatedData({
            transition: `${input.state}->${output.state}`,
            label: `${input.inputSymbol},${input.stackTop}/${output.push.length > 0 ? output.push.toReversed().join('') : EPSILON}`,
            stack: this.stack,
          });
        };
        this.executeTransition(input.stackTop, output.push, setStack);
        if (input.inputSymbol !== EPSILON) {
          this.controls.move('R');
        }
      } else {
        this.stack = this.stack.map(el => ({ ...el, isEntering: false }));
        this.controls.setAnimatedData({
          state: output.state,
          stack: this.stack,
        });
        step++;
      }
      transition = !transition;
    }, this.speed);

    return true;
  }

  createManualRuntime(word: string): ManualRuntime {
    return {
      type: 'PDA',
      state: this.executor.getInitialState(),
      inputPos: 0,
      word,
      stack: [BOTTOM],
    };
  }

  getManualChoices(runtime: ManualRuntime): ManualTransitionOption[] {
    if (runtime.type !== 'PDA') {
      return [];
    }

    const stackTop = runtime.stack.at(-1);
    if (!stackTop) {
      return [];
    }

    const stackWithoutTop = runtime.stack.slice(0, -1);
    const choices: ManualTransitionOption[] = [];

    const epsilonTargets = this.executor.transFn({
      state: runtime.state,
      inputSymbol: EPSILON,
      stackTop,
    });

    for (const [index, output] of epsilonTargets.entries()) {
      const pushText = output.push.length > 0 ? output.push.toReversed().join('') : EPSILON;
      choices.push({
        id: `pda-epsilon-${runtime.state}-${output.state}-${index}`,
        step: {
          type: 'PDA',
          input: { state: runtime.state, inputSymbol: EPSILON, stackTop },
          output,
        },
        description: `${EPSILON},${stackTop}/${pushText}`,
        kind: 'epsilon',
        nextRuntime: {
          ...runtime,
          state: output.state,
          stack: [...stackWithoutTop, ...output.push],
        },
      });
    }

    const inputSymbol = runtime.word[runtime.inputPos] ?? '';
    const consumingTargets = this.executor.transFn({
      state: runtime.state,
      inputSymbol,
      stackTop,
    });

    for (const [index, output] of consumingTargets.entries()) {
      const pushText = output.push.length > 0 ? output.push.toReversed().join('') : EPSILON;
      choices.push({
        id: `pda-consuming-${runtime.state}-${output.state}-${index}`,
        step: {
          type: 'PDA',
          input: { state: runtime.state, inputSymbol, stackTop },
          output,
        },
        description: `${inputSymbol || BLANK},${stackTop}/${pushText}`,
        kind: 'consuming',
        nextRuntime: {
          ...runtime,
          state: output.state,
          inputPos: runtime.inputPos + 1,
          stack: [...stackWithoutTop, ...output.push],
        },
      });
    }

    return choices;
  }

  isManualRuntimeAccepted(runtime: ManualRuntime): boolean {
    if (runtime.type !== 'PDA') return false;

    return (
      runtime.inputPos === runtime.word.length &&
      this.executor.isFinalState(runtime.state) &&
      runtime.stack.length > 0
    );
  }

  syncManualRuntime(runtime: ManualRuntime): void {
    if (runtime.type !== 'PDA') return;

    this.stack = runtime.stack.map((symbol, index) => ({
      id: `manual-stack-${index}-${symbol}`,
      symbol,
      isEntering: false,
      isExiting: false,
    }));

    this.controls.setTape(Object.fromEntries(runtime.word.split('').map((symbol, i) => [i, symbol])));
    this.controls.setPosition(runtime.inputPos);
    this.controls.setAnimatedData({
      state: runtime.state,
      stack: this.stack,
    });
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

  async applyManualChoice(choice: ManualTransitionOption): Promise<boolean> {
    return new Promise(resolve => {
      if (choice.step.type !== 'PDA') {
        resolve(false);
        return;
      }
      const pdaStep = choice.step;
      const { input, output } = pdaStep;

      const setStack = (newStack: StackElement[]) => {
        this.stack = newStack;
        this.controls.setAnimatedData({
          transition: `${input.state}->${output.state}`,
          label: `${input.inputSymbol},${input.stackTop}/${output.push.length > 0 ? output.push.toReversed().join('') : EPSILON}`,
          stack: this.stack,
        });
      };
      
      this.executeTransition(input.stackTop, output.push, setStack);

      if (input.inputSymbol !== EPSILON) {
        this.controls.move('R');
      }

      this.intervalId = setTimeout(() => {
        this.stack = this.stack.map(el => ({ ...el, isEntering: false }));
        this.controls.setAnimatedData({
          state: output.state,
          stack: this.stack,
        });
        resolve(true);
      }, this.speed);
    });
  }
}
