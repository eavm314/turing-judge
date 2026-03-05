import { type AnimationData } from "@/store/playground-store";

export type AnimationCallbacks = {
  onStart?: () => void;
  onFinish?: () => void;
  setAnimatedData: (data: AnimationData) => void;
  move: (dir: 'L' | 'R') => void;
};

export abstract class BaseAnimator {
  protected intervalId?: NodeJS.Timeout;
  
  #speed: number = 1200;

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  get speed() {
    return this.#speed;
  }

  set speed(speed: number) {
    this.#speed = speed;
  }

  abstract start(word: string, callbacks: AnimationCallbacks): boolean;
}
