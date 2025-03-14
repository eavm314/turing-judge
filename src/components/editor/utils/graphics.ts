import {
  type InternalNode
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

  const p = 0.1; // Curvature
  const cx = (x1 + x2) / 2 + p * (y2 - y1);
  const cy = (y1 + y2) / 2 - p * (x2 - x1);

  const d1 = Math.sqrt((cx - x1) ** 2 + (cy - y1) ** 2);
  const d2 = Math.sqrt((cx - x2) ** 2 + (cy - y2) ** 2);

  const sx = x1 + (radius * (cx - x1)) / d1;
  const sy = y1 + (radius * (cy - y1)) / d1;
  const tx = x2 - (radius * (x2 - cx)) / d2;
  const ty = y2 - (radius * (y2 - cy)) / d2;

  return {
    sx,
    sy,
    cx,
    cy,
    tx: isTemporal ? tPos.x : tx,
    ty: isTemporal ? tPos.y : ty,
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

function getCurvedPath(source: InternalNode, target: InternalNode): [path: string, labelX: number, labelY: number] {
  const { sx, sy, cx, cy, tx, ty } = getNodeIntersections(source, target);
  const path = `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
  const labelX = 0.25 * sx + 0.5 * cx + 0.25 * tx;
  const labelY = 0.25 * sy + 0.5 * cy + 0.25 * ty;
  return [path, labelX, labelY];
}

export function getPath(source: InternalNode, target: InternalNode) {
  if (source.id === target.id) {
    return getAutoConnectionPath(source);
  }

  return getCurvedPath(source, target);
}