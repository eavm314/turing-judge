import { useAutomaton, useEditorMode } from "@/providers/editor-provider";
import {
  Handle,
  NodeToolbar,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { useCallback } from "react";
import { Toggle } from "@/components/ui/toggle";

function CustomToolbar({ nodeId, final }: { nodeId: string, final: boolean }) {
  const { updateAutomaton } = useAutomaton();

  const handleClick = useCallback(() => {
    updateAutomaton((auto) => {
      auto.toggleFinal(nodeId);
    });
  }, [updateAutomaton, nodeId]);

  return (
    <NodeToolbar className="nopan -top-1" position={Position.Bottom}>
      <div className="flex gap-1">
        <Toggle className="p-2"
          variant="outline"
          pressed={final}
          onPressedChange={handleClick}>
          Final
        </Toggle>
      </div>
    </NodeToolbar>
  )
}

const customHandleStyles = {
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  borderRadius: 0,
  transform: "none",
  border: "none",
  opacity: 0,
}

export type StateNodeType = Node<{
  isInitial: boolean,
  isFinal: boolean,
}>

export function StateNode({ id, data, selected }: NodeProps<StateNodeType>) {
  const { mode } = useEditorMode();
  return (
    <div className="relative flex items-center justify-center size-24">
      {data.isInitial &&
        <div className="absolute -left-7 flex flex-col gap-3">
          <div className="w-8 h-0.5 bg-foreground rotate-[30deg]"></div>
          <div className="w-8 h-0.5 bg-foreground -rotate-[30deg]"></div>
        </div>
      }
      <div className={`relative grid rounded-full size-full border-2 bg-background 
        ${data.isFinal ? 'outline outline-2 -outline-offset-[12px]' : ''}
        ${selected ? 'border-remark outline-remark' : `border-foreground outline-foreground`}
      `}>
        <div className="m-auto text-2xl">{id}</div>
        {mode === "transitions" &&
          <Handle style={customHandleStyles} type="source" position={Position.Top} />
        }
        <Handle style={customHandleStyles} type="source" position={Position.Top} isConnectable={false} />
        <Handle style={customHandleStyles} type="target" position={Position.Top} isConnectableStart={false} />
        <CustomToolbar nodeId={id} final={data.isFinal} />
      </div>
    </div>
  );
}