import { EPSILON } from '@/constants/symbols';
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
}
