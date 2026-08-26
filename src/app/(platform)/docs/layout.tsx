import { DocsMobileNav, DocsSidebar } from './components/docs-sidebar';
import 'katex/dist/katex.min.css';

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
