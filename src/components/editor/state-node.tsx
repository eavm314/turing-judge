import { Button } from "@/components/ui/button";
import { useAutomaton, useEditor } from "@/store/editor-context";
import {
  Handle,
  NodeToolbar,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { useCallback } from "react";

function CustomToolbar({ nodeId }: { nodeId: string }) {
  const { updateAutomaton } = useAutomaton();

  const handleClick = useCallback(() => {
    updateAutomaton((auto) => {
      auto.toggleFinal(nodeId);
    });
  }, [updateAutomaton, nodeId]);

  return (
    <NodeToolbar className="nopan">
      <div className="flex gap-1">
        <Button onClick={handleClick}>Final</Button>
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
  const { mode } = useEditor();
  return (
    <div className="relative flex items-center justify-center size-14">
      <div className={`relative grid rounded-full size-full border-2 bg-background 
      ${data.isFinal && `outline outline-2 -outline-offset-8`}
      ${selected ? 'border-green-500 outline-green-500' : `border-foreground outline-foreground`}
      `}>
        <div className="m-auto">{id}</div>
        {mode === "transition" &&
          <Handle style={customHandleStyles} type="source" position={Position.Top} />
        }
        <Handle style={customHandleStyles} type="source" position={Position.Top} isConnectable={false} />
        <Handle style={customHandleStyles} type="target" position={Position.Top} isConnectableStart={false} />
        <CustomToolbar nodeId={id} />
      </div>
      {data.isInitial &&
        <div className="absolute -left-[18px] flex flex-col gap-2">
          <div className="w-5 h-0.5 bg-foreground rotate-[30deg]"></div>
          <div className="w-5 h-0.5 bg-foreground -rotate-[30deg]"></div>
        </div>
      }
    </div>
  );
}