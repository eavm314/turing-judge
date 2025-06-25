import { type AnimationData } from "@/store/playground-store";

export type AnimationCallbacks = {
  onStart?: () => void;
  onFinish?: () => void;
  setAnimatedData: (data: AnimationData) => void;
  move: (dir: 'L' | 'R') => void;
};

export abstract class BaseAnimator {
  protected intervalId?: NodeJS.Timeout;
  protected speed: number = 1200;

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  getSimulationSpeed() {
    return this.speed;
  }

  setSimulationSpeed(speed: number) {
    this.speed = speed;
  }

  abstract start(word: string, callbacks: AnimationCallbacks): boolean;
}
