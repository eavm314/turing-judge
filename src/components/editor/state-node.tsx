import {
  Handle,
  NodeToolbar,
  Position,
  type Node,
  type NodeProps,
  type NodeToolbarProps,
} from "@xyflow/react"
import { Button } from "@/components/ui/button";
import { useEditor } from "@/store/useEditor";

function CustomToolbar({ isVisible }: NodeToolbarProps) {
  return (
    <NodeToolbar isVisible={isVisible}>
      <div className="flex gap-1">
        <Button>Final</Button>
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

type StateNodeData = Node<{
  isInitial: boolean,
  isFinal: boolean,
}>

export function StateNode({ id, data, selected }: NodeProps<StateNodeData>) {
  const { mode } = useEditor();
  return (
    <div className={`relative grid rounded-full size-12 border-2 bg-background ${selected ? 'border-green-500' : 'border-foreground'}`}>
      <div className="m-auto">{id}</div>
      {mode === "transition" &&
        <Handle style={customHandleStyles} type="source" position={Position.Top} />
      }
      <Handle style={customHandleStyles} type="source" position={Position.Top} isConnectable={false} />
      <Handle style={customHandleStyles} type="target" position={Position.Top} isConnectableStart={false} />
      <CustomToolbar />
    </div>
  );
}