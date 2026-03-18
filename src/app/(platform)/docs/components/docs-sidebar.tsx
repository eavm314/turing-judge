'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/ui/utils';
import { useSession } from '@/providers/user-provider';

export function DocsSidebar() {
  const pathname = usePathname();

  const { user } = useSession();

  const links = [
    {
      group: 'Getting Started',
      items: [
        { title: 'Introduction', href: '/docs' },
        { title: 'Visual Editor', href: '/docs/visual-editor' },
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
      items: [
        { title: 'Problem Creation', href: '/docs/problem-creation' },
      ],
    });
  }

  return (
    <aside className="hidden md:block w-64 shrink-0">
      <nav className="flex flex-col gap-6 sticky top-20 text-sm border border-border p-4">
        {links.map((group) => (
          <div key={group.group}>
            <h3 className="font-semibold mb-3 text-foreground tracking-tight">
              {group.group}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'transition-colors hover:text-primary',
                      pathname === item.href
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
