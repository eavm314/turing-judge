import { TapeOrCallback, type AnimationData } from '@/store/playground-store';
import {
  type ManualRuntime,
  type ManualSessionStatus,
  type ManualTransitionOption,
} from '@/lib/automata/manual/manual-types';

export type AnimationCallbacks = {
  onStart?: () => void;
  onFinish?: () => void;
};

export type AnimationControls = {
  setAnimatedData: (data: AnimationData) => void;
  move: (dir: 'L' | 'R') => void;
  setTape: (tapeOrCallback: TapeOrCallback) => void;
  setPosition: (position: number) => void;
};

export abstract class BaseAnimator {
  protected intervalId?: NodeJS.Timeout;

  protected controls: AnimationControls = {
    setAnimatedData: () => {},
    move: () => {},
    setTape: () => {},
    setPosition: () => {},
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

  abstract createManualRuntime(word: string): ManualRuntime;
  abstract getManualChoices(runtime: ManualRuntime): ManualTransitionOption[];
  abstract isManualRuntimeAccepted(runtime: ManualRuntime): boolean;
  abstract syncManualRuntime(runtime: ManualRuntime): void;
  abstract applyManualChoice(choice: ManualTransitionOption): Promise<boolean>;

  getManualStatus(
    runtime: ManualRuntime,
    choices: ManualTransitionOption[] = this.getManualChoices(runtime),
  ): ManualSessionStatus {
    if (this.isManualRuntimeAccepted(runtime)) {
      return 'accepted';
    }

    return choices.length > 0 ? 'running' : 'blocked';
  }
}
