"use client";

import { Separator } from "@/components/ui/separator";
import AlphabetMenu from "./alphabet-menu";
import TestingMenu from "./testing-menu";
import SimulationMenu from "./simulation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SideMenu() {
  return (
    <ScrollArea className="w-72 border-l border-input">
      <AlphabetMenu />
      <Separator className="bg-input" />
      <TestingMenu />
      <Separator className="bg-input" />
      <SimulationMenu />
    </ScrollArea>
  );
}
