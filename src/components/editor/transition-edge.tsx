import {
  getBezierPath,
  useInternalNode,
  type Edge,
  type EdgeProps,
} from '@xyflow/react';
import { getEdgeParams } from './utils/graphics';

export type TransitionEdgeType = Edge<{
  symbols: string[],
}>
 
export function TransitionEdge({ id, source, target, markerEnd, style }: EdgeProps<TransitionEdgeType>) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
 
  if (!sourceNode || !targetNode) {
    return null;
  }
 
  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );
 
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });
 
  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  );
}