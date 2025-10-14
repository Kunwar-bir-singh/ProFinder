import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtRefreshStrategy, JwtStrategy } from './stratergies/jwt.stratergy';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshTokenModel } from './models/refreshToken.model';
import { UsersModel } from '../users/model/users.model';
import { ProfessionModule } from '../profession/profession.module';
import { ProvidersModule } from '../providers/providers.module';
import { HashModule } from '../hash/hash.module';


@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UsersModule,
    ProfessionModule,
    ProvidersModule,
    HashModule,
    JwtModule.register({}),
    SequelizeModule.forFeature([UsersModel, RefreshTokenModel])
  ],
  controllers: [
    AuthController
  ],
  providers: [
    JwtService,
    ConfigService,
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],

})
export class AuthModule { }
