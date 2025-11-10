import { PasswordResetEmailData } from '../interfaces/mail.interface';
import { baseEmailTemplate, generatePlainTextContent } from './base-template';
import { MAIL_CONSTANTS } from '../constants/mail.constants';

export const passwordResetEmailTemplate = (data: PasswordResetEmailData): { html: string; text: string } => {
  const content = `
    <div class="greeting">Password Reset Request</div>
    
    <div class="content-text">
        Hi ${data.name}, we received a request to reset the password for your ${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME} account.
    </div>
    
    <div class="highlight-box">
        <strong>Important Security Notice:</strong><br>
        If you made this request, click the button below to reset your password. This link will expire in ${data.expiresIn} for your security.
    </div>
    
    <div class="button-container">
        <a href="${data.resetUrl}" class="action-button">Reset Your Password</a>
    </div>
    
    <div class="content-text" style="font-size: 14px; color: #666;">
        <strong>Didn't request this?</strong><br>
        If you didn't request a password reset, please ignore this email or contact our support team at ${MAIL_CONSTANTS.TEMPLATES.SUPPORT_EMAIL}. Your password will remain unchanged.
    </div>
    
    <div class="divider"></div>
    
    <div class="content-text" style="font-size: 14px; color: #666;">
        <strong>Security Tips:</strong><br>
        • Use a strong, unique password<br>
        • Don't share your password with anyone<br>
        • Log out from shared computers<br>
        • Enable two-factor authentication when available
    </div>
  `.trim();

  const html = baseEmailTemplate(content, 'Password Reset Request');
  
  const text = `
Password Reset Request

Hi ${data.name}, we received a request to reset the password for your ${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME} account.

Important Security Notice:
If you made this request, visit this link to reset your password: ${data.resetUrl}
This link will expire in ${data.expiresIn} for your security.

Didn't request this?
If you didn't request a password reset, please ignore this email or contact our support team at ${MAIL_CONSTANTS.TEMPLATES.SUPPORT_EMAIL}. Your password will remain unchanged.

Security Tips:
• Use a strong, unique password
• Don't share your password with anyone
• Log out from shared computers
• Enable two-factor authentication when available

© 2024 ${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME}. All rights reserved.
  `.trim();

  return { html, text };
};