import Link from "next/link";

import { type Project } from "@prisma/client";
import { Cpu } from "lucide-react";

import { AccountMenu } from "@/components/layout/account-menu";
import { DarkModeToggle } from "@/components/layout/dark-mode-toogle";
import { useSession } from "@/providers/user-provider";
import { AutomatonTitle } from "./automaton-title";
import { ExamplesMenu } from "./examples-menu";
import { PublicSelect } from "./public-select";
import { SaveAutomaton } from "./save-automaton";

export function PlaygroundLayout({ data }: { data?: Project }) {
  const user = useSession();
  const isOwner = Boolean(user && data && user.id === data.userId);
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <nav className="mr-auto flex items-center gap-4">
        <Link className="flex items-center justify-center" href="/">
          <Cpu className="size-8" />
        </Link>
        {data && (<>
          <AutomatonTitle title={data.title} />
          <PublicSelect isPublic={data.isPublic} isOwner={isOwner} />
        </>)}
        <SaveAutomaton />
      </nav>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <ExamplesMenu />
        <DarkModeToggle />
        <AccountMenu variant="ghost" />
      </nav>
    </header>
  )
}