import {
  EdgeLabelRenderer,
  useInternalNode,
  type Edge,
  type EdgeProps
} from '@xyflow/react';
import { getPath } from './utils/graphics';
import { cn } from '@/lib/ui/utils';
import { useEffect, useRef } from 'react';
import { useAddTransitionPrompt } from '@/components/modal/use-add-transition';
import { useAutomaton } from '@/providers/playground-provider';

export type TransitionEdgeType = Edge<{
  symbols: string[],
  visited?: boolean,
}>

export function TransitionEdge({ id, source, target, style, data, selected }: EdgeProps<TransitionEdgeType>) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  const animateRef = useRef<SVGAnimateMotionElement>(null);

  const addTransitionPrompt = useAddTransitionPrompt();
  const { automaton, updateAutomaton } = useAutomaton();

  useEffect(() => {
    if (data?.visited && animateRef.current) {
      animateRef.current.beginElement();
    }
  }, [data?.visited]);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const [edgePath, labelX, labelY] = getPath(sourceNode, targetNode);

  const handleEditTransition = async () => {
    const initialSymbols = automaton.getTransition(Number(source), Number(target));
    const symbols = await addTransitionPrompt({ alphabet: automaton.alphabet, initialSymbols });
    if (!symbols) return;
    updateAutomaton((auto) => {
      auto.removeTransition(Number(source), Number(target));
      auto.addTransition(Number(source), Number(target), symbols);
    });
  }

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
          <path d="M 0 0 L 10 5 L 0 10" className={selected ? 'fill-green-500' : 'fill-foreground'} />
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
      {data?.visited &&
        <circle r="8" className="fill-amber-400 dark:fill-purple-800">
          <animateMotion ref={animateRef} dur="800ms" repeatCount={1} path={edgePath} />
        </circle>
      }
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={cn("nopan bg-background px-2 border rounded-md cursor-pointer font-mono",
            selected ? 'border-green-500' : 'border-foreground')}
          onDoubleClick={handleEditTransition}
        >
          {data?.symbols.join(',')}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}