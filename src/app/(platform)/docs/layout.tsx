import type { Metadata } from 'next';

import { APP_NAME } from '@/constants/app';

import { DocsMobileNav, DocsSidebar } from './components/docs-sidebar';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: {
    default: 'Docs',
    template: `%s | ${APP_NAME} Docs`,
  },
  description:
    'Guides for the playground, the automaton JSON formats and the theory behind finite state machines, pushdown automata and Turing machines.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full max-w-[90rem] mx-auto">
      <DocsMobileNav />
      <div className="flex p-4 md:p-8 md:pt-10">
        <DocsSidebar />
        <main className="flex-1 min-w-0 md:pl-12 prose dark:prose-invert prose-neutral prose-headings:tracking-tight hover:prose-a:text-primary prose-a:transition-colors max-w-none prose-pre:p-0 prose-pre:bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
