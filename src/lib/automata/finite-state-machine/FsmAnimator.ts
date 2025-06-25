import { EPSILON } from '@/constants/symbols';
import { type AnimationCallbacks, BaseAnimator } from '../base/BaseAnimator';
import { FsmExecutor } from './FsmExecutor';

export class FsmAnimator extends BaseAnimator {
  private executor!: FsmExecutor;

  setExecutor(executor: FsmExecutor) {
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
          transition: `${input.state}->${output}`,
          symbol: input.symbol,
          stack: null,
        });
        if (input.symbol !== EPSILON) {
          move('R');
        }
      } else {
        setAnimatedData({
          state: output,
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
