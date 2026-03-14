import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import exampleProjects from '@/constants/example-projects';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function ExamplesMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 px-2">
          Examples
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {exampleProjects.map(example => (
          <Link href={`/playground/${example.id}`} key={example.id} target="_blank">
            <DropdownMenuItem>{example.title}</DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
