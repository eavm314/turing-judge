import { BLANK, EPSILON } from '@/constants/symbols';
import {
  type ManualRuntime,
  type ManualTransitionOption,
} from '@/lib/automata/manual/manual-types';
import { type AnimationCallbacks, BaseAnimator } from '../base/BaseAnimator';
import { TmExecutor } from './TmExecutor';

export class TmAnimator extends BaseAnimator {
  private executor!: TmExecutor;

  setExecutor(executor: TmExecutor) {
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
        this.controls.setTape(prev => ({ ...prev, [input.position]: output.writeSymbol }));
        const dirArrow = output.direction === 'R' ? '→' : output.direction === 'L' ? '←' : '•';
        this.controls.setAnimatedData({
          transition: `${input.state}->${output.state}`,
          label: `${input.readSymbol} / ${output.writeSymbol}, ${dirArrow}`,
        });
        if (input.readSymbol !== EPSILON) {
          if (output.direction !== 'S') this.controls.move(output.direction);
        }
      } else {
        this.controls.setAnimatedData({
          state: output.state,
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
        this.controls.setTape(prev => ({ ...prev, [input.position]: output.writeSymbol }));
        const dirArrow = output.direction === 'R' ? '→' : output.direction === 'L' ? '←' : '•';
        this.controls.setAnimatedData({
          transition: `${input.state}->${output.state}`,
          label: `${input.readSymbol} / ${output.writeSymbol}, ${dirArrow}`,
        });
        if (input.readSymbol !== EPSILON) {
          if (output.direction !== 'S') this.controls.move(output.direction);
        }
      } else {
        this.controls.setAnimatedData({
          state: output.state,
        });

        step++;
      }
      transition = !transition;
    }, this.speed);

    return true;
  }

  createManualRuntime(word: string): ManualRuntime {
    return {
      type: 'TM',
      state: this.executor.getInitialState(),
      inputPos: 0,
      word,
      tape: new Map<number, string>(word.split('').map((symbol, index) => [index, symbol])),
    };
  }

  getManualChoices(runtime: ManualRuntime): ManualTransitionOption[] {
    if (runtime.type !== 'TM') {
      return [];
    }

    const choices: ManualTransitionOption[] = [];

    const epsilonTargets = this.executor.transFn({
      state: runtime.state,
      readSymbol: EPSILON,
      position: runtime.inputPos,
    });

    for (const [index, output] of epsilonTargets.entries()) {
      choices.push({
        id: `tm-epsilon-${runtime.state}-${output.state}-${index}`,
        step: {
          type: 'TM',
          input: { state: runtime.state, readSymbol: EPSILON, position: runtime.inputPos },
          output,
        },
        description: `${EPSILON} transition`,
        kind: 'epsilon',
        nextRuntime: {
          ...runtime,
          state: output.state,
          tape: new Map(runtime.tape),
        },
      });
    }

    const readSymbol = runtime.tape.get(runtime.inputPos) ?? BLANK;
    const consumingTargets = this.executor.transFn({
      state: runtime.state,
      readSymbol,
      position: runtime.inputPos,
    });

    for (const [index, output] of consumingTargets.entries()) {
      const tape = new Map(runtime.tape);
      tape.set(runtime.inputPos, output.writeSymbol);

      const nextPosition =
        output.direction === 'R'
          ? runtime.inputPos + 1
          : output.direction === 'L'
            ? runtime.inputPos - 1
            : runtime.inputPos;

      choices.push({
        id: `tm-consuming-${runtime.state}-${output.state}-${index}`,
        step: {
          type: 'TM',
          input: { state: runtime.state, readSymbol, position: runtime.inputPos },
          output,
        },
        description: `${readSymbol} / ${output.writeSymbol}, ${output.direction}`,
        kind: 'consuming',
        nextRuntime: {
          ...runtime,
          state: output.state,
          inputPos: nextPosition,
          tape,
        },
      });
    }

    return choices;
  }

  isManualRuntimeAccepted(runtime: ManualRuntime): boolean {
    if (runtime.type !== 'TM') return false;

    return this.executor.isFinalState(runtime.state);
  }

  syncManualRuntime(runtime: ManualRuntime): void {
    if (runtime.type !== 'TM') return;

    this.controls.setTape(Object.fromEntries(runtime.tape.entries()));
    this.controls.setPosition(runtime.inputPos);
    this.controls.setAnimatedData({
      state: runtime.state,
    });
  }

  async applyManualChoice(choice: ManualTransitionOption): Promise<boolean> {
    return new Promise(resolve => {
      if (choice.step.type !== 'TM') {
        resolve(false);
        return;
      }
      const tmStep = choice.step;
      const { input, output } = tmStep;

      this.controls.setTape(prev => ({ ...prev, [input.position]: output.writeSymbol }));
      const dirArrow = output.direction === 'R' ? '→' : output.direction === 'L' ? '←' : '•';
      this.controls.setAnimatedData({
        transition: `${input.state}->${output.state}`,
        label: `${input.readSymbol} / ${output.writeSymbol}, ${dirArrow}`,
      });
      if (input.readSymbol !== EPSILON) {
        if (output.direction !== 'S') this.controls.move(output.direction);
      }

      this.intervalId = setTimeout(() => {
        this.controls.setAnimatedData({
          state: output.state,
        });
        resolve(true);
      }, this.speed);
    });
  }
}
