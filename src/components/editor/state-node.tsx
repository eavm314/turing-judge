import { 
  Handle,
  Position,
  type Node,
  type NodeProps, 
} from "@xyflow/react"

export type StateNodeData = Node<{
  isInitial: boolean,
  isFinal: boolean,
}>

export function StateNode({ id, data }: NodeProps<StateNodeData>) {
  return (
    <div className="grid rounded-full size-12 border-2 border-foreground bg-background">
      <div className="m-auto">{id}</div>
      <Handle className="opacity-0" type="source" position={Position.Top} />
      <Handle className="opacity-0" type="target" position={Position.Top} />
    </div>
  );
}