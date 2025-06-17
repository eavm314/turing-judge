import Link from 'next/link';

import { type Project } from '@prisma/client';
import { Cpu } from 'lucide-react';

import { AccountMenu } from '@/components/layout/account-menu';
import { DarkModeToggle } from '@/components/layout/dark-mode-toogle';
import { AutomatonTitle } from './automaton-title';
import { ExportCode } from './export-code';
import { ImportCode } from './import-code';
import { PublicSelect } from './public-select';
import { SaveAutomaton } from './save-automaton';
import { ExamplesMenu } from './examples-menu';
import { SwitchType } from './switch-type';

export function PlaygroundLayout({ data }: { data?: Project }) {
  return (
    <header className="px-4 lg:px-6 min-h-12 flex items-center border-b">
      <nav className="mr-auto flex items-center gap-3">
        <Link className="flex items-center justify-center" href="/">
          <Cpu className="size-8 text-primary" />
        </Link>
        <SwitchType />
        {data && (
          <>
            <AutomatonTitle title={data.title} />
            <PublicSelect isPublic={data.isPublic} />
          </>
        )}
        <SaveAutomaton />
      </nav>
      <nav className="ml-auto flex items-center gap-3">
        <ExamplesMenu />
        <div className="flex gap-2 mx-2">
          <ImportCode />
          <ExportCode title={data?.title} />
        </div>
        <DarkModeToggle />
        <AccountMenu variant="ghost" />
      </nav>
    </header>
  );
}
