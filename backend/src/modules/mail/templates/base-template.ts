import { TEMPLATE_CONSTANTS, MAIL_CONSTANTS } from '../constants/mail.constants';

export const baseEmailTemplate = (content: string, title: string = 'ProFinder'): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${TEMPLATE_CONSTANTS.STYLES.FONT_FAMILY};
            line-height: 1.6;
            color: ${TEMPLATE_CONSTANTS.COLORS.DARK};
            background-color: ${TEMPLATE_CONSTANTS.COLORS.LIGHT};
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: ${TEMPLATE_CONSTANTS.STYLES.BORDER_RADIUS};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .email-header {
            background: linear-gradient(135deg, ${TEMPLATE_CONSTANTS.COLORS.PRIMARY}, ${TEMPLATE_CONSTANTS.COLORS.INFO});
            padding: ${TEMPLATE_CONSTANTS.STYLES.CONTAINER_PADDING};
            text-align: center;
        }
        
        .company-logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 10px;
        }
        
        .company-name {
            color: white;
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .email-body {
            padding: ${TEMPLATE_CONSTANTS.STYLES.CONTAINER_PADDING};
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: ${TEMPLATE_CONSTANTS.COLORS.DARK};
            margin-bottom: 20px;
        }
        
        .content-text {
            font-size: 16px;
            line-height: 1.7;
            color: ${TEMPLATE_CONSTANTS.COLORS.DARK};
            margin-bottom: 20px;
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .action-button {
            display: inline-block;
            background: ${TEMPLATE_CONSTANTS.COLORS.PRIMARY};
            color: white;
            text-decoration: none;
            padding: ${TEMPLATE_CONSTANTS.STYLES.BUTTON_PADDING};
            border-radius: ${TEMPLATE_CONSTANTS.STYLES.BORDER_RADIUS};
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }
        
        .action-button:hover {
            background: ${TEMPLATE_CONSTANTS.COLORS.DARK};
        }
        
        .secondary-button {
            background: ${TEMPLATE_CONSTANTS.COLORS.SECONDARY};
        }
        
        .secondary-button:hover {
            background: ${TEMPLATE_CONSTANTS.COLORS.DARK};
        }
        
        .email-footer {
            background-color: ${TEMPLATE_CONSTANTS.COLORS.LIGHT};
            padding: ${TEMPLATE_CONSTANTS.STYLES.CONTAINER_PADDING};
            text-align: center;
            border-top: 1px solid #dee2e6;
        }
        
        .footer-links {
            margin-bottom: 15px;
        }
        
        .footer-link {
            color: ${TEMPLATE_CONSTANTS.COLORS.PRIMARY};
            text-decoration: none;
            margin: 0 10px;
            font-size: 14px;
        }
        
        .footer-link:hover {
            text-decoration: underline;
        }
        
        .footer-text {
            font-size: 12px;
            color: ${TEMPLATE_CONSTANTS.COLORS.SECONDARY};
            margin-bottom: 5px;
        }
        
        .divider {
            height: 1px;
            background-color: #dee2e6;
            margin: 20px 0;
        }
        
        .highlight-box {
            background-color: #f8f9fa;
            border-left: 4px solid ${TEMPLATE_CONSTANTS.COLORS.PRIMARY};
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 ${TEMPLATE_CONSTANTS.STYLES.BORDER_RADIUS} ${TEMPLATE_CONSTANTS.STYLES.BORDER_RADIUS} 0;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 0;
            }
            
            .email-header, .email-body, .email-footer {
                padding: 15px;
            }
            
            .company-name {
                font-size: 20px;
            }
            
            .action-button {
                display: block;
                margin: 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="${MAIL_CONSTANTS.TEMPLATES.COMPANY_LOGO}" alt="${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME}" class="company-logo">
            <div class="company-name">${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME}</div>
        </div>
        
        <div class="email-body">
            ${content}
        </div>
        
        <div class="email-footer">
            <div class="footer-links">
                <a href="${MAIL_CONSTANTS.TEMPLATES.WEBSITE_URL}" class="footer-link">Website</a>
                <a href="mailto:${MAIL_CONSTANTS.TEMPLATES.SUPPORT_EMAIL}" class="footer-link">Support</a>
                <a href="${MAIL_CONSTANTS.TEMPLATES.WEBSITE_URL}/privacy" class="footer-link">Privacy Policy</a>
            </div>
            <div class="footer-text">© 2024 ${MAIL_CONSTANTS.TEMPLATES.COMPANY_NAME}. All rights reserved.</div>
            <div class="footer-text">If you have any questions, contact us at ${MAIL_CONSTANTS.TEMPLATES.SUPPORT_EMAIL}</div>
        </div>
    </div>
</body>
</html>
  `.trim();
};

export const generatePlainTextContent = (content: string): string => {
  // Remove HTML tags and convert to plain text
  return content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};