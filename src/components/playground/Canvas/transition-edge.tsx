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
import { PdaTransitionData } from '@/lib/automata/pushdown-automaton/PdaState';
import { EPSILON } from '@/constants/symbols';

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

  const name = `${sourceNode?.data.name}->${targetNode?.data.name}`;

  const isRunning = useRef(false);

  useEffect(() => {
    if (name === visitedTransition) {
      if (!isRunning.current) {
        animateRef.current?.beginElement();
        isRunning.current = true;
      }
    } else {
      isRunning.current = false;
    }
  }, [visitedTransition, name]);

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
      {name === visitedTransition && (
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
          data-testid={name}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: isInteractive ? 'all' : 'none',
          }}
          className={cn(
            'nopan bg-background px-2 border rounded-md cursor-pointer font-mono z-10',
            selected ? 'border-green-500' : 'border-foreground',
          )}
          onDoubleClick={handleEditTransition}
        >
          {automaton.type === 'FSM' && data!.transition.map(t => t.input).join(',')}
          {automaton.type === 'PDA' && (
            <>
              {data!.transition.map((t, i) => {
                const pt = t as PdaTransitionData;
                const text = `${t.input},${pt.pop}/${pt.push.length > 0 ? pt.push.join('') : EPSILON}`;
                if (!selected && i > 0) return null;
                return <p key={text}>{text}</p>;
              })}
              {!selected && data!.transition.length > 1 && (
                <div className="text-center -mt-3">...</div>
              )}
            </>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
