import { type FsmTransitionData } from '@/lib/automata/finite-state-machine/FsmState';
import type { Edge, EdgeProps } from '@xyflow/react';
import { BaseEdge } from './base-edge';

export type FsmTransitionEdgeType = Edge<{ transition: FsmTransitionData[] }>;

export function FsmEdge(props: EdgeProps<FsmTransitionEdgeType>) {
  const { data } = props;
  const content = data?.transition ? data.transition.map(t => t.input).join(',') : '';

  return <BaseEdge {...props}>{content}</BaseEdge>;
}
