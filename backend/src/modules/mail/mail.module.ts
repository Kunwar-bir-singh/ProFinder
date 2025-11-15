import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { OTPService } from './otp.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OTPModel } from './models/otp.model';

@Module({
  imports: [SequelizeModule.forFeature([OTPModel]), ConfigModule],
  controllers: [MailController],
  providers: [MailService, OTPService],
  exports: [SequelizeModule, MailService, OTPService],
})
export class MailModule {}
