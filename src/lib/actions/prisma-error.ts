import { unstable_rethrow } from 'next/navigation';

import {
  ActionError,
  UNEXPECTED_MESSAGE,
  type ActionErrorCode,
  type ActionFailure,
} from './result';

const PRISMA_ERROR = {
  valueTooLong: 'P2000',
  recordDoesNotExist: 'P2001',
  uniqueConstraintFailed: 'P2002',
  foreignKeyConstraintFailed: 'P2003',
  constraintFailed: 'P2004',
  nullConstraintFailed: 'P2011',
  missingRequiredValue: 'P2012',
  requiredRelationViolation: 'P2014',
  invalidInputValue: 'P2019',
  recordNotFound: 'P2025',
} as const;

const ACTION_CODE_BY_PRISMA_ERROR: Record<string, ActionErrorCode> = {
  [PRISMA_ERROR.valueTooLong]: 'VALIDATION',
  [PRISMA_ERROR.recordDoesNotExist]: 'NOT_FOUND',
  [PRISMA_ERROR.uniqueConstraintFailed]: 'CONFLICT',
  [PRISMA_ERROR.foreignKeyConstraintFailed]: 'CONFLICT',
  [PRISMA_ERROR.constraintFailed]: 'VALIDATION',
  [PRISMA_ERROR.nullConstraintFailed]: 'VALIDATION',
  [PRISMA_ERROR.missingRequiredValue]: 'VALIDATION',
  [PRISMA_ERROR.requiredRelationViolation]: 'CONFLICT',
  [PRISMA_ERROR.invalidInputValue]: 'VALIDATION',
  [PRISMA_ERROR.recordNotFound]: 'NOT_FOUND',
};

const DEFAULT_MESSAGE: Record<ActionErrorCode, string> = {
  UNAUTHENTICATED: 'User not authenticated',
  FORBIDDEN: 'Permission denied',
  NOT_FOUND: 'Record not found',
  CONFLICT: 'This record is still in use by other data and cannot be modified',
  VALIDATION: 'The provided data is invalid',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  UNEXPECTED: UNEXPECTED_MESSAGE,
};

type PrismaKnownRequestError = Error & { code: string };

// Duck-typed instead of `instanceof`: importing the generated client as a value would
// pull it into unit tests, which run in CI without one (install uses --ignore-scripts).
const isPrismaKnownRequestError = (error: unknown): error is PrismaKnownRequestError =>
  error instanceof Error &&
  error.name === 'PrismaClientKnownRequestError' &&
  typeof (error as { code?: unknown }).code === 'string';

const actionCodeOf = (error: unknown): ActionErrorCode =>
  isPrismaKnownRequestError(error)
    ? (ACTION_CODE_BY_PRISMA_ERROR[error.code] ?? 'UNEXPECTED')
    : 'UNEXPECTED';

type MessageOverrides = Partial<Record<ActionErrorCode, string>>;

export const prismaActionError = (error: unknown, messages: MessageOverrides = {}) => {
  // Must precede any handling: redirect() and notFound() signal via thrown errors.
  unstable_rethrow(error);

  const code = actionCodeOf(error);
  if (code === 'UNEXPECTED') console.error(error);

  return new ActionError(code, messages[code] ?? DEFAULT_MESSAGE[code]);
};

export const prismaFailure = (error: unknown, messages?: MessageOverrides): ActionFailure => {
  const { code, message } = prismaActionError(error, messages);
  return { success: false, message, code };
};
