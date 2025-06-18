'use client';

import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  type ColorMode,
  type EdgeTypes,
  type FitViewOptions,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';

import { usePlaygroundMode } from '@/providers/playground-provider';
import { FloatingConnectionLine } from './floating-connection-line';
import {
  AddState,
  ControlsHelp,
  DeterminismBadge,
  PlaygroundMode,
  TuringTape,
} from './panel-components';
import { StateNode } from './state-node';
import { TransitionEdge } from './transition-edge';
import { useCanvasHandlers } from './utils/use-canvas-handlers';
import { SwitchType } from './panel-components/switch-type';

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
  const { mode } = usePlaygroundMode();

  const isInteractive = mode !== 'simulation' && mode !== 'viewer';

  const { nodes, edges, onConnect, onEdgesChange, onNodesChange } = useCanvasHandlers();

  return (
    <div className="flex-1">
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
        nodesDraggable={isInteractive}
        nodesConnectable={isInteractive}
        elementsSelectable={isInteractive}
      >
        <Controls position="bottom-right" />
        <Background color={theme === 'light' ? 'black' : 'white'} />
        <Panel position="top-left" className="flex flex-col gap-2">
          <PlaygroundMode />
          {mode === 'states' && <AddState />}
        </Panel>
        <Panel position="top-center">
          <SwitchType />
        </Panel>
        <Panel position="top-right">
          <ControlsHelp />
        </Panel>
        <Panel position="bottom-left">
          <DeterminismBadge />
        </Panel>
        {mode === 'simulation' && (
          <Panel position="bottom-center">
            <TuringTape />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
