'use client';

import { useEffect } from 'react';

import { TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container flex-1 mx-auto flex flex-col items-center justify-center gap-4 py-20 px-4 text-center">
      <TriangleAlert className="text-muted-foreground" size={32} />
      <h1>Something went wrong</h1>
      <p className="text-muted-foreground">
        This page could not be loaded. Try again, and contact support if the problem persists.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
