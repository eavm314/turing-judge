import { EPSILON } from '@/constants/symbols';
import { type AnimationCallbacks, BaseAnimator } from '../base/BaseAnimator';
import { TmExecutor } from './TmExecutor';

export class TmAnimator extends BaseAnimator {
  private executor!: TmExecutor;

  setExecutor(executor: TmExecutor) {
    this.executor = executor;
  }

  start(word: string, { onFinish, onStart, setAnimatedData, move, setTape }: AnimationCallbacks) {
    const initialState = this.executor.getInitialState();
    const { accepted, path } = this.executor.execute(word, true);
    if (!accepted) return false;

    onStart?.();

    setTape(Object.fromEntries(word.split('').map((s, i) => [i, s])));
    setAnimatedData({
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
        setTape(prev => ({ ...prev, [input.position]: output.writeSymbol }));
        const dirArrow = output.direction === 'R' ? '→' : output.direction === 'L' ? '←' : '•';
        setAnimatedData({
          transition: `${input.state}->${output.state}`,
          label: `${input.readSymbol} / ${output.writeSymbol}, ${dirArrow}`,
        });
        if (input.readSymbol !== EPSILON) {
          if (output.direction !== 'S') move(output.direction);
        }
      } else {
        setAnimatedData({
          state: output.state,
        });
        
        step++;
      }
      transition = !transition;
    }, this.speed);
    return true;
  }
}
