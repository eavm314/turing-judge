import { useCallback, useEffect, useState } from 'react';

import {
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '@xyflow/react/dist/style.css';

import { useAddTransitionPrompt } from '@/components/modal/add-transition';
import { useToast } from '@/hooks/use-toast';
import { useAutomatonDesign, usePlaygroundMode } from '@/providers/playground-provider';

export const useCanvasHandlers = () => {
  const { automaton, updateDesign } = useAutomatonDesign();
  const { mode } = usePlaygroundMode();

  const addTransitionPrompt = useAddTransitionPrompt();
  const { toast } = useToast();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    setNodes(prev => {
      const selected = new Set(prev.filter(node => node.selected).map(node => node.id));
      return automaton.nodes.map(node => ({ ...node, selected: selected.has(node.id) }));
    });
    setEdges(automaton.edges);
  }, [automaton]);

  const onNodesChange: OnNodesChange = useCallback(
    changes => {
      if (changes.some(change => change.type === 'position' && !change.dragging)) {
        updateDesign(auto => {
          changes.forEach(change => {
            if (change.type === 'position') {
              auto.moveState(Number(change.id), change.position!);
            }
          });
        });
      } else if (changes.some(change => change.type === 'remove')) {
        updateDesign(auto => {
          changes.forEach(change => {
            if (change.type === 'remove') {
              if (Number(change.id) !== 0) {
                auto.removeState(Number(change.id));
              } else {
                toast({
                  title: 'Initial state cannot be removed',
                  variant: 'warning',
                });
              }
            }
          });
        });
      } else {
        setNodes(nds => applyNodeChanges(changes, nds));
      }
    },
    [setNodes, updateDesign],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    changes => {
      if (changes.some(change => change.type === 'remove')) {
        updateDesign(auto => {
          changes.forEach(change => {
            if (change.type === 'remove') {
              const [source, target] = change.id.split('->').map(Number);
              auto.removeTransition(source, target);
            }
          });
        });
      } else {
        setEdges(eds => applyEdgeChanges(changes, eds));
      }
    },
    [setEdges, updateDesign],
  );

  const onConnect: OnConnect = useCallback(
    async connection => {
      const source = Number(connection.source);
      const target = Number(connection.target);
      const transitionData = await addTransitionPrompt({ source, target });
      if (!transitionData) return;
      updateDesign(auto => {
        auto.removeTransition(source, target);
        auto.addTransition(source, target, transitionData);
      });
    },
    [updateDesign],
  );

  useEffect(() => {
    setNodes(prev => prev.map(n => ({ ...n, selected: false })));
    setEdges(prev => prev.map(e => ({ ...e, selected: false })));
  }, [mode]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  };
};
