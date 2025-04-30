import {
  Handle,
  NodeToolbar,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/ui/utils";
import {
  useAutomaton,
  usePlaygroundMode,
} from "@/providers/playground-provider";
import { useModal } from "@/providers/modal-provider";

function CustomToolbar({ nodeId, final }: { nodeId: string; final: boolean }) {
  const { updateAutomaton } = useAutomaton();

  const handleClick = () => {
    updateAutomaton((auto) => {
      auto.switchFinal(Number(nodeId));
    });
  };

  return (
    <NodeToolbar className="nopan -top-1" position={Position.Bottom}>
      <div className="flex gap-1">
        <Toggle
          className="p-2"
          variant="outline"
          pressed={final}
          onPressedChange={handleClick}
        >
          Final
        </Toggle>
      </div>
    </NodeToolbar>
  );
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
};

export type StateNodeType = Node<{
  name: string;
  isInitial: boolean;
  isFinal: boolean;
  visited?: boolean;
}>;

export function StateNode({ id, data, selected }: NodeProps<StateNodeType>) {
  const { mode } = usePlaygroundMode();
  const { showPrompt } = useModal();
  const { automaton, updateAutomaton } = useAutomaton();

  const handleChangeName = async () => {
    const stateName = await showPrompt({
      title: "Update State",
      inputLabel: "Enter the new name of the state:",
      defaultValue: data.name,
      validator: (value) => {
        if (value.length < 1 || value.length > 3)
          return "State name must contain 1 to 3 characters";
        if (value.match(/[^a-zA-Z0-9]/))
          return "State name can only contain letters and numbers";
        if (value !== data.name && automaton.stateToIndex.has(value))
          return "State name must be unique";
        return "";
      },
    });
    if (!stateName || stateName === data.name) return;

    updateAutomaton((auto) => {
      auto.renameState(Number(id), stateName);
    });
  };
  return (
    <div className="relative flex items-center justify-center size-24">
      {data.isInitial && (
        <div className="absolute -left-7 flex flex-col gap-3">
          <div className="w-8 h-0.5 bg-foreground rotate-[30deg]"></div>
          <div className="w-8 h-0.5 bg-foreground -rotate-[30deg]"></div>
        </div>
      )}
      <div
        className={cn(
          "relative grid rounded-full size-full border-2 bg-muted/80 border-foreground outline-foreground",
          data.isFinal && "outline outline-2 -outline-offset-[12px]",
          selected &&
            "border-4 outline-4 -outline-offset-[14px] border-green-500 outline-green-500",
          data.visited && "bg-amber-300 dark:bg-purple-900",
        )}
        onDoubleClick={handleChangeName}
      >
        <div className="m-auto text-2xl">{data.name}</div>
        {mode === "transitions" && (
          <Handle
            style={customHandleStyles}
            type="source"
            position={Position.Top}
          />
        )}
        <Handle
          style={customHandleStyles}
          type="source"
          position={Position.Top}
          isConnectable={false}
        />
        <Handle
          style={customHandleStyles}
          type="target"
          position={Position.Top}
          isConnectableStart={false}
        />
      </div>
      <CustomToolbar nodeId={id} final={data.isFinal} />
    </div>
  );
}
