import { describe, expect, it, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { prismaActionError, prismaFailure } from '@/lib/actions/prisma-error';

const prismaError = (code: string) =>
  Object.assign(new Error(`prisma failed with ${code}`), {
    name: 'PrismaClientKnownRequestError',
    code,
  });

describe('prismaFailure', () => {
  it('maps a missing record to NOT_FOUND', () => {
    expect(prismaFailure(prismaError('P2025'))).toEqual({
      success: false,
      message: 'Record not found',
      code: 'NOT_FOUND',
    });
  });

  it('maps a foreign key violation to CONFLICT', () => {
    expect(prismaFailure(prismaError('P2003')).code).toBe('CONFLICT');
  });

  it('maps a required relation violation to CONFLICT', () => {
    expect(prismaFailure(prismaError('P2014')).code).toBe('CONFLICT');
  });

  it('maps a constraint on input data to VALIDATION', () => {
    expect(prismaFailure(prismaError('P2000')).code).toBe('VALIDATION');
  });

  it('applies the caller message for the resolved code only', () => {
    const messages = { NOT_FOUND: 'Problem not found', CONFLICT: 'Make it private instead' };
    expect(prismaFailure(prismaError('P2025'), messages).message).toBe('Problem not found');
    expect(prismaFailure(prismaError('P2003'), messages).message).toBe('Make it private instead');
  });

  it('falls back to UNEXPECTED for an unmapped prisma code', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = prismaFailure(prismaError('P2024'), { NOT_FOUND: 'Problem not found' });
    expect(result.code).toBe('UNEXPECTED');
    expect(result.message).toBe('Something went wrong. Please try again.');
  });

  it('falls back to UNEXPECTED for a non-prisma throw', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(prismaFailure(new Error('socket hang up')).code).toBe('UNEXPECTED');
  });

  it('re-throws redirect() instead of mapping it', () => {
    let redirectError: unknown;
    try {
      redirect('/signin');
    } catch (error) {
      redirectError = error;
    }
    expect(() => prismaActionError(redirectError)).toThrow();
  });
});
