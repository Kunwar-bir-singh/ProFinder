import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService, HashService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtRefreshStrategy, JwtStrategy } from './stratergies/jwt.stratergy';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshTokenModel } from './models/refreshToken.model';
import { UsersModel } from '../global/models/users.model';
import { ProfessionModule } from '../profession/profession.module';


@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UsersModule,
    ProfessionModule,
    JwtModule.register({}),
    SequelizeModule.forFeature([UsersModel, RefreshTokenModel])
  ],
  controllers: [
    AuthController
  ],
  providers: [
    JwtService,
    ConfigService,
    HashService,
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService, HashService],

})
export class AuthModule { }
