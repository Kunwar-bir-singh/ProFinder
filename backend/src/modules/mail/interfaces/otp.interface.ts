export interface OTPData {
  otp: string;
  email: string;
  otp_type: 'password_reset' | 'email_verification' | 'two_factor';
  expires_at: Date;
  current_attempts: number;
  max_attempts: number;
}

export interface OTPGenerationOptions {
  length?: number;
  expiresInMinutes?: number;
  max_attempts?: number;
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