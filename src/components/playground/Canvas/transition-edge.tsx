import { useAddTransitionPrompt } from '@/components/modal/add-transition';
import { cn } from '@/lib/ui/utils';
import {
  useAutomatonDesign,
  usePlaygroundMode,
  useVisitedTransition,
} from '@/providers/playground-provider';
import { EdgeLabelRenderer, useInternalNode, type Edge, type EdgeProps } from '@xyflow/react';
import { useEffect, useRef } from 'react';
import { getPath } from './utils/graphics';
import { type TransitionData } from '@/lib/automata/base/BaseState';

export type TransitionEdgeType = Edge<{ transition: TransitionData[] }>;

export function TransitionEdge({
  id,
  source: sourceId,
  target: targetId,
  style,
  data,
  selected,
}: EdgeProps<TransitionEdgeType>) {
  const sourceNode = useInternalNode(sourceId);
  const targetNode = useInternalNode(targetId);

  const animateRef = useRef<SVGAnimateMotionElement>(null);

  const addTransitionPrompt = useAddTransitionPrompt();
  const { automaton, updateDesign } = useAutomatonDesign();
  const { visitedTransition, simulationSpeed } = useVisitedTransition();
  const { mode } = usePlaygroundMode();
  const isInteractive = mode !== 'simulation' && mode !== 'viewer';

  useEffect(() => {
    if (id === visitedTransition && animateRef.current) {
      animateRef.current.beginElement();
    }
  }, [visitedTransition]);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const [edgePath, labelX, labelY] = getPath(sourceNode, targetNode);

  const handleEditTransition = async () => {
    if (!isInteractive) return;
    const source = Number(sourceId);
    const target = Number(targetId);
    const transitionData = await addTransitionPrompt({ source, target });
    if (!transitionData) return;
    updateDesign(auto => {
      auto.removeTransition(source, target);
      auto.addTransition(source, target, transitionData);
    });
  };

  const testId = `${sourceNode.data.name}->${targetNode.data.name}`;

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
          orient="auto"
        >
          <path
            d="M 0 0 L 10 5 L 0 10"
            className={selected ? 'fill-green-500' : 'fill-foreground'}
          />
        </marker>
      </defs>
      <path
        fill="none"
        id={id}
        className={selected ? 'stroke-green-500 stroke-[3px]' : 'stroke-foreground stroke-2'}
        d={edgePath}
        markerEnd={`url(#triangle-${id})`}
        style={style}
      />
      {id === visitedTransition && (
        <circle r="8" className="fill-amber-400 dark:fill-purple-800">
          <animateMotion
            ref={animateRef}
            dur={`${simulationSpeed}ms`}
            repeatCount={1}
            path={edgePath}
          />
        </circle>
      )}
      <EdgeLabelRenderer>
        <div
          data-testid={testId}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: isInteractive ? 'all' : 'none',
          }}
          className={cn(
            'nopan bg-background px-2 border rounded-md cursor-pointer font-mono',
            selected ? 'border-green-500' : 'border-foreground',
          )}
          onDoubleClick={handleEditTransition}
        >
          {data?.transition.map(t => t.input).join(',')}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
