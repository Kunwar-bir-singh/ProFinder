export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content?: string | Buffer;
  path?: string;
  contentType?: string;
}

export interface WelcomeEmailData {
  name: string;
  email: string;
  verificationUrl?: string;
}

export interface PasswordResetEmailData {
  name: string;
  email: string;
  resetToken: string;
  resetUrl: string;
  expiresIn: string;
}

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface MailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}