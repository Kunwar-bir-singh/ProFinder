import { WelcomeEmailData } from '../interfaces/mail.interface';
import { baseEmailTemplate, generatePlainTextContent } from './base-template';
import { MAIL_CONSTANTS } from '../constants/mail.constants';

export const welcomeEmailTemplate = (data: WelcomeEmailData): { html: string; text: string } => {
  const content = `
    <div class="greeting">Welcome to ${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME}, ${data.name}!</div>
    
    <div class="content-text">
        We're thrilled to have you join our community! Your account has been successfully created with the email: <strong>${data.email}</strong>
    </div>
    
    <div class="highlight-box">
        <strong>What happens next?</strong><br>
        You can now explore our platform and start connecting with professionals in your area. If you haven't verified your email yet, please click the button below to complete the verification process.
    </div>
    
    ${data.verificationUrl ? `
    <div class="button-container">
        <a href="${data.verificationUrl}" class="action-button">Verify Your Email</a>
    </div>
    ` : ''}
    
    <div class="content-text">
        If you have any questions or need assistance, our support team is here to help. Don't hesitate to reach out to us at ${MAIL_CONSTANTS.TEMPLATES.SUPPORT_EMAIL}.
    </div>
    
    <div class="divider"></div>
    
    <div class="content-text" style="font-size: 14px; color: #666;">
        <strong>Quick Tips:</strong><br>
        • Complete your profile to get better matches<br>
        • Check out our verified professionals<br>
        • Use our search filters to find exactly what you need<br>
        • Download our mobile app for on-the-go access
    </div>
  `.trim();

  const html = baseEmailTemplate(content, 'Welcome to ProFinder!');
  
  const text = `
Welcome to ${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME}, ${data.name}!

We're thrilled to have you join our community! Your account has been successfully created with the email: ${data.email}

What happens next?
You can now explore our platform and start connecting with professionals in your area. ${data.verificationUrl ? `Please verify your email by visiting: ${data.verificationUrl}` : ''}

If you have any questions or need assistance, our support team is here to help. Contact us at ${MAIL_CONSTANTS.TEMPLATES.SUPPORT_EMAIL}.

Quick Tips:
• Complete your profile to get better matches
• Check out our verified professionals
• Use our search filters to find exactly what you need
• Download our mobile app for on-the-go access

© 2024 ${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME}. All rights reserved.
  `.trim();

  return { html, text };
};