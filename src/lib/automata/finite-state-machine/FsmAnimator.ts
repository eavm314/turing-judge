import { EPSILON } from '@/constants/symbols';
import { type AnimationCallbacks, BaseAnimator } from '../base/BaseAnimator';
import { FsmExecutor } from './FsmExecutor';

export class FsmAnimator extends BaseAnimator {
  private executor!: FsmExecutor;

  setExecutor(executor: FsmExecutor) {
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
        setAnimatedData({
          transition: `${input.state}->${output}`,
          label: input.symbol,
        });
        if (input.symbol !== EPSILON) {
          move('R');
        }
      } else {
        setAnimatedData({
          state: output,
        });
        step++;
      }
      transition = !transition;
    }, this.speed);
    return true;
  }
}
