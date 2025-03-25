"use client"

import {
  Background,
  Controls,
  ReactFlow,
  type ColorMode,
  type EdgeTypes,
  type FitViewOptions,
  type NodeTypes
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useTheme } from "next-themes";
import { FloatingConnectionLine } from "./floating-connection-line";
import { useCanvasHandlers } from "./utils/useCanvasHandlers";
import { PanelActions } from "./panel-actions";
import { StateNode } from "./state-node";
import { TransitionEdge } from "./transition-edge";

const nodeTypes: NodeTypes = {
  state: StateNode,
};

const edgeTypes: EdgeTypes = {
  transition: TransitionEdge,
};

const defaultEdgeOpts = {
  type: 'transition',
};

const viewOptions: FitViewOptions = {
  minZoom: 0,
  maxZoom: 1,
};

const proOptions = { hideAttribution: true };

export default function Canvas() {
  const { theme } = useTheme();

  const { nodes, edges, onConnect, onEdgesChange, onNodesChange } = useCanvasHandlers();

  return (
    <div className="flex-1 h-full">
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
        fitViewOptions={viewOptions}
        proOptions={proOptions}
      >
        <Controls position="bottom-right" />
        <Background color={theme === 'light' ? 'black' : 'white'} />
        <PanelActions />
      </ReactFlow>
    </div >
  )
}

