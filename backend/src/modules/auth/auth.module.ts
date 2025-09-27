import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService, HashService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtRefreshStrategy, JwtStrategy } from './stratergies/jwt.stratergy';


@Module({
  imports: [
    UsersModule,
    // PassportModule,
    // ConfigModule,
    // JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService,
     HashService,
    //   JwtStrategy,
    //    JwtRefreshStrategy,
    //     ConfigService
      ],
  exports: [AuthService, HashService],

})
export class AuthModule {}
