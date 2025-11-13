export class ValidateOtpDto {
    otp: string;
    email: string;
    purpose: 'password_reset' | 'email_verification' | 'two_factor';
}