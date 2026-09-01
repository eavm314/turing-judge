import { useLayoutEffect, useRef, useState } from 'react';

import { Handle, NodeToolbar, Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react';

import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/ui/utils';
import {
  useAutomatonDesign,
  usePlaygroundMode,
  useVisitedState,
} from '@/providers/playground-provider';
import { useModal } from '@/providers/modal-provider';
import { stateValidator } from './panel-components/add-state';

function CustomToolbar({
  nodeId,
  final,
  onRename,
}: {
  nodeId: string;
  final: boolean;
  onRename: () => void;
}) {
  const { updateDesign: updateAutomaton } = useAutomatonDesign();
  const { deleteElements } = useReactFlow();

  const handleClick = () => {
    updateAutomaton(auto => {
      auto.switchFinal(Number(nodeId));
    });
  };

  return (
    <NodeToolbar className="nopan -top-1" position={Position.Bottom}>
      <div className="flex gap-1">
        <Toggle
          className="h-9 p-2"
          variant="outline"
          pressed={final}
          onPressedChange={handleClick}
        >
          Final
        </Toggle>
        <Button
          variant="outline"
          size="icon"
          className="size-9 bg-background"
          onClick={onRename}
          aria-label="Rename state"
        >
          <Pencil className="!size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-9 bg-background text-destructive hover:text-destructive"
          onClick={() => deleteElements({ nodes: [{ id: nodeId }] })}
          aria-label="Delete state"
        >
          <Trash2 className="!size-4" />
        </Button>
      </div>
    </NodeToolbar>
  );
}

function useLabelScale(label: string) {
  const ref = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const available = ref.current?.parentElement?.clientWidth ?? 0;
    const width = ref.current?.scrollWidth ?? 0;
    if (!available || !width) return;
    setScale(Math.min(1, available / width));
  }, [label]);

  return { ref, scale };
}

const customHandleStyles = {
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  borderRadius: 0,
  transform: 'none',
  border: 'none',
  opacity: 0,
};

export type StateNodeType = Node<{
  name: string;
  isInitial: boolean;
  isFinal: boolean;
}>;

export function StateNode({ id, data, selected }: NodeProps<StateNodeType>) {
  const { mode } = usePlaygroundMode();
  const { showPrompt } = useModal();
  const { automaton, updateDesign } = useAutomatonDesign();
  const visitedState = useVisitedState();
  const { ref: labelRef, scale: labelScale } = useLabelScale(data.name);

  const handleChangeName = async () => {
    const stateName = await showPrompt({
      title: 'Update State',
      inputLabel: 'Enter the new name of the state:',
      defaultValue: data.name,
      validator: value => stateValidator(value, automaton),
    });
    if (!stateName || stateName === data.name) return;

    updateDesign(auto => {
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
        data-testid={data.name}
        className={cn(
          'relative grid place-items-center rounded-full size-full border-2 bg-muted/80 border-foreground outline-foreground',
          data.isFinal && 'outline outline-2 -outline-offset-[12px]',
          selected &&
            'border-4 outline-4 -outline-offset-[14px] border-green-500 outline-green-500',
          data.name === visitedState && 'bg-amber-300 dark:bg-purple-900',
        )}
        onDoubleClick={handleChangeName}
      >
        <div className="flex justify-center w-[80%] text-center">
          <span
            ref={labelRef}
            className="inline-block origin-center whitespace-nowrap text-2xl"
            style={{ transform: `scale(${labelScale})` }}
          >
            {data.name}
          </span>
        </div>
        {mode === 'transitions' && (
          <Handle style={customHandleStyles} type="source" position={Position.Top} />
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
      <CustomToolbar nodeId={id} final={data.isFinal} onRename={handleChangeName} />
    </div>
  );
}
