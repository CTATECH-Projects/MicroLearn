import { SignUpRequest, SignInRequest } from '@/types/index';
import { AppError } from './errors';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return { valid: errors.length === 0, errors };
}

export function validateSignUpRequest(data: any): SignUpRequest {
  if (!data || typeof data !== 'object') {
    throw new AppError(400, 'INVALID_REQUEST', 'Request body is required');
  }

  const { email, password } = data;

  if (!email || typeof email !== 'string') {
    throw new AppError(400, 'INVALID_EMAIL', 'Valid email is required');
  }

  if (!validateEmail(email)) {
    throw new AppError(400, 'INVALID_EMAIL', 'Invalid email format');
  }

  if (!password || typeof password !== 'string') {
    throw new AppError(400, 'INVALID_PASSWORD', 'Valid password is required');
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new AppError(400, 'INVALID_PASSWORD', passwordValidation.errors.join('; '));
  }

  return { email, password };
}

export function validateSignInRequest(data: any): SignInRequest {
  if (!data || typeof data !== 'object') {
    throw new AppError(400, 'INVALID_REQUEST', 'Request body is required');
  }

  const { email, password } = data;

  if (!email || typeof email !== 'string') {
    throw new AppError(400, 'INVALID_EMAIL', 'Valid email is required');
  }

  if (!password || typeof password !== 'string') {
    throw new AppError(400, 'INVALID_PASSWORD', 'Valid password is required');
  }

  return { email, password };
}
