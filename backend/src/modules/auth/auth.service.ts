import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../global/models/users.model';
import { handleError } from 'src/utils/handle.error';
import { RecordDuplicateException, RecordNotFoundException } from 'src/common/utils/throw.exceptions.util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenModel } from './models/refreshToken.model';
import { JwtPayload } from 'src/common/interface/auth.interface';

// This service is used to hash and compare passwords
@Injectable()
export class HashService {
    private readonly saltRounds: number;

    constructor(private configService: ConfigService) {
        this.saltRounds = parseInt(this.configService.get('SALT_ROUNDS', '12'));
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UsersModel)
        private readonly userModel: typeof UsersModel,
        @InjectModel(RefreshTokenModel)
        private readonly refreshTokenModel: typeof RefreshTokenModel,

        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly hashService: HashService,
    ) { }
    async registerUser(dto: any): Promise<any> {
        try {

            const { username, password, email, phone } = dto;
            const userExists = await this.userModel.findOne({
                where: {
                    [Op.or]: [
                        { username: username },
                        { email: email },
                        { phone: phone }
                    ]
                }
            });

            if (userExists) throw new ConflictException('User already exists');
            const hashedPassword = await this.hashService.hashPassword(password);

            await this.userModel.create({ password: hashedPassword, ...dto });
            return;

        } catch (error) {
            handleError(error);
        }
    }

    async loginUser(dto: any) {
        const { username, phone, email, password } = dto;

        const userExists = await this.userModel.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (!userExists) throw new UnauthorizedException('User does not exist');

        const isPasswordValid = await this.hashService.comparePassword(password, userExists.password);

        if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

        return this.generateTokens(userExists);
    }

    async logoutUser(userID: number, refreshToken: string) {
        await this.deleteRefreshToken(userID, refreshToken);
    }

    /*--------------------- FUNCTIONS RELATED TO JWT TOKENS ---------------------*/
    async generateTokens(user: any) {
        const payload: JwtPayload = {
            sub: user.userID,
            username: user.username,
            email: user.email,
            lastPasswordChange: user.lastPasswordChange,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get<string>('JWT_ACCESS_TIME'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get<string>('JWT_REFRESH_TIME'),
            })
        ])

        // Set the refresh token's expiry
        const refreshExpiry = new Date();
        refreshExpiry.setDate(refreshExpiry.getDate() + 7);

        await this.refreshTokenModel.create({
            userID: user.userID,
            token: refreshToken,
            expiresAt: refreshExpiry
        })

        return {
            user: {
                userID: user.userID,
                username: user.username,
            },
            accessToken,
            refreshToken
        }
    }

    async refreshTokens(userID: number, refreshToken: string) {
        const userExists = await this.userModel.findByPk(userID);
        if (!userExists) throw new UnauthorizedException('The User does not exist');

        const user = await this.validateRefreshToken(userID, refreshToken);
        if (!user) throw new UnauthorizedException('Invalid or expired refresh token');

        // Delete old refresh token
        await this.deleteRefreshToken(userID, refreshToken);

        return this.generateTokens(user);
    }

    async validateRefreshToken(userID: number, refreshToken: string) {
        const record = await this.refreshTokenModel.findOne({
            where: {
                userID: userID,
                token: refreshToken,
                expiresAt: { [Op.gt]: new Date() }
            },
            include: [{ model: UsersModel, as: 'user' }],
        });

        if (!record) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
        return {
            id: record.user.userID,
            username: record.user.username,
        };
    }

    async deleteRefreshToken(userID: number, refreshToken: string) {
        
        await RecordNotFoundException(this.refreshTokenModel, { userID, token: refreshToken });
        
        await this.refreshTokenModel.destroy({
            where: {
                userID: userID,
                token: refreshToken,
            },
        });
    }


}


