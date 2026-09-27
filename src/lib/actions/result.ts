import { unstable_rethrow } from 'next/navigation';

export type ActionErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'UNEXPECTED';

export const UNEXPECTED_MESSAGE = 'Something went wrong. Please try again.';

type SuccessData<T> = undefined extends T ? { data?: T } : { data: T };

export type ActionFailure = { success: false; message: string; code: ActionErrorCode };

export type ServerActionResult<T = void> =
  | ({ success: true; message: string } & SuccessData<T>)
  | ActionFailure;

export class ActionError extends Error {
  constructor(
    readonly code: ActionErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export const serverQuery = async <T>(fn: () => Promise<T>): Promise<ServerActionResult<T>> => {
  try {
    return { success: true, message: '', data: await fn() } as ServerActionResult<T>;
  } catch (error) {
    // Must precede any handling: redirect() and notFound() signal via thrown errors.
    unstable_rethrow(error);

    if (error instanceof ActionError) {
      return { success: false, message: error.message, code: error.code };
    }
    console.error(error);
    return { success: false, message: UNEXPECTED_MESSAGE, code: 'UNEXPECTED' };
  }
};
