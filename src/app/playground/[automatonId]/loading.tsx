import { Loader } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingPlayground() {
  return (
    <div className="flex flex-col h-dvh">
      <header className="flex min-h-12 items-center gap-2 border-b px-2 sm:px-4 lg:px-6">
        <Skeleton className="size-8 shrink-0" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="ml-auto h-8 w-28" />
      </header>
      <main className="flex flex-1 items-center justify-center overflow-hidden">
        <Loader className="animate-spin" size={60} />
      </main>
    </div>
  );
}
