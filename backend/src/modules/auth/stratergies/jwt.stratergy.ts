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
    const user = await this.userService.getUserDetails(payload.userID);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.lastPasswordChange && payload.lastPasswordChange) {
      if (user.lastPasswordChange > payload.lastPasswordChange) {
        throw new UnauthorizedException(
          'Password has been changed. Please login again.',
        );
      }
    }

    return {
      userID: user.userID,
      username: user.username,
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

    return this.authService.validateRefreshToken(payload.userID, refreshToken);
  }
}
