import { EPSILON } from '@/constants/symbols';
import { type AnimationCallbacks, BaseAnimator } from '../base/BaseAnimator';
import { TmExecutor } from './TmExecutor';

export class TmAnimator extends BaseAnimator {
  private executor!: TmExecutor;

  setExecutor(executor: TmExecutor) {
    this.executor = executor;
  }

  start(word: string, { onFinish, onStart, setAnimatedData, move }: AnimationCallbacks) {
    const initialState = this.executor.getInitialState();
    const { accepted, path } = this.executor.execute(word, true);
    if (!accepted) return false;

    onStart?.();

    setAnimatedData({
      state: initialState,
      transition: null,
      symbol: null,
      stack: null,
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
        setAnimatedData({
          state: null,
          transition: `${input.state}->${output.state}`,
          symbol: `${input.readSymbol} / ${output.writeSymbol}`,
          stack: null,
        });
        if (input.readSymbol !== EPSILON) {
          move('R');
        }
      } else {
        setAnimatedData({
          state: output.state,
          transition: null,
          symbol: null,
          stack: null,
        });
        step++;
      }
      transition = !transition;
    }, this.speed);
    return true;
  }
}
