export interface OTPData {
  otp: string;
  email: string;
  purpose: 'password_reset' | 'email_verification' | 'two_factor';
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

export interface OTPGenerationOptions {
  length?: number;
  expiresInMinutes?: number;
  maxAttempts?: number;
  purpose: 'password_reset' | 'email_verification' | 'two_factor';
}

export interface OTPValidationResult {
  isValid: boolean;
  isExpired?: boolean;
  maxAttemptsReached?: boolean;
  remainingAttempts?: number;
  error?: string;
}

export interface OTPEmailData {
  name: string;
  email: string;
  otp: string;
  expiresIn: string;
  purpose: string;
}