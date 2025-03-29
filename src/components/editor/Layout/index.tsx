import Link from "next/link";

import { type UserAutomaton } from "@prisma/client";
import { Cpu } from "lucide-react";

import { AccountMenu } from "@/components/layout/account-menu";
import { DarkModeToggle } from "@/components/layout/dark-mode-toogle";
import { useSession } from "@/providers/user-provider";
import { AutomatonTitle } from "./automaton-title";
import { ExamplesMenu } from "./examples-menu";
import { PublicSelect } from "./public-select";
import { SaveAutomaton } from "./save-automaton";

export function EditorLayout({ data }: { data?: UserAutomaton }) {
  const user = useSession();
  const isOwner = Boolean(user && data && user.id === data.userId);
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link className="flex items-center justify-center" href="/">
        <Cpu className="h-6 w-6 mr-2" />
      </Link>
      <nav className="ml-2 mr-auto flex items-center gap-4 sm:gap-6">
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