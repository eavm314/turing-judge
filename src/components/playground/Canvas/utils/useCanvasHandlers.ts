import {
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useAddTransitionPrompt } from "@/components/modal/add-transition";
import { useToast } from "@/hooks/use-toast";
import {
  useAutomaton,
  usePlaygroundMode,
} from "@/providers/playground-provider";
import { useCallback, useEffect, useState } from "react";
import { fsmToFlow } from "./transformations";
import { TransitionEdgeType } from "../transition-edge";

export const useCanvasHandlers = () => {
  const { automaton, updateAutomaton } = useAutomaton();
  const { mode } = usePlaygroundMode();

  const addTransitionPrompt = useAddTransitionPrompt();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = fsmToFlow(automaton, nodes);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [automaton]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      if (
        changes.some((change) => change.type === "position" && !change.dragging)
      ) {
        updateAutomaton((auto) => {
          changes.forEach((change) => {
            if (change.type === "position") {
              auto.moveState(Number(change.id), change.position!);
            }
          });
        });
      } else if (changes.some((change) => change.type === "remove")) {
        updateAutomaton((auto) => {
          changes.forEach((change) => {
            if (change.type === "remove") {
              if (Number(change.id) !== 0) {
                auto.removeState(Number(change.id));
              } else {
                toast({
                  title: "Initial state cannot be removed",
                  variant: "warning",
                });
              }
            }
          });
        });
      } else {
        setNodes((nds) => applyNodeChanges(changes, nds));
      }
    },
    [setNodes, updateAutomaton],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      if (changes.some((change) => change.type === "remove")) {
        updateAutomaton((auto) => {
          changes.forEach((change) => {
            if (change.type === "remove") {
              const [source, target] = change.id.split("->");
              auto.removeTransition(Number(source), Number(target));
            }
          });
        });
      } else {
        setEdges((eds) => applyEdgeChanges(changes, eds));
      }
    },
    [setEdges, updateAutomaton],
  );

  const onConnect: OnConnect = useCallback(
    async (connection) => {
      const initialSymbols = automaton.getTransition(
        Number(connection.source),
        Number(connection.target),
      );
      const symbols = await addTransitionPrompt({
        alphabet: automaton.alphabet,
        initialSymbols,
      });
      if (!symbols) return;
      updateAutomaton((auto) => {
        auto.removeTransition(
          Number(connection.source),
          Number(connection.target),
        );
        auto.addTransition(
          Number(connection.source),
          Number(connection.target),
          symbols,
        );
      });
    },
    [automaton, updateAutomaton],
  );

  useEffect(() => {
    if (mode !== "states") {
      setNodes((prev) => prev.map((n) => ({ ...n, selected: false })));
    }
    if (mode === "simulation") {
      setEdges((prev) => prev.map((e) => ({ ...e, selected: false })));
    }
  }, [mode]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  };
};
