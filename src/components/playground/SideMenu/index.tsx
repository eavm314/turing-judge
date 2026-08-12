'use client';

import { PanelRightClose, PanelRightOpen, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-media-query';
import { useAutomatonDesign, usePlaygroundMode } from '@/providers/playground-provider';
import {
  SIDEBAR_DEFAULT_WIDTH,
  usePlaygroundUiStore,
  type SideMenuSection,
} from '@/store/playground-ui-store';
import AlphabetMenu from './alphabet-menu';
import MobileSimulationOverlay from './mobile-simulation-overlay';
import { ResizeHandle } from './resize-handle';
import SimulationMenu, { type SimulationType } from './simulation-menu';
import StackAlphabetMenu from './stack-alphabet-menu';
import TestingMenu from './testing-menu';
import { useManualSimulation } from './use-manual-simulation';

export default function SideMenu() {
  const { automaton } = useAutomatonDesign();
  const { mode } = usePlaygroundMode();
  const isMobile = useIsMobile();

  // Hoisted here so the rail/sheet content and the mobile simulation overlay
  // share a single controller instance.
  const manualController = useManualSimulation();
  const [simulationType, setSimulationType] = useState<SimulationType>('normal');

  const {
    sidebarWidth,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    openSections,
    setOpenSections,
    sheetOpen,
    setSheetOpen,
  } = usePlaygroundUiStore();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const width = hydrated ? sidebarWidth : SIDEBAR_DEFAULT_WIDTH;

  const simulating = mode === 'simulation';

  useEffect(() => {
    if (simulating && isMobile) setSheetOpen(false);
  }, [simulating, isMobile, setSheetOpen]);

  // When simulating, always keep the simulation section open
  const simulatingOpenSections = (sections: SideMenuSection[]) => {
    if (simulating) {
      return Array.from(new Set<SideMenuSection>([...sections, 'simulation']));
    }
    return sections;
  };

  const sections = (
    <Accordion
      type="multiple"
      value={openSections}
      onValueChange={value => setOpenSections(simulatingOpenSections(value as SideMenuSection[]))}
    >
      <AccordionItem value="alphabet">
        <AccordionTrigger className="px-3 py-2 hover:no-underline">
          <span className="text-base font-bold text-neutral-foreground md:text-lg">
            Input Alphabet
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <AlphabetMenu />
        </AccordionContent>
      </AccordionItem>
      {automaton.type === 'PDA' && (
        <AccordionItem value="stack">
          <AccordionTrigger className="px-3 py-2 hover:no-underline">
            <span className="text-base font-bold text-neutral-foreground md:text-lg">
              Stack Alphabet
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <StackAlphabetMenu />
          </AccordionContent>
        </AccordionItem>
      )}
      <AccordionItem value="testing">
        <AccordionTrigger className="px-3 py-2 hover:no-underline">
          <span className="text-base font-bold text-neutral-foreground md:text-lg">Testing</span>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <TestingMenu />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="simulation" className="border-b-0">
        <AccordionTrigger className="px-3 py-2 hover:no-underline">
          <span className="text-base font-bold text-neutral-foreground md:text-lg">Simulation</span>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <SimulationMenu
            manualController={manualController}
            simulationType={simulationType}
            setSimulationType={setSimulationType}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setSheetOpen(true)}
          aria-label="Open automaton panel"
          className="absolute right-0 top-1/2 z-10 h-12 w-9 -translate-y-1/2 rounded-r-none border-r-0 p-0 shadow-md md:hidden"
        >
          <SlidersHorizontal className="!size-5" />
        </Button>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="flex w-[85vw] max-w-sm flex-col gap-0 p-0">
            <SheetHeader className="border-b px-3 py-3">
              <SheetTitle className="text-base">Automaton Panel</SheetTitle>
            </SheetHeader>
            <ScrollArea className="min-h-0 flex-1">{sections}</ScrollArea>
          </SheetContent>
        </Sheet>
        {simulating && (
          <MobileSimulationOverlay controller={manualController} simulationType={simulationType} />
        )}
      </>
    );
  }

  if (sidebarCollapsed) {
    return (
      <Button
        variant="outline"
        onClick={toggleSidebarCollapsed}
        aria-label="Open side panel"
        className="absolute right-0 top-1/2 z-10 hidden h-12 w-9 -translate-y-1/2 rounded-r-none border-r-0 p-0 shadow-md md:flex"
      >
        <PanelRightOpen className="!size-5" />
      </Button>
    );
  }

  return (
    <div
      data-testid="side-menu"
      className="relative hidden h-full shrink-0 md:block"
      style={{ width }}
    >
      <ResizeHandle />
      <div className="flex h-full flex-col border-l">
        <div className="flex justify-end border-b px-1 py-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={toggleSidebarCollapsed}
            aria-label="Collapse side panel"
          >
            <PanelRightClose className="!size-4" />
          </Button>
        </div>
        <ScrollArea className="min-h-0 flex-1">{sections}</ScrollArea>
      </div>
    </div>
  );
}
