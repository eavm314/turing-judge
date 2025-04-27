import { FiniteStateMachine } from "@/lib/automaton/FiniteStateMachine";
import { type StateNodeType } from "../state-node";
import { type TransitionEdgeType } from "../transition-edge";
import { type Node } from "@xyflow/react";

export const fsmToFlow = (fsm: FiniteStateMachine, prevNodes: Node[]) => {
  const prevMap = new Map(prevNodes.filter(n => n.selected).map(n => [Number(n.id), n]));
  const nodes: StateNodeType[] = fsm.states.values().map(st => {
    return {
      id: String(st.id),
      type: "state",
      position: st.position,
      selected: prevMap.has(st.id),
      data: {
        name: st.name,
        isFinal: st.isFinal,
        isInitial: st.id === 0,
      }
    }
  }).toArray();


  const edges: TransitionEdgeType[] = fsm.states.values().flatMap(st => {
    const obj = st.transitions.entries().reduce((acc, [symbol, targets]) => {
      targets.forEach(target => {
        const key = `${st.id}->${target}`;
        acc[key] = acc[key]?.data ?
          {
            id: key,
            source: String(st.id),
            target: String(target),
            data: { symbols: [...acc[key].data.symbols, symbol] }
          } :
          {
            id: key,
            source: String(st.id),
            target: String(target),
            data: { symbols: [symbol] }
          };
      });
      return acc
    }, {} as Record<string, TransitionEdgeType>)
    return Object.values(obj);
  }).toArray();

  return { nodes, edges }
}