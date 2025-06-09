'use client';

import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

export type ServerActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

type MaybeVoid<T> = T extends void ? true : T;

export function useServerAction<Args extends any[], T>(
  action: (...args: Args) => Promise<ServerActionResult<T>>,
) {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const execute = useCallback(
    async (...args: Args): Promise<MaybeVoid<T> | false> => {
      try {
        setLoading(true);
        const result = await action(...args);

        if (!result.success) {
          toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive',
          });
          return false;
        }

        toast({
          title: result.message,
          variant: 'success',
        });

        return ('data' in result ? result.data : true) as MaybeVoid<T>;
      } catch (err) {
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
    [action],
  );

  return { execute, loading };
}
