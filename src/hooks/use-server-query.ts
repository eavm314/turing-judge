'use client';

import { useState, useCallback } from 'react';
import { unstable_rethrow } from 'next/navigation';
import { type ServerActionResult } from '@/lib/actions/result';
import { useToast } from './use-toast';

export function useServerQuery<Args extends unknown[], T>(
  query: (...args: Args) => Promise<ServerActionResult<T>>,
) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const execute = useCallback(
    async (...args: Args) => {
      try {
        setLoading(true);
        const result = (await query(...args)) as {
          success: boolean;
          message: string;
          data?: T;
        };

        if (!result.success) {
          toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive',
            duration: 6000,
          });
          return;
        }

        setData(result.data);
      } catch (error) {
        unstable_rethrow(error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  return { data, loading, execute };
}
