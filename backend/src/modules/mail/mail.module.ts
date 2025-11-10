import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { OTPService } from './otp.service';

@Module({
  imports: [ConfigModule],
  controllers: [MailController],
  providers: [MailService, OTPService],
  exports: [MailService, OTPService],
})
export class MailModule {}
