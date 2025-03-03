"use client"

import { useCallback } from "react";
import {
  Controls,
  Background,
  ReactFlow,
  useEdgesState,
  useNodesState,
  addEdge,
  type ColorMode,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { StateNode } from "./state-node";
import { TransitionEdge } from "./transition-edge";

const nodeTypes: NodeTypes = {
  state: StateNode,
}

const edgeTypes: EdgeTypes = {
  transition: TransitionEdge,
}

export default function Canvas() {
  const { theme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(
    [
      { id: 'Q1', type: 'state', position: { x: 0, y: 0 }, data: { label: '1' } },
      { id: 'Q2', type: 'state', position: { x: 0, y: 100 }, data: { label: '2' } },
    ]
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([{ id: 'e1-2', type: 'transition', source: 'Q1', target: 'Q2' }]);

  const onConnect = useCallback((edge: Edge | Connection) => setEdges((eds) => addEdge(edge, eds)), [setEdges]);

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
        fitView
      >
        <Controls position="bottom-right" />
        <Background />
      </ReactFlow>
    </div>
  )
}

