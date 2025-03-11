import { DFA } from "@/lib/automaton/DFA";
import { type StateNodeType } from "../state-node";
import { type TransitionEdgeType } from "../transition-edge";
import { type Node } from "@xyflow/react";

export const dfaToFlow = (dfa: DFA, prevNodes: Node[]) => {
  const prevMap = new Map(prevNodes.filter(n => n.selected).map(n => [n.id, n]));
  const nodes: StateNodeType[] = dfa.states.values().map(st => {
    return {
      id: st.name,
      type: "state",
      position: st.position,
      selected: prevMap.has(st.name),
      data: {
        isFinal: st.isFinal,
        isInitial: st.name === dfa.initial,
      }
    }
  }).toArray();


  const edges: TransitionEdgeType[] = dfa.states.values().flatMap(st => {
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