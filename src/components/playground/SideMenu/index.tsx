'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAutomatonDesign } from '@/providers/playground-provider';
import AlphabetMenu from './alphabet-menu';
import SimulationMenu from './simulation-menu';
import TestingMenu from './testing-menu';
import StackAlphabetMenu from './stack-alphabet-menu';

export default function SideMenu() {
  const { automaton } = useAutomatonDesign();
  return (
    <ScrollArea className="w-72 border-l">
      <AlphabetMenu />
      <Separator />
      {automaton.type === 'PDA' && (
        <>
          <StackAlphabetMenu />
          <Separator />
        </>
      )}
      <TestingMenu />
      <Separator />
      <SimulationMenu />
    </ScrollArea>
  );
}
