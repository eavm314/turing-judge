import { EPSILON } from '@/constants/symbols';
import {
  type FsmManualRuntime,
  type ManualRuntime,
  type ManualTransitionOption,
} from '@/lib/automata/manual/manual-types';
import { type AnimationCallbacks, BaseAnimator } from '../base/BaseAnimator';
import { FsmExecutor } from './FsmExecutor';

export class FsmAnimator extends BaseAnimator {
  private executor!: FsmExecutor;

  setExecutor(executor: FsmExecutor) {
    this.executor = executor;
  }

  start(word: string, { onFinish, onStart }: AnimationCallbacks) {
    const initialState = this.executor.getInitialState();
    const { accepted, path } = this.executor.execute(word, true);
    if (!accepted) return false;

    onStart?.();

    this.controls.setTape(Object.fromEntries(word.split('').map((s, i) => [i, s])));
    this.controls.setAnimatedData({
      state: initialState,
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
        this.controls.setAnimatedData({
          transition: `${input.state}->${output}`,
          label: input.symbol,
        });
        if (input.symbol !== EPSILON) {
          this.controls.move('R');
        }
      } else {
        this.controls.setAnimatedData({
          state: output,
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

    this.controls.setTape(Object.fromEntries(word.split('').map((s, i) => [i, s])));
    this.controls.setAnimatedData({
      state: initialState,
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
        this.controls.setAnimatedData({
          transition: `${input.state}->${output}`,
          label: input.symbol,
        });
        if (input.symbol !== EPSILON) {
          this.controls.move('R');
        }
      } else {
        this.controls.setAnimatedData({
          state: output,
        });
        step++;
      }
      transition = !transition;
    }, this.speed);

    return true;
  }

  createManualRuntime(word: string): FsmManualRuntime {
    return {
      type: 'FSM',
      state: this.executor.getInitialState(),
      inputPos: 0,
      word,
    };
  }

  getManualChoices(runtime: ManualRuntime): ManualTransitionOption[] {
    if (runtime.type !== 'FSM') return [];

    const choices: ManualTransitionOption[] = [];

    const input = { state: runtime.state, symbol: EPSILON };
    const epsilonTargets = this.executor.transFn(input);
    for (const [index, target] of epsilonTargets.entries()) {
      choices.push({
        id: `fsm-epsilon-${runtime.state}-${target}-${index}`,
        step: {
          type: 'FSM',
          input,
          output: target,
        },
        description: `${runtime.state} → ${target} (${EPSILON})`,
        kind: 'epsilon',
        nextRuntime: {
          ...runtime,
          state: target,
        },
      });
    }

    const inputSymbol = runtime.word[runtime.inputPos] ?? '';
    const consumingTargets = this.executor.transFn({ state: runtime.state, symbol: inputSymbol });
    for (const [index, target] of consumingTargets.entries()) {
      choices.push({
        id: `fsm-consuming-${runtime.state}-${target}-${index}`,
        step: {
          type: 'FSM',
          input: { state: runtime.state, symbol: inputSymbol },
          output: target,
        },
        description: `${runtime.state} → ${target} (${inputSymbol})`,
        kind: 'consuming',
        nextRuntime: {
          ...runtime,
          state: target,
          inputPos: runtime.inputPos + 1,
        },
      });
    }

    return choices;
  }

  isManualRuntimeAccepted(runtime: ManualRuntime): boolean {
    if (runtime.type !== 'FSM') return false;

    return (
      runtime.inputPos === runtime.word.length && this.executor.isFinalState(runtime.state)
    );
  }

  syncManualRuntime(runtime: ManualRuntime): void {
    if (runtime.type !== 'FSM') return;

    this.controls.setTape(
      Object.fromEntries(runtime.word.split('').map((symbol, i) => [i, symbol])),
    );
    this.controls.setPosition(runtime.inputPos);
    this.controls.setAnimatedData({
      state: runtime.state,
    });
  }

  async applyManualChoice(choice: ManualTransitionOption): Promise<boolean> {
    return new Promise(resolve => {
      if (choice.step.type !== 'FSM') {
        resolve(false);
        return;
      }
      const fsmStep = choice.step;
      this.controls.setAnimatedData({
        transition: `${fsmStep.input.state}->${fsmStep.output}`,
        label: fsmStep.input.symbol,
      });
      if (fsmStep.input.symbol !== EPSILON) {
        this.controls.move('R');
      }
      this.intervalId = setTimeout(() => {
        this.controls.setAnimatedData({
          state: fsmStep.output,
        });
        resolve(true);
      }, this.speed);
    });
  }
}
