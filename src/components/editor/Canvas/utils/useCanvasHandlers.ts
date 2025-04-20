import { useAutomaton, useEditorMode } from "@/providers/editor-provider";
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import { fsmToFlow } from "./transformations";
import { useAddTransitionPrompt } from "@/components/modal/use-add-transition";

export const useCanvasHandlers = () => {
  const { automaton, updateAutomaton } = useAutomaton();
  const { mode } = useEditorMode();

  const addTransitionPrompt = useAddTransitionPrompt();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = fsmToFlow(automaton, nodes);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [automaton])

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      if (changes.some((change) => change.type === 'position' && !change.dragging)) {
        updateAutomaton((auto) => {
          changes.forEach((change) => {
            if (change.type === 'position') {
              const state = auto.states.get(change.id);
              state?.setPosition(change.position!);
            }
          });
        });
      } else if (changes.some((change) => change.type === 'remove')) {
        updateAutomaton((auto) => {
          changes.forEach((change) => {
            if (change.type === 'remove' && change.id !== auto.initial) {
              auto.removeState(change.id);
            }
          });
        });
      } else {
        setNodes((nds) => applyNodeChanges(changes, nds));
      }
    },
    [setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      if (changes.some((change) => change.type === 'remove')) {
        updateAutomaton((auto) => {
          changes.forEach((change) => {
            if (change.type === 'remove') {
              const [source, target] = change.id.split('->');
              auto.removeTransition(source, target);
            }
          });
        });
      } else {
        setEdges((eds) => applyEdgeChanges(changes, eds));
      }
    },
    [setEdges],
  );

  const onConnect: OnConnect = useCallback(
    async (connection) => {
      const symbols = await addTransitionPrompt(automaton);
      if (!symbols) return;
      updateAutomaton((auto) => {
        auto.addTransition(connection.source, connection.target, symbols);
      });
    },
    [automaton],
  );

  useEffect(() => {
    if (mode === 'transitions') {
      setNodes(prev => prev.map(n => ({ ...n, selected: false })))
    }
  }, [mode]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  }
}