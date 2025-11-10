export const MAIL_CONSTANTS = {
  // Gmail SMTP Configuration
  SMTP: {
    HOST: process.env.GMAIL_SMTP_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.GMAIL_SMTP_PORT || '587', 10),
    SECURE: process.env.GMAIL_SMTP_SECURE === 'true' || false, // true for 465, false for other ports
  },
  
  // Authentication
  AUTH: {
    USER: process.env.GMAIL_USER || '',
    PASS: process.env.GMAIL_APP_PASSWORD || '',
  },
  
  // Email Configuration
  EMAIL: {
    FROM: process.env.MAIL_FROM || 'noreply@profinder.com',
    REPLY_TO: process.env.MAIL_REPLY_TO || 'support@profinder.com',
  },
  
  // Template Configuration
  TEMPLATES: {
    COMPANY_NAME: 'ProFinder',
    COMPANY_LOGO: process.env.COMPANY_LOGO_URL || 'https://via.placeholder.com/150x50?text=ProFinder',
    WEBSITE_URL: process.env.WEBSITE_URL || 'https://profinder.com',
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@profinder.com',
  },
  
  // Password Reset Configuration
  PASSWORD_RESET: {
    EXPIRY_HOURS: 24,
    TOKEN_PREFIX: 'reset_',
  },
  
  // Email Types
  EMAIL_TYPES: {
    WELCOME: 'welcome',
    PASSWORD_RESET: 'password_reset',
    VERIFICATION: 'verification',
  } as const,
} as const;

export const TEMPLATE_CONSTANTS = {
  COLORS: {
    PRIMARY: '#007bff',
    SECONDARY: '#6c757d',
    SUCCESS: '#28a745',
    WARNING: '#ffc107',
    DANGER: '#dc3545',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
  },
  
  STYLES: {
    BORDER_RADIUS: '8px',
    BUTTON_PADDING: '12px 24px',
    CONTAINER_PADDING: '20px',
    FONT_FAMILY: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
} as const;