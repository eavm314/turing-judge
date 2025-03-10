"use client"

import { Button } from "@/components/ui/button";
import { useAutomaton } from "@/store/useAutomaton";
import { useEditor } from "@/store/useEditor";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
  type ColorMode,
  type Edge,
  type EdgeTypes,
  type Node,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type NodePositionChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { FloatingConnectionLine } from "./floating-connection-line";
import { StateNode } from "./state-node";
import { TransitionEdge } from "./transition-edge";
import { dfaToFlow } from "./utils/transformations";

const nodeTypes: NodeTypes = {
  state: StateNode,
}

const edgeTypes: EdgeTypes = {
  transition: TransitionEdge,
}

const defaultEdgeOpts = {
  type: 'transition',
  markerEnd: { type: MarkerType.ArrowClosed },
}

export default function Canvas() {
  const { theme } = useTheme();
  const { automaton, updateAutomaton } = useAutomaton();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = dfaToFlow(automaton);
    
    const mergedNodes = Object.values(
      [...nodes, ...newNodes].reduce((acc, obj) => {
        acc[obj.id] = { ...acc[obj.id], ...obj }; 
        return acc;
      }, {} as Record<string, Node>)
    );
    setNodes(mergedNodes);
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
            if (change.type === 'remove') {
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
    (connection) => {
      const symbols = prompt("Enter symbols separated by commas:");
      if (!symbols) return;
      const symbolsArr = symbols.split(',').map(s => s.trim());
      updateAutomaton((auto) => {
        auto.addTransition(connection.source, connection.target, symbolsArr);
      });
    },
    [setEdges],
  );

  const handleAddState = useCallback(() => {
    const stateName = prompt("Enter State Name:");
    if (!stateName) return;
    if (!automaton.states.has(stateName)) {
      updateAutomaton((auto) => {
        auto.addState({
          name: stateName,
          position: { x: 0, y: 0 },
          transitions: {}
        });
      });
    } else {
      alert("State name must be unique");
    }
  }, [automaton.states, updateAutomaton]);

  const { mode, setMode } = useEditor();

  useEffect(() => {
    if (mode === 'transition') {
      setNodes(prev => prev.map(n => ({ ...n, selected: false })))
    }
  }, [mode]);

  return (
    <div className="flex-1 h-[600px]">
      <ReactFlow
        colorMode={theme as ColorMode}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={FloatingConnectionLine}
        defaultEdgeOptions={defaultEdgeOpts}
        fitView
      >
        <Controls position="bottom-right" />
        <Background />
        <Panel>
          <div className="flex flex-col gap-2">
            <Button onClick={() => setMode(mode === 'transition' ? 'state' : 'transition')}>
              Mode: {mode}
            </Button>
            {mode === 'state' &&
              <Button onClick={handleAddState}>
                Add State
              </Button>
            }
          </div>
        </Panel>
      </ReactFlow>
    </div >
  )
}

