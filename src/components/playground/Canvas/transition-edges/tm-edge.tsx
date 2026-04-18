import type { TmTransitionData } from '@/lib/automata/turing-machine/TmState';
import type { Edge, EdgeProps } from '@xyflow/react';
import { BaseEdge } from './base-edge';

export type TmTransitionEdgeType = Edge<{ transition: TmTransitionData[] }>;

export function TmEdge(props: EdgeProps<TmTransitionEdgeType>) {
  const { data, selected } = props;

  if (!data?.transition) return <BaseEdge {...props} />;

  return (
    <BaseEdge {...props}>
      {data.transition.map((t, i) => {
        const text = `${t.read}/${t.write},${t.move}`;
        if (!selected && i > 0) return null;
        return <p key={text}>{text}</p>;
      })}
      {!selected && data.transition.length > 1 && <div className="text-center -mt-3">...</div>}
    </BaseEdge>
  );
}
