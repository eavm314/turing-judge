import Link from "next/link";

import { type Project } from "@prisma/client";
import { Cpu } from "lucide-react";

import { AccountMenu } from "@/components/layout/account-menu";
import { DarkModeToggle } from "@/components/layout/dark-mode-toogle";
import { AutomatonTitle } from "./automaton-title";
import { ExamplesMenu } from "./examples-menu";
import { PublicSelect } from "./public-select";
import { SaveAutomaton } from "./save-automaton";

export function PlaygroundLayout({ data }: { data?: Project }) {
  return (
    <header className="px-4 lg:px-6 min-h-12 flex items-center border-b border-input">
      <nav className="mr-auto flex items-center gap-4">
        <Link className="flex items-center justify-center" href="/">
          <Cpu className="size-8 text-primary" />
        </Link>
        {data && (<>
          <AutomatonTitle title={data.title} />
          <PublicSelect isPublic={data.isPublic} />
        </>)}
        <SaveAutomaton />
      </nav>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        {/* <ExamplesMenu /> */}
        <DarkModeToggle />
        <AccountMenu variant="ghost" />
      </nav>
    </header>
  )
}