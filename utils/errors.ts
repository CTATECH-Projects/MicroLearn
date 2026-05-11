import { ErrorResponse } from '@/types/index';

export class AppError extends Error {
  constructor(public statusCode: number, public code: string, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): ErrorResponse {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    console.error('Unhandled error:', error);
    return {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    };
  }

  console.error('Unknown error:', error);
  return {
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  };
}
