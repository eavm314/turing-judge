import Link from 'next/link';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import exampleProjects from '@/constants/example-projects';
import { AutomatonType } from '@prisma/browser';

const typeOrder = [AutomatonType.FSM, AutomatonType.PDA, AutomatonType.TM];
const typeLabel: Record<AutomatonType, string> = {
  [AutomatonType.FSM]: 'Finite State Machines',
  [AutomatonType.PDA]: 'Pushdown Automata',
  [AutomatonType.TM]: 'Turing Machines',
};

export function ExamplesMenu() {
  const projectsByType = Object.groupBy(exampleProjects, project => project.type);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hidden md:flex items-center gap-1 px-2">
          Examples
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {typeOrder
          .filter(type => (projectsByType[type]?.length ?? 0) > 0)
          .map(type => (
            <DropdownMenuSub key={type}>
              <DropdownMenuSubTrigger>{typeLabel[type]}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {projectsByType[type]!.map(example => (
                  <DropdownMenuItem asChild key={example.id}>
                    <Link href={`/playground/${example.id}`} target="_blank">
                      {example.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Touch-friendly flat examples list, opened from the mobile overflow menu. */
export function ExamplesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const projectsByType = Object.groupBy(exampleProjects, project => project.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80dvh] w-[calc(100vw-2rem)] max-w-sm overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>Examples</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {typeOrder
            .filter(type => (projectsByType[type]?.length ?? 0) > 0)
            .map(type => (
              <div key={type}>
                <p className="mb-1 text-sm font-semibold text-muted-foreground">
                  {typeLabel[type]}
                </p>
                <div className="flex flex-col">
                  {projectsByType[type]!.map(example => (
                    <Link
                      key={example.id}
                      href={`/playground/${example.id}`}
                      onClick={() => onOpenChange(false)}
                      className="rounded-md px-2 py-2.5 text-neutral-foreground hover:bg-accent"
                    >
                      {example.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
