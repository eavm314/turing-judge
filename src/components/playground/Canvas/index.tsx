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

import { useIsCoarsePointer, useIsMobile } from '@/hooks/use-media-query';
import { cn } from '@/lib/ui/utils';
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
import { FsmEdge, PdaEdge, TmEdge } from './transition-edges';
import { useCanvasHandlers } from './utils/use-canvas-handlers';
import { SwitchType } from './panel-components/switch-type';
import SimulationStack from './panel-components/simulation-stack';

const nodeTypes: NodeTypes = {
  state: StateNode,
};

const edgeTypes: EdgeTypes = {
  fsm: FsmEdge,
  pda: PdaEdge,
  tm: TmEdge,
};

const viewOptions: FitViewOptions = {
  minZoom: 0,
  maxZoom: 1,
};

const proOptions = { hideAttribution: true };

export default function Canvas() {
  const { theme } = useTheme();
  const { mode } = usePlaygroundMode();
  const isCoarsePointer = useIsCoarsePointer();
  const isMobile = useIsMobile();

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
        fitView
        fitViewOptions={viewOptions}
        proOptions={proOptions}
        nodesDraggable={isInteractive}
        nodesConnectable={isInteractive}
        elementsSelectable={isInteractive}
        zoomOnDoubleClick={!isCoarsePointer}
      >
        <Controls
          position="bottom-right"
          className={cn(mode === 'simulation' && 'max-md:hidden')}
        />
        <Background color={theme === 'light' ? 'black' : 'white'} />
        <Panel position="top-left" className="flex flex-col gap-2">
          <PlaygroundMode />
          {mode === 'states' && <AddState />}
          <div className="md:hidden">
            <SwitchType />
          </div>
        </Panel>
        <Panel position="top-center" className="max-md:hidden">
          <SwitchType />
        </Panel>
        {/* On mobile these render inside MobileSimulationOverlay instead, so
            they stack above the controls without overlapping */}
        {mode === 'simulation' && !isMobile && (
          <>
            <Panel position="bottom-center">
              <TuringTape />
            </Panel>
            <Panel position="bottom-left" className="!pointer-events-none">
              <SimulationStack />
            </Panel>
          </>
        )}
        <Panel position="top-right">
          <ControlsHelp />
        </Panel>
        <Panel position="bottom-left" className={cn(mode === 'simulation' && 'max-md:hidden')}>
          <DeterminismBadge />
        </Panel>
      </ReactFlow>
    </div>
  );
}
