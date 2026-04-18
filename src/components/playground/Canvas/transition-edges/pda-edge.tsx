import { EPSILON } from '@/constants/symbols';
import type { PdaTransitionData } from '@/lib/automata/pushdown-automaton/PdaState';
import type { Edge, EdgeProps } from '@xyflow/react';
import { BaseEdge } from './base-edge';

export type PdaTransitionEdgeType = Edge<{ transition: PdaTransitionData[] }>;

export function PdaEdge(props: EdgeProps<PdaTransitionEdgeType>) {
  const { data, selected } = props;

  if (!data?.transition) return <BaseEdge {...props} />;

  return (
    <BaseEdge {...props}>
      {data.transition.map((t, i) => {
        const text = `${t.input},${t.pop}/${t.push.length > 0 ? t.push.join('') : EPSILON}`;
        if (!selected && i > 0) return null;
        return <p key={text}>{text}</p>;
      })}
      {!selected && data.transition.length > 1 && <div className="text-center -mt-3">...</div>}
    </BaseEdge>
  );
}
