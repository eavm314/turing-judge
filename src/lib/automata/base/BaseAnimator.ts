import { TapeOrCallback, type AnimationData } from '@/store/playground-store';

export type AnimationCallbacks = {
  onStart?: () => void;
  onFinish?: () => void;
  setAnimatedData: (data: AnimationData) => void;
  move: (dir: 'L' | 'R') => void;
  setTape: (tapeOrCallback: TapeOrCallback) => void;
};

export abstract class BaseAnimator {
  protected intervalId?: NodeJS.Timeout;

  speed: number = 1200;

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  abstract start(word: string, callbacks: AnimationCallbacks): boolean;
}
