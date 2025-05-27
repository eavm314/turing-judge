import { type ConnectionLineComponentProps, type InternalNode } from '@xyflow/react';

import { getPath } from './utils/graphics';

export function FloatingConnectionLine({
  toX,
  toY,
  fromNode,
  toNode,
}: ConnectionLineComponentProps) {
  const temporalNode = {
    id: 'temporal',
    measured: fromNode.measured,
    internals: {
      positionAbsolute: { x: toX, y: toY },
    },
  };

  const [edgePath] = getPath(fromNode, toNode || (temporalNode as InternalNode));

  return (
    <g>
      <path fill="none" strokeWidth={1.8} className="animated stroke-foreground" d={edgePath} />
    </g>
  );
}
