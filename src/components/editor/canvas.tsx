"use client"

import { useCallback, useEffect, useState } from "react";
import {
  Controls,
  Background,
  ReactFlow,
  useEdgesState,
  useNodesState,
  addEdge,
  MarkerType,
  Panel,
  type ColorMode,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { StateNode } from "./state-node";
import { TransitionEdge } from "./transition-edge";
import { FloatingConnectionLine } from "./floating-connection-line";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/store/useEditor";
import { useAutomaton } from "@/store/useAutomaton";
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
    setNodes(newNodes);
    setEdges(newEdges);
  }, [automaton])

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges],
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
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
  }, [updateAutomaton]);

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

