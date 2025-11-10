import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MailService } from './mail.service';
import { OTPService } from './otp.service';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly otpService: OTPService,
  ) {}

  @Get('test-connection')
  async testConnection() {
    const isConnected = await this.mailService.testConnection();
    return {
      success: isConnected,
      message: isConnected ? 'Email service is working' : 'Email service is not available',
    };
  }

  @Get('config-status')
  getConfigStatus() {
    return this.mailService.getConfigurationStatus();
  }

  @Post('send-welcome')
  async sendWelcomeEmail(@Body() data: any) {
    return await this.mailService.sendWelcomeEmail(data);
  }

  // OTP Endpoints
  @Post('send-otp')
  async sendOTP(@Body() data: { 
    email: string; 
    name: string; 
    purpose: 'password_reset' | 'email_verification' | 'two_factor';
    expiresInMinutes?: number;
  }) {
    const result = await this.otpService.generateOTPForEmail(
      data.email,
      data.name,
      {
        purpose: data.purpose,
        expiresInMinutes: data.expiresInMinutes || 10,
      }
    );
    return {
      success: true,
      message: 'OTP sent successfully',
      expiresAt: result.expiresAt,
      // Don't return the actual OTP in response for security
    };
  }

  @Post('validate-otp')
  async validateOTP(@Body() data: { 
    email: string; 
    otp: string; 
    purpose: 'password_reset' | 'email_verification' | 'two_factor';
  }) {
    const result = await this.otpService.validateOTP(
      data.email,
      data.otp,
      data.purpose
    );
    return result;
  }

  @Get('otp-status/:email/:purpose')
  getOTPStatus(@Param('email') email: string, @Param('purpose') purpose: 'password_reset' | 'email_verification' | 'two_factor') {
    return this.otpService.getOTPStatus(email, purpose);
  }
}