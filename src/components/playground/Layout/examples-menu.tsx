import { Button } from '@/components/ui/button';
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
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function ExamplesMenu() {
  const projectsByType = Object.groupBy(exampleProjects, project => project.type);

  const typeOrder = [AutomatonType.FSM, AutomatonType.PDA, AutomatonType.TM];
  const typeLabel: Record<AutomatonType, string> = {
    [AutomatonType.FSM]: 'Finite State Machines',
    [AutomatonType.PDA]: 'Pushdown Automata',
    [AutomatonType.TM]: 'Turing Machines',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 px-2">
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
