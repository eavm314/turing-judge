'use client';

import { useEffect, useRef } from 'react';

import { TriangleAlert } from 'lucide-react';

import { toast } from '@/hooks/use-toast';

export function ErrorToast({ message }: { message: string }) {
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
      duration: 6000,
    });
  }, [message]);

  return null;
}

export function QueryError({ message }: { message: string }) {
  return (
    <>
      <ErrorToast message={message} />
      <div className="flex flex-col items-center gap-2 rounded-md border border-dashed py-10 text-center text-muted-foreground">
        <TriangleAlert size={20} />
        <p className="text-sm">{message}</p>
      </div>
    </>
  );
}
