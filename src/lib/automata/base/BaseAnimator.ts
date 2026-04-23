import { TapeOrCallback, type AnimationData } from '@/store/playground-store';

export type AnimationCallbacks = {
  onStart?: () => void;
  onFinish?: () => void;
};

export type AnimationControls = {
  setAnimatedData: (data: AnimationData) => void;
  move: (dir: 'L' | 'R') => void;
  setTape: (tapeOrCallback: TapeOrCallback) => void;
};

export abstract class BaseAnimator {
  protected intervalId?: NodeJS.Timeout;

  protected controls: AnimationControls = {
    setAnimatedData: () => {},
    move: () => {},
    setTape: () => {},
  };

  speed: number = 1200;

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  setControls(controls: AnimationControls) {
    this.controls = controls;
  }

  abstract start(word: string, callbacks?: AnimationCallbacks): boolean;
  abstract startRandom(word: string, callbacks?: AnimationCallbacks): boolean;
}
