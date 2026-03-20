import { DocsSidebar } from './components/docs-sidebar';
import 'katex/dist/katex.min.css';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex max-w-[90rem] w-full mx-auto p-4 md:p-8 md:pt-10">
      <DocsSidebar />
      {/* Main Content Area */}
      <main className="flex-1 min-w-0 md:pl-12 prose dark:prose-invert prose-neutral prose-headings:tracking-tight hover:prose-a:text-primary prose-a:transition-colors max-w-none prose-pre:p-0 prose-pre:bg-transparent">
        {children}
      </main>
    </div>
  );
}