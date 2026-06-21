import { useRef, useState } from 'react';

import { ManualSimulationSession } from '@/lib/automata/manual/ManualSimulationSession';
import {
  cloneManualRuntime,
  type ManualRuntime,
  type ManualSessionStatus,
  type ManualTransitionOption,
} from '@/lib/automata/manual/manual-types';
import { useSimulation } from '@/providers/playground-provider';
import { automatonManager } from '@/store/playground-store';

export type ManualSimulationController = {
  state: {
    runtime: ManualRuntime | null;
    choices: ManualTransitionOption[];
    status: ManualSessionStatus;
    canUndo: boolean;
    stepCount: number;
  };
  isApplyingStep: boolean;
  start: () => void;
  step: (choiceId: string) => void;
  undo: () => void;
  reset: () => void;
};

export const useManualSimulation = (): ManualSimulationController => {
  const simulation = useSimulation();

  const sessionRef = useRef<ManualSimulationSession<ManualRuntime> | null>(null);

  const [state, setState] = useState({
    runtime: null as ManualRuntime | null,
    choices: [] as ManualTransitionOption[],
    status: 'blocked' as ManualSessionStatus,
    canUndo: false,
    stepCount: 0,
  });

  const [isApplyingStep, setIsApplyingStep] = useState(false);

  const syncSnapshot = () => {
    const session = sessionRef.current;
    if (!session) return;
    
    const snapshot = session.getState();

    const animator = automatonManager.getAnimator();
    animator.syncManualRuntime(snapshot);
    const nextChoices = animator.getManualChoices(snapshot);

    setState({
      runtime: snapshot,
      choices: nextChoices,
      status: animator.getManualStatus(snapshot, nextChoices),
      canUndo: session.canUndo(),
      stepCount: session.getStepCount(),
    });
  };

  function start() {
    const animator = automatonManager.getAnimator();
    animator.setControls(simulation);

    const initialRuntime = animator.createManualRuntime(simulation.word);
    sessionRef.current = new ManualSimulationSession(initialRuntime, cloneManualRuntime);

    syncSnapshot();
  };

  async function step(choiceId: string) {
    const session = sessionRef.current;
    if (!session || isApplyingStep) return;

    const currentRuntime = session.getState();
    const animator = automatonManager.getAnimator();

    const selected = animator.getManualChoices(currentRuntime).find(choice => choice.id === choiceId);
    if (!selected) return;

    session.commit(selected.nextRuntime);
    setIsApplyingStep(true);
    const success = await animator.applyManualChoice(selected);
    setIsApplyingStep(false);

    if (!success) return;

    syncSnapshot();
  };

  function undo() {
    const session = sessionRef.current;
    if (!session || isApplyingStep) return;

    const prevRuntime = session.undo();
    if (!prevRuntime) return;

    syncSnapshot();
  };

  function reset() {
    const session = sessionRef.current;
    if (!session || isApplyingStep) return;

    session.reset();
    syncSnapshot();
  };

  return {
    state,
    isApplyingStep,
    start,
    step,
    undo,
    reset,
  };
};
