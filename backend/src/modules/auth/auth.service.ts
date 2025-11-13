import { Op } from 'sequelize';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../users/models/users.model';
import { handleError } from 'src/utils/handle.error';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenModel } from './models/refreshToken.model';
import { JwtPayload } from 'src/common/interface/auth.interface';
import { Response } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';

// This service is used to hash and compare passwords

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UsersModel)
    private readonly userModel: typeof UsersModel,
    @InjectModel(RefreshTokenModel)
    private readonly refreshTokenModel: typeof RefreshTokenModel,

    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashService: HashService,
    private readonly sequelize: Sequelize,
  ) {}
  async registerUser(dto: any, res: Response): Promise<any> {
    const transaction = await this.sequelize.transaction();
    try {
      const { password } = dto;
      const hashedPassword = await this.hashService.hashPassword(password);

      dto.password = hashedPassword;

      const result = await this.usersService.createUser(
        dto,
        'local',
        transaction,
      );

      await transaction.commit();

      if (!result || !result?.user_id) {
        // defensive: if user creation failed for some reason, throw
        throw new BadRequestException('Failed to create user');
      }

      const fullUser = await this.usersService.getUserDetails(result?.user_id);

      return this.generateTokens(fullUser, res);
    } catch (error) {
      await transaction.rollback();
      handleError(error);
    }
  }

  async loginUser(dto: any, res: Response) {
    const { password } = dto;

    const userExists = await this.usersService.checkUserExists(dto);

    if (!userExists) throw new UnauthorizedException('User does not exist');

    const isPasswordValid = await this.hashService.comparePassword(
      password,
      userExists.password,
    );

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    return this.generateTokens(userExists, res);
  }

  async changePassword(dto: any) {
    try {
      console.log('The DTO is: ', dto);

      const { email, password } = dto;

      const userExists = await this.userModel.findOne({
        where: { email },
        raw: true,
      });
      if (!userExists) throw new NotFoundException('User does not exist');

      const isPasswordValid = await this.hashService.comparePassword(
        password,
        userExists.password,
      );
      if (isPasswordValid)
        throw new BadRequestException(
          'New password cannot be the same as old password',
        );

      const hashedPassword = await this.hashService.hashPassword(password);
      await this.userModel.update(
        {
          password: hashedPassword,
          last_password_change: new Date(),
        },
        { where: { email } },
      );

      return;
    } catch (error) {
      handleError(error);
    }
  }

  async logoutUser(user_id: number, res: Response) {
    res.clearCookie('refreshToken', { path: '/' });

    await this.deleteRefreshToken(user_id);
  }

  /*--------------------- FUNCTIONS RELATED TO JWT TOKENS ---------------------*/
  async generateTokens(user: any, res: Response) {
    const payload: JwtPayload = {
      user_id: user.user_id,
      provider_id: user?.['provider.provider_id'],
      username: user.username,
      email: user.email,
      last_password_change: user.last_password_change,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TIME'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TIME'),
      }),
    ]);

    // Set the refresh token's expiry
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);

    console.log('The isProvider is: ', user.isProvider);

    const hashedRefreshToken =
      await this.hashService.hashPassword(refreshToken);

    await this.deleteRefreshToken(user.user_id);

    await this.refreshTokenModel.create({
      user_id: user.user_id,
      token: hashedRefreshToken,
      expiresAt: refreshExpiry,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENVIRONMENT') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      user: {
        user_id: user.user_id,
        isProvider: user?.['provider.provider_id'] ? true : false,
        username: user.username,
      },
      accessToken,
    };
  }

  async refreshTokens(user_id: number, refreshToken: string, res: Response) {
    const userExists = await this.userModel.findByPk(user_id);
    if (!userExists) throw new UnauthorizedException('The User does not exist');

    const user = await this.validateRefreshToken(user_id, refreshToken);
    if (!user)
      throw new UnauthorizedException('Invalid or expired refresh token');

    // Delete old refresh token
    await this.deleteRefreshToken(user_id);

    // Create new refresh token
    return this.generateTokens(user, res);
  }

  /* Function to validate the refresh token 
    Used in : refreshTokens() */
  async validateRefreshToken(user_id: number, refreshToken: string) {
    const record = await this.refreshTokenModel.findOne({
      where: {
        user_id: user_id,
        expiresAt: { [Op.gt]: new Date() },
      },
      include: [{ model: UsersModel, as: 'user' }],
      raw: true,
    });

    if (!record) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const isExist = await this.hashService.comparePassword(
      refreshToken,
      record.token,
    );

    if (!isExist) throw new UnauthorizedException('Invalid refresh token');

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    return {
      user_id: record.user_id,
    };
  }

  /* Function to delete the refresh token 
    Used in : refreshTokens() */
  async deleteRefreshToken(user_id: number) {
    // const record = await this.refreshTokenModel.findOne({
    //   where: { user_id },
    //   raw: true,
    // });

    // if (record && refreshToken) {
    //   const isValid = await this.hashService.comparePassword(
    //     refreshToken,
    //     record.token,
    //   );

    //   if (!isValid) throw new UnauthorizedException('Invalid refresh token');
    // }

    await this.refreshTokenModel.destroy({
      where: {
        user_id: user_id,
      },
    });
  }

  async googleLogin(req: any, res: Response) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('No user from Google');
    }

    // Check if user exists
    let existingUser: any = await this.usersService.checkUserExists({
      email: user.email,
    });

    if (!existingUser) {
      const transaction = await this.sequelize.transaction();
      try {
        const newUser = await this.usersService.createUser(
          {
            email: user.email,
            username: user.firstName + ' ' + user.lastName,
            password: '',
            auth_provider: 'google',
          },
          'google',
          transaction,
        );
        await transaction.commit();

        existingUser = newUser;
      } catch (error) {
        await transaction.rollback();
        handleError(error);
      }
    }

    return this.generateTokens(existingUser, res);
  }
}
