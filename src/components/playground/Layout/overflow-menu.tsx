'use client';

import { type Project } from '@prisma/browser';
import { Copy, Download, LibraryBig, Lock, MoreHorizontal, Unlock, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsOwner } from '@/providers/playground-provider';
import { useChangeVisibility } from './public-select';
import { useSaveAutomaton } from './save-automaton';

type OverflowMenuProps = {
  data?: Project;
  onOpenExamples: () => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
};

/** Mobile-only menu holding the playground actions that are hidden below `md`. */
export function OverflowMenu({
  data,
  onOpenExamples,
  onOpenImport,
  onOpenExport,
}: OverflowMenuProps) {
  const isOwner = useIsOwner();
  const { handleSaveAs, loading } = useSaveAutomaton();
  const changeVisibility = useChangeVisibility();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-10 lg:hidden" aria-label="More options">
          <MoreHorizontal className="!size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="py-2.5" onClick={() => queueMicrotask(onOpenExamples)}>
          <LibraryBig size={16} /> Examples...
        </DropdownMenuItem>
        <DropdownMenuItem
          className="py-2.5"
          onClick={() => queueMicrotask(onOpenImport)}
          disabled={!isOwner}
        >
          <Upload size={16} /> Import...
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2.5" onClick={() => queueMicrotask(onOpenExport)}>
          <Download size={16} /> Export...
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="py-2.5"
          onClick={() => queueMicrotask(handleSaveAs)}
          disabled={loading}
        >
          <Copy size={16} /> Save As...
        </DropdownMenuItem>
        {data && (
          <DropdownMenuItem
            className="py-2.5"
            onClick={() => changeVisibility(!data.isPublic)}
            disabled={!isOwner}
          >
            {data.isPublic ? <Lock size={16} /> : <Unlock size={16} />}
            {data.isPublic ? 'Make Private' : 'Make Public'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
