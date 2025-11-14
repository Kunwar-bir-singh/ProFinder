import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { JwtPayload } from 'src/common/interface/auth.interface';
import { AuthService } from '../auth.service';

interface CustomRequest {
  cookies: {
    [key: string]: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') as string,
    });
  }

  async validate(payload: JwtPayload) {
    const { exp } = payload;

    const expirationDate = new Date((exp as number) * 1000);

    if (expirationDate < new Date()) {
      throw new UnauthorizedException('Token has expired.');
    }
    const user = await this.userService.getUserDetails(payload.user_id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.last_password_change && payload.last_password_change) {
      if (user.last_password_change > payload.last_password_change) {
        throw new UnauthorizedException(
          'Password has been changed. Please login again.',
        );
      }
    }

    return {
      user_id: user.user_id,
      username: user.username,
      provider_id: user?.['provider.provider_id'],
    };
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: CustomRequest) => {
          return req?.cookies?.refreshToken || null;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: any, payload: JwtPayload) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      throw new UnauthorizedException('Refresh token not found');

    return this.authService.validateRefreshToken(payload.user_id, refreshToken);
  }
}
