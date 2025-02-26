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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { StateNode } from "./state-node";

const nodeTypes: NodeTypes = {
  state: StateNode,
}

export default function Canvas() {
  const { theme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(
    [
      { id: 'Q1', type: 'state', position: { x: 0, y: 0 }, data: { label: '1' } },
      { id: 'Q2', type: 'state', position: { x: 0, y: 100 }, data: { label: '2' } },
    ]
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

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
        fitView
      >
        <Controls position="bottom-right" />
        <Background />
      </ReactFlow>
    </div>
  )
}

