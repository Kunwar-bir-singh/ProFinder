import * as nodemailer from 'nodemailer';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAIL_CONSTANTS } from './constants/mail.constants';
import { MailConfig, EmailOptions, MailResponse, WelcomeEmailData, PasswordResetEmailData } from './interfaces/mail.interface';
import { welcomeEmailTemplate } from './templates/welcome-template';
import { passwordResetEmailTemplate } from './templates/password-reset-template';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private isConfigured = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeTransporter();
  }

  private async initializeTransporter(): Promise<void> {
    try {
      const mailConfig: MailConfig = {
        host: this.configService.get<string>('GMAIL_SMTP_HOST') || MAIL_CONSTANTS.SMTP.HOST,
        port: this.configService.get<number>('GMAIL_SMTP_PORT') || MAIL_CONSTANTS.SMTP.PORT,
        secure: this.parseBoolean(this.configService.get<string>('GMAIL_SMTP_SECURE')) || MAIL_CONSTANTS.SMTP.SECURE,
        auth: {
          user: this.configService.get<string>('GMAIL_USER') || MAIL_CONSTANTS.AUTH.USER,
          pass: this.configService.get<string>('GMAIL_APP_PASSWORD') || MAIL_CONSTANTS.AUTH.PASS,
        },
        from: this.configService.get<string>('MAIL_FROM') || MAIL_CONSTANTS.EMAIL.FROM,
      };

      if (!mailConfig.auth.user || !mailConfig.auth.pass) {
        this.logger.warn('Gmail credentials not configured. Email service will not be available.');
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.port,
        secure: mailConfig.secure,
        auth: mailConfig.auth,
        // Add connection timeout and other options
        connectionTimeout: 10000,
        socketTimeout: 10000,
      });

      // Test the connection
      await this.transporter.verify();
      this.isConfigured = true;
      this.logger.log('Email service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize email service:', error);
      this.isConfigured = false;
    }
  }

  private parseBoolean(value: string | undefined): boolean {
    if (!value) return false;
    return value.toLowerCase() === 'true';
  }

  private isMailServiceAvailable(): boolean {
    if (!this.isConfigured || !this.transporter) {
      this.logger.warn('Email service is not configured or available');
      return false;
    }
    return true;
  }

  async sendEmail(options: EmailOptions): Promise<MailResponse> {
    if (!this.isMailServiceAvailable()) {
      return {
        success: false,
        error: 'Email service is not available',
      };
    }

    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: options.from || MAIL_CONSTANTS.EMAIL.FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
        headers: {
          'X-Mailer': 'ProFinder Mail Service',
        },
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`Email sent successfully to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<MailResponse> {
    try {
      const { html, text } = welcomeEmailTemplate(data);
      
      return await this.sendEmail({
        to: data.email,
        subject: 'Welcome to ProFinder!',
        html,
        text,
      });
    } catch (error) {
      this.logger.error('Failed to send welcome email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send welcome email',
      };
    }
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<MailResponse> {
    try {
      const { html, text } = passwordResetEmailTemplate(data);
      
      return await this.sendEmail({
        to: data.email, // Note: You'll need to add email to the interface
        subject: 'Password Reset Request - ProFinder',
        html,
        text,
      });
    } catch (error) {
      this.logger.error('Failed to send password reset email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send password reset email',
      };
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      this.logger.error('Email connection test failed:', error);
      return false;
    }
  }

  getConfigurationStatus(): { isConfigured: boolean; is_available: boolean; config: any } {
    return {
      isConfigured: this.isConfigured,
      is_available: this.isMailServiceAvailable(),
      config: {
        host: this.configService.get<string>('GMAIL_SMTP_HOST') || MAIL_CONSTANTS.SMTP.HOST,
        port: this.configService.get<number>('GMAIL_SMTP_PORT') || MAIL_CONSTANTS.SMTP.PORT,
        secure: this.parseBoolean(this.configService.get<string>('GMAIL_SMTP_SECURE')) || MAIL_CONSTANTS.SMTP.SECURE,
        from: this.configService.get<string>('MAIL_FROM') || MAIL_CONSTANTS.EMAIL.FROM,
        hasCredentials: !!(this.configService.get<string>('GMAIL_USER') && this.configService.get<string>('GMAIL_APP_PASSWORD')),
      },
    };
  }
}