"use client"

import { useCallback, useEffect } from "react";
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
  MarkerType,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { StateNode } from "./state-node";
import { TransitionEdge } from "./transition-edge";
import { FloatingConnectionLine } from "./floating-connection-line";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/store/useEditor";

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
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: 'Q1', type: 'state', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: 'Q2', type: 'state', position: { x: 0, y: 100 }, data: { label: '2' } },
    { id: 'Q3', type: 'state', position: { x: 100, y: 100 }, data: { label: '3' } },
    { id: 'Q4', type: 'state', position: { x: -100, y: 100 }, data: { label: '4' } },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([
    { id: 'e1-2', source: 'Q1', target: 'Q2' },
  ]);

  const onConnect = useCallback((edge: Edge | Connection) => setEdges((eds) => addEdge(edge, eds)), [setEdges]);

  const { mode, setMode } = useEditor();
  useEffect(() => {
    if (mode === 'transition') {
      setNodes(prev => prev.map(n => ({ ...n, selected: false })))
    }
  }, [mode])

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
          <Button onClick={() => setMode(mode === 'transition' ? 'state' : 'transition')}>
            {mode}
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  )
}

