"use client"

import { useCallback } from "react";
import {
  type ColorMode,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Connection,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";

export function Canvas() {
  const { theme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(
    [
      { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
      { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
    ]
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback((edge: Edge | Connection) => setEdges((eds) => addEdge(edge, eds)), [setEdges]);

  return (
    <div className="flex-1 h-[600px]">
      <ReactFlow
        suppressHydrationWarning
        colorMode={theme as ColorMode}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  )
}

