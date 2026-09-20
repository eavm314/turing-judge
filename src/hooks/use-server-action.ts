'use client';

import { useState, useCallback } from 'react';
import { unstable_rethrow } from 'next/navigation';
import { type ServerActionResult } from '@/lib/actions/result';
import { useToast } from './use-toast';

type MaybeVoid<T> = T extends void ? true : T;

export function useServerAction<Args extends unknown[], T>(
  action: (...args: Args) => Promise<ServerActionResult<T>>,
  { successToast = true }: { successToast?: boolean } = {},
) {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const execute = useCallback(
    async (...args: Args): Promise<MaybeVoid<T> | false> => {
      try {
        setLoading(true);
        // T is still generic here, so SuccessData<T> stays an unresolved
        // conditional and cannot narrow on `success`.
        const result = (await action(...args)) as {
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
          return false;
        }

        if (successToast) {
          toast({
            title: result.message,
            variant: 'success',
          });
        }

        return ('data' in result ? result.data : true) as MaybeVoid<T>;
      } catch (error) {
        unstable_rethrow(error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [action, successToast],
  );

  return { execute, loading };
}
