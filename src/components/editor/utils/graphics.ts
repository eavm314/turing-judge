import {
  getStraightPath,
  type InternalNode,
  type XYPosition,
} from '@xyflow/react';

// this helper function returns the intersection points
// of the line between the center of the intersectionNode and the target node
function getNodeIntersections(sourceNode: InternalNode, targetNode: InternalNode) {
  const isTemporal = targetNode.id === 'temporal';
  const { width } = sourceNode.measured;

  const sPos = sourceNode.internals.positionAbsolute;
  const tPos = targetNode.internals.positionAbsolute;

  const radius = width! / 2;

  const x1 = sPos.x + radius;
  const y1 = sPos.y + radius;
  const x2 = tPos.x + radius;
  const y2 = tPos.y + radius;

  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const x = (radius * (x2 - x1)) / distance;
  const y = (radius * (y2 - y1)) / distance;

  return { 
    sx: x1+x, 
    sy: y1+y, 
    tx: isTemporal? tPos.x : x2-x, 
    ty: isTemporal? tPos.y : y2-y 
  };
}

function getAutoConnectionPath(node: InternalNode): [path: string, labelX: number, labelY: number] {
  const { x, y } = node.internals.positionAbsolute;
  const { width, height } = node.measured;
  const nx = x + width! / 2;
  const ny = y + height! / 2;
  const path = `M ${27 + nx} ${-40 + ny} C ${35 + nx} ${-90 + ny} ${-35 + nx} ${-90 + ny} ${-27 + nx} ${-40 + ny}`;
  const labelX = nx;
  const labelY = ny - 76;
  return [path, labelX, labelY];
}

type BezierPathParams = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curvature?: number;
};

function getBezierPath({ x1, y1, x2, y2, curvature = 0.5 }: BezierPathParams): [path: string, labelX: number, labelY: number] {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Control points positioned to create a smooth curve
  const cx1 = x1 + dx * curvature;
  const cy1 = y1 - dy * curvature;
  const cx2 = x2 - dx * curvature;
  const cy2 = y2 + dy * curvature;

  const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  return [path, 0, 0];
}

export function getPath(source: InternalNode, target: InternalNode) {
  if (source.id === target.id) {
    return getAutoConnectionPath(source);
  }
  const { sx, sy, tx, ty } = getNodeIntersections(source, target);
  return getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });
}