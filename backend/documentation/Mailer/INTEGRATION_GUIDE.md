# Quick Integration Guide

This guide shows how to integrate the new email service with your existing ProFinder application.

## Files Created

```
src/modules/mail/
├── interfaces/
│   └── mail.interface.ts         # TypeScript interfaces
├── constants/
│   └── mail.constants.ts         # Configuration constants
├── templates/
│   ├── base-template.ts          # Base email template
│   ├── welcome-template.ts       # Welcome email template
│   └── password-reset-template.ts # Password reset template
├── mail.module.ts               # NestJS module
├── mail.service.ts              # Core mail service
└── mail.controller.ts           # Testing endpoints
```

## Integration Steps

### 1. Configure Environment Variables

Add to your `.env` file:

```bash
# Gmail SMTP Configuration
GMAIL_SMTP_HOST=smtp.gmail.com
GMAIL_SMTP_PORT=587
GMAIL_SMTP_SECURE=false
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Email Configuration
MAIL_FROM=ProFinder <noreply@profinder.com>
MAIL_REPLY_TO=support@profinder.com

# Company Configuration
COMPANY_NAME=ProFinder
COMPANY_LOGO_URL=https://via.placeholder.com/150x50?text=ProFinder
WEBSITE_URL=https://profinder.com
SUPPORT_EMAIL=support@profinder.com
```

### 2. Update Auth Module

Edit `src/modules/auth/auth.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly mailService: MailService,
    // ... other dependencies
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      // Create user
      const user = await this.userService.create(createUserDto);
      
      // Send welcome email
      const emailResult = await this.mailService.sendWelcomeEmail({
        name: user.name,
        email: user.email,
        verificationUrl: `${process.env.WEBSITE_URL}/verify/${user.verificationToken}`
      });

      if (emailResult.success) {
        this.logger.log(`Welcome email sent to ${user.email}`);
      } else {
        this.logger.error(`Failed to send welcome email: ${emailResult.error}`);
      }

      return user;
    } catch (error) {
      this.logger.error('Registration failed:', error);
      throw error;
    }
  }

  async requestPasswordReset(email: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists
        return { message: 'If the email exists, a reset link has been sent' };
      }

      // Generate reset token
      const resetToken = await this.generateResetToken(user.id);
      
      // Send password reset email
      const emailResult = await this.mailService.sendPasswordResetEmail({
        name: user.name,
        email: user.email,
        resetToken: resetToken,
        resetUrl: `${process.env.WEBSITE_URL}/reset-password?token=${resetToken}`,
        expiresIn: '24 hours'
      });

      if (emailResult.success) {
        this.logger.log(`Password reset email sent to ${user.email}`);
      } else {
        this.logger.error(`Failed to send password reset email: ${emailResult.error}`);
      }

      return { message: 'If the email exists, a reset link has been sent' };
    } catch (error) {
      this.logger.error('Password reset request failed:', error);
      throw error;
    }
  }
}
```

### 3. Update Users Module

Edit `src/modules/users/users.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    // ... other dependencies
    private readonly mailService: MailService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Create user logic...
      const user = await this.userRepository.create(createUserDto);
      
      // Send welcome email for new registrations
      if (createUserDto.sendWelcomeEmail) {
        const emailResult = await this.mailService.sendWelcomeEmail({
          name: user.name,
          email: user.email,
          verificationUrl: `${process.env.WEBSITE_URL}/verify/${user.verificationToken}`
        });

        if (emailResult.success) {
          this.logger.log(`Welcome email sent to ${user.email}`);
        } else {
          this.logger.error(`Failed to send welcome email: ${emailResult.error}`);
        }
      }

      return user;
    } catch (error) {
      this.logger.error('User creation failed:', error);
      throw error;
    }
  }

  async updateProfile(userId: number, updateData: UpdateUserDto) {
    try {
      const user = await this.userRepository.update(updateData, { 
        where: { id: userId } 
      });
      
      // Send confirmation email for important profile updates
      if (updateData.email) {
        const emailResult = await this.mailService.sendEmail({
          to: updateData.email,
          subject: 'Email Updated - ProFinder',
          html: `<p>Your email has been successfully updated to ${updateData.email}.</p>`
        });

        if (emailResult.success) {
          this.logger.log(`Profile update confirmation sent to ${updateData.email}`);
        }
      }

      return user;
    } catch (error) {
      this.logger.error('Profile update failed:', error);
      throw error;
    }
  }
}
```

### 4. Testing the Integration

1. **Test Email Service Connection:**
   ```bash
   curl http://localhost:3000/mail/test-connection
   ```

2. **Check Configuration:**
   ```bash
   curl http://localhost:3000/mail/config-status
   ```

3. **Test Welcome Email:**
   ```bash
   curl -X POST http://localhost:3000/mail/send-welcome \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "verificationUrl": "https://yourapp.com/verify/abc123"
     }'
   ```

4. **Test Password Reset Email:**
   ```bash
   curl -X POST http://localhost:3000/mail/send-password-reset \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "resetToken": "reset_token_123",
       "resetUrl": "https://yourapp.com/reset-password?token=reset_token_123",
       "expiresIn": "24 hours"
     }'
   ```

### 5. Integration with Controllers

Update your auth controller to use the new email functionality:

```typescript
// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.requestPasswordReset(email);
  }
}
```

### 6. Environment Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Gmail App Password:**
   - Enable 2FA on your Gmail account
   - Generate app password in Google Account settings
   - Add to `.env` file

3. **Update Company Information:**
   - Modify `.env` with your actual company details
   - Update logo URL
   - Set correct website URL

### 7. Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong, unique app passwords
   - Rotate passwords regularly

2. **Email Validation:**
   - Validate email addresses before sending
   - Implement rate limiting for password reset requests
   - Use HTTPS for all email links

3. **Error Handling:**
   - Don't reveal sensitive information in error messages
   - Log errors for debugging
   - Handle email failures gracefully

## Testing Checklist

- [ ] Email service builds without errors
- [ ] Gmail SMTP connection works
- [ ] Welcome emails are sent successfully
- [ ] Password reset emails are sent successfully
- [ ] Error handling works correctly
- [ ] Integration with auth module works
- [ ] Integration with users module works
- [ ] Environment variables are properly configured

## Troubleshooting

### Common Issues

1. **Build Errors:**
   - Ensure nodemailer is installed: `npm install`
   - Check TypeScript interfaces are correct

2. **Connection Issues:**
   - Verify Gmail credentials
   - Check 2FA is enabled
   - Ensure app password is correct

3. **Email Not Sending:**
   - Check application logs
   - Test connection endpoint
   - Verify environment variables

### Log Analysis

Check your application logs for:
- Email service initialization
- Connection test results
- Email sending attempts
- Error details

## Next Steps

1. **Test all endpoints** with real email addresses
2. **Customize templates** with your branding
3. **Set up monitoring** for email delivery
4. **Implement rate limiting** for production
5. **Add email analytics** if needed
6. **Consider queue system** for high volume

Your email service is now ready for production use!