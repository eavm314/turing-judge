import { describe, expect, it } from 'vitest';
import { redirect, notFound } from 'next/navigation';
import { ActionError, serverQuery } from '@/lib/actions/result';

describe('serverQuery', () => {
  it('wraps a value as a success result', async () => {
    const result = await serverQuery(async () => [1, 2, 3]);
    expect(result).toEqual({ success: true, message: '', data: [1, 2, 3] });
  });

  it('converts ActionError into a typed failure', async () => {
    const result = await serverQuery(async () => {
      throw new ActionError('NOT_FOUND', 'Problem not found');
    });
    expect(result).toEqual({ success: false, message: 'Problem not found', code: 'NOT_FOUND' });
  });

  it('converts an unexpected throw (e.g. a dead database) into UNEXPECTED', async () => {
    const result = await serverQuery(async () => {
      throw new Error("Can't reach database server at some-postgres:5432");
    });
    expect(result.success).toBe(false);
    if (result.success) throw new Error('unreachable');
    expect(result.code).toBe('UNEXPECTED');
    expect(result.message).toBe('Something went wrong. Please try again.');
  });

  it('re-throws redirect() instead of swallowing it', async () => {
    await expect(serverQuery(async () => redirect('/signin'))).rejects.toThrow();
  });

  it('re-throws notFound() instead of swallowing it', async () => {
    await expect(serverQuery(async () => notFound())).rejects.toThrow();
  });
});
