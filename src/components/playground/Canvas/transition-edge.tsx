import {
  EdgeLabelRenderer,
  useInternalNode,
  type Edge,
  type EdgeProps
} from '@xyflow/react';
import { getPath } from './utils/graphics';

export type TransitionEdgeType = Edge<{
  symbols: string[],
}>

export function TransitionEdge({ id, source, target, style, data, selected }: EdgeProps<TransitionEdgeType>) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const [edgePath, labelX, labelY] = getPath(sourceNode, targetNode);

  return (
    <>
      <defs>
        <marker
          id={`triangle-${id}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="5"
          markerHeight="5"
          orient="auto">
          <path d="M 0 0 L 10 5 L 0 10" fill={`hsl(var(${selected ? '--remark' : '--foreground'}))`} />
        </marker>
      </defs>
      <path
        fill="none"
        id={id}
        strokeWidth={2}
        className={`${selected ? 'stroke-remark' : 'stroke-foreground'}`}
        d={edgePath}
        markerEnd={`url(#triangle-${id})`}
        style={style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={`nopan bg-background px-2 border rounded-md cursor-pointer ${selected ? 'border-remark' : 'border-foreground'}`}
        >
          {data?.symbols.join(',')}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}