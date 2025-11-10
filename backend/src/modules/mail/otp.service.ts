import { Injectable, Logger } from '@nestjs/common';
import {
  OTPData,
  OTPGenerationOptions,
  OTPValidationResult,
  OTPEmailData,
} from './interfaces/otp.interface';
import { MAIL_CONSTANTS } from './constants/mail.constants';
import { MailService } from './mail.service';

@Injectable()
export class OTPService {
  private readonly logger = new Logger(OTPService.name);

  // In-memory storage for OTPs (in production, use Redis or database)
  private otpStore = new Map<string, OTPData>();

  // Cleanup interval (5 minutes)
  private cleanupInterval: NodeJS.Timeout;

  constructor(private readonly mailService: MailService) {
    // Start cleanup interval
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpiredOTPs();
      },
      5 * 60 * 1000,
    ); // 5 minutes
  }

  /**
   * Generate a secure 6-digit OTP
   */
  generateOTP(): string {
    // Generate a 6-digit number (100000-999999)
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create a new OTP for the specified email and purpose
   */
  async generateOTPForEmail(
    email: string,
    name: string,
    options: OTPGenerationOptions,
  ): Promise<{ otp: string; expiresAt: Date }> {
    try {
      const otp = this.generateOTP();
      const expiresAt = new Date();
      expiresAt.setMinutes(
        expiresAt.getMinutes() + (options.expiresInMinutes || 10),
      );

      // Create unique key for storage
      const storageKey = `${email}_${options.purpose}`;

      // Store OTP data
      const otpData: OTPData = {
        otp,
        email,
        purpose: options.purpose,
        expiresAt,
        attempts: 0,
        maxAttempts: options.maxAttempts || 3,
      };

      this.otpStore.set(storageKey, otpData);

      this.logger.log(
        `Generated OTP for ${email} (${options.purpose}): ${otp}`,
      );

      // Send OTP via email
      const emailData: OTPEmailData = {
        name,
        email,
        otp,
        expiresIn: `${options.expiresInMinutes || 10} minutes`,
        purpose: this.getPurposeDisplayName(options.purpose),
      };

      await this.sendOTPEmail(emailData, options.purpose);

      return { otp, expiresAt };
    } catch (error) {
      this.logger.error('Failed to generate OTP:', error);
      throw new Error('Failed to generate OTP');
    }
  }

  /**
   * Validate an OTP for the specified email and purpose
   */
  async validateOTP(
    email: string,
    inputOTP: string,
    purpose: 'password_reset' | 'email_verification' | 'two_factor',
  ): Promise<OTPValidationResult> {
    try {
      const storageKey = `${email}_${purpose}`;
      const otpData = this.otpStore.get(storageKey);

      if (!otpData) {
        return {
          isValid: false,
          error: 'OTP not found or expired',
        };
      }

      // Check if OTP is expired
      if (new Date() > otpData.expiresAt) {
        this.otpStore.delete(storageKey);
        return {
          isValid: false,
          isExpired: true,
          error: 'OTP has expired',
        };
      }

      // Check if max attempts reached
      if (otpData.attempts >= otpData.maxAttempts) {
        this.otpStore.delete(storageKey);
        return {
          isValid: false,
          maxAttemptsReached: true,
          error: 'Maximum attempts exceeded. Please request a new OTP.',
        };
      }

      // Increment attempts
      otpData.attempts++;
      this.otpStore.set(storageKey, otpData);

      // Validate OTP
      if (otpData.otp === inputOTP) {
        // OTP is valid, remove it from store (one-time use)
        this.otpStore.delete(storageKey);
        return {
          isValid: true,
          remainingAttempts: otpData.maxAttempts - otpData.attempts,
        };
      } else {
        return {
          isValid: false,
          remainingAttempts: otpData.maxAttempts - otpData.attempts,
          error: 'Invalid OTP',
        };
      }
    } catch (error) {
      this.logger.error('Failed to validate OTP:', error);
      return {
        isValid: false,
        error: 'Failed to validate OTP',
      };
    }
  }

  /**
   * Send OTP via email based on purpose
   */
  private async sendOTPEmail(
    data: OTPEmailData,
    purpose: 'password_reset' | 'email_verification' | 'two_factor',
  ): Promise<void> {
    let subject: string;
    let template: any;

    switch (purpose) {
      case 'password_reset':
        subject = 'Password Reset OTP - ProFinder';
        template = this.getPasswordResetOTPTemplate(data);
        break;
      case 'email_verification':
        subject = 'Email Verification OTP - ProFinder';
        template = this.getEmailVerificationOTPTemplate(data);
        break;
      case 'two_factor':
        subject = 'Two-Factor Authentication Code - ProFinder';
        template = this.getTwoFactorOTPTemplate(data);
        break;
      default:
        throw new Error('Unknown OTP purpose');
    }

    await this.mailService.sendEmail({
      to: data.email,
      subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Password Reset OTP Template
   */
  private getPasswordResetOTPTemplate(data: OTPEmailData): {
    html: string;
    text: string;
  } {
    const html = `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h2 style="color: #007bff;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>We received a request to reset your password. Use the following OTP to proceed:</p>
        
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #007bff; margin: 0;">${data.otp}</h1>
        </div>
        
        <p><strong>This OTP will expire in ${data.expiresIn}.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    const text = `
Password Reset Request

Hi ${data.name},

We received a request to reset your password. Use the following OTP to proceed:

${data.otp}

This OTP will expire in ${data.expiresIn}.

If you didn't request this, please ignore this email.

© 2024 ${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME}
    `;

    return { html, text };
  }

  /**
   * Email Verification OTP Template
   */
  private getEmailVerificationOTPTemplate(data: OTPEmailData): {
    html: string;
    text: string;
  } {
    const html = `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h2 style="color: #28a745;">Verify Your Email</h2>
        <p>Hi ${data.name},</p>
        <p>Please use the following OTP to verify your email address:</p>
        
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #28a745; margin: 0;">${data.otp}</h1>
        </div>
        
        <p><strong>This OTP will expire in ${data.expiresIn}.</strong></p>
      </div>
    `;

    const text = `
Verify Your Email

Hi ${data.name},

Please use the following OTP to verify your email address:

${data.otp}

This OTP will expire in ${data.expiresIn}.

© 2024 ${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME}
    `;

    return { html, text };
  }

  /**
   * Two-Factor Authentication OTP Template
   */
  private getTwoFactorOTPTemplate(data: OTPEmailData): {
    html: string;
    text: string;
  } {
    const html = `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h2 style="color: #ffc107;">Two-Factor Authentication</h2>
        <p>Hi ${data.name},</p>
        <p>Your authentication code is:</p>
        
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #ffc107; margin: 0;">${data.otp}</h1>
        </div>
        
        <p><strong>This code will expire in ${data.expiresIn}.</strong></p>
        <p>If you didn't attempt to log in, please secure your account immediately.</p>
      </div>
    `;

    const text = `
Two-Factor Authentication

Hi ${data.name},

Your authentication code is:

${data.otp}

This code will expire in ${data.expiresIn}.

If you didn't attempt to log in, please secure your account immediately.

© 2024 ${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME}
    `;

    return { html, text };
  }

  /**
   * Get display name for OTP purpose
   */
  private getPurposeDisplayName(
    purpose: 'password_reset' | 'email_verification' | 'two_factor',
  ): string {
    switch (purpose) {
      case 'password_reset':
        return 'Password Reset';
      case 'email_verification':
        return 'Email Verification';
      case 'two_factor':
        return 'Two-Factor Authentication';
      default:
        return 'Authentication';
    }
  }

  /**
   * Clean up expired OTPs
   */
  private cleanupExpiredOTPs(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [key, otpData] of this.otpStore.entries()) {
      if (now > otpData.expiresAt) {
        this.otpStore.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.log(`Cleaned up ${cleanedCount} expired OTPs`);
    }
  }

  /**
  /**
   * Get OTP status for monitoring/debugging
   */
  getOTPStatus(
    email: string,
    purpose: 'password_reset' | 'email_verification' | 'two_factor',
  ) {
    const storageKey = `${email}_${purpose}`;
    const otpData = this.otpStore.get(storageKey);

    if (!otpData) {
      return { exists: false };
    }

    return {
      exists: true,
      expiresAt: otpData.expiresAt,
      attempts: otpData.attempts,
      maxAttempts: otpData.maxAttempts,
      isExpired: new Date() > otpData.expiresAt,
    };
  }
}
