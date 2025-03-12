import { FiniteStateMachine } from "@/lib/automaton/FiniteStateMachine";
import { type StateNodeType } from "../state-node";
import { type TransitionEdgeType } from "../transition-edge";
import { type Node } from "@xyflow/react";

export const fsmToFlow = (fsm: FiniteStateMachine, prevNodes: Node[]) => {
  const prevMap = new Map(prevNodes.filter(n => n.selected).map(n => [n.id, n]));
  const nodes: StateNodeType[] = fsm.states.values().map(st => {
    return {
      id: st.name,
      type: "state",
      position: st.position,
      selected: prevMap.has(st.name),
      data: {
        isFinal: st.isFinal,
        isInitial: st.name === fsm.initial,
      }
    }
  }).toArray();


  const edges: TransitionEdgeType[] = fsm.states.values().flatMap(st => {
    const obj = st.transitions.entries().reduce((acc, [symbol, targets]) => {
      targets.forEach(target => {
        const key = `${st.name}->${target}`;
        acc[key] = acc[key] ?
          {
            id: key,
            source: st.name,
            target,
            data: { symbols: [...acc[key].data!.symbols, symbol] }
          } :
          {
            id: key,
            source: st.name,
            target,
            data: { symbols: [symbol] }
          };
      });
      return acc
    }, {} as Record<string, TransitionEdgeType>)
    return Object.values(obj);
  }).toArray();

  return { nodes, edges }
}