'use client';

import { useState } from 'react';
import Link from 'next/link';

import { type Project } from '@prisma/browser';
import { Cpu } from 'lucide-react';

import { AccountMenu } from '@/components/layout/account-menu';
import { DarkModeToggle } from '@/components/layout/dark-mode-toogle';
import { AutomatonTitle } from './automaton-title';
import { ExamplesDialog, ExamplesMenu } from './examples-menu';
import { ExportCode } from './export-code';
import { ImportCode } from './import-code';
import { OverflowMenu } from './overflow-menu';
import { PublicSelect } from './public-select';
import { SaveAutomaton } from './save-automaton';

export function PlaygroundLayout({ data }: { data?: Project }) {
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <header className="flex min-h-12 items-center gap-2 border-b px-2 sm:px-4 lg:px-6">
      <nav className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
        <Link className="flex shrink-0 items-center justify-center" href="/">
          <Cpu className="size-8 text-primary" />
        </Link>
        {data && (
          <>
            <AutomatonTitle title={data.title} />
            <div className="hidden md:block">
              <PublicSelect isPublic={data.isPublic} />
            </div>
          </>
        )}
        <SaveAutomaton />
        <OverflowMenu
          data={data}
          onOpenExamples={() => setExamplesOpen(true)}
          onOpenImport={() => setImportOpen(true)}
          onOpenExport={() => setExportOpen(true)}
        />
      </nav>
      <nav className="flex shrink-0 items-center gap-1 md:gap-3">
        <ExamplesMenu />
        <div className="mx-2 hidden gap-2 lg:flex">
          <ImportCode open={importOpen} onOpenChange={setImportOpen} />
          <ExportCode title={data?.title} open={exportOpen} onOpenChange={setExportOpen} />
        </div>
        <DarkModeToggle />
        <AccountMenu variant="ghost" />
      </nav>
      <ExamplesDialog open={examplesOpen} onOpenChange={setExamplesOpen} />
    </header>
  );
}
