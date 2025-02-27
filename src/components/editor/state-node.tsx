import { 
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
    </div>
  );
}