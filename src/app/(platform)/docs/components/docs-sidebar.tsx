'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Menu } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/ui/utils';
import { useSession } from '@/providers/user-provider';

interface DocsGroup {
  group: string;
  items: { title: string; href: string }[];
}

function useDocsLinks(): DocsGroup[] {
  const { user } = useSession();

  const links: DocsGroup[] = [
    {
      group: 'Getting Started',
      items: [
        { title: 'Introduction', href: '/docs' },
        { title: 'Visual Editor', href: '/docs/visual-editor' },
      ],
    },
    {
      group: 'Theory Reference',
      items: [
        { title: 'Finite State Machine', href: '/docs/fsm' },
        { title: 'Pushdown Automaton', href: '/docs/pda' },
        { title: 'Turing Machine', href: '/docs/tm' },
      ],
    },
    {
      group: 'Advanced',
      items: [
        { title: 'JSON Formats', href: '/docs/json-formats' },
        { title: 'Using AI Prompts', href: '/docs/ai-prompts' },
      ],
    },
  ];

  if (user && user.role !== 'USER') {
    links.push({
      group: 'Editors',
      items: [{ title: 'Problem Creation', href: '/docs/problem-creation' }],
    });
  }

  return links;
}

function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const links = useDocsLinks();

  return (
    // Remount when the role-gated group appears so it is expanded by default too
    <Accordion
      key={links.length}
      type="multiple"
      defaultValue={links.map(group => group.group)}
      className="flex flex-col text-sm"
    >
      {links.map(group => (
        <AccordionItem key={group.group} value={group.group} className="border-none">
          <AccordionTrigger className="py-2 font-semibold text-foreground tracking-tight hover:no-underline">
            {group.group}
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <ul className="flex flex-col gap-1">
              {group.items.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'block rounded-md px-2 py-1.5 transition-colors hover:text-primary',
                      pathname === item.href
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground',
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function DocsSidebar() {
  return (
    <aside className="hidden md:block w-64 shrink-0">
      <nav className="sticky top-20 border border-border p-4">
        <DocsNav />
      </nav>
    </aside>
  );
}

export function DocsMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = useDocsLinks();

  const currentTitle =
    links.flatMap(group => group.items).find(item => item.href === pathname)?.title ??
    'Documentation';

  return (
    <div className="md:hidden sticky top-0 z-30 border-b bg-background px-4 py-1.5">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="-ml-2 h-10 gap-2 px-2">
            <Menu className="!size-5" />
            <span className="font-medium">{currentTitle}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 overflow-y-auto p-4">
          <SheetHeader>
            <SheetTitle>Documentation</SheetTitle>
          </SheetHeader>
          <DocsNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
