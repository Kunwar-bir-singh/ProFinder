import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../global/models/users.model';
import { handleError } from 'src/utils/handle.error';
import { RecordDuplicateException, RecordNotFoundException } from 'src/common/utils/throw.exceptions.util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenModel } from './models/refreshToken.model';
import { JwtPayload } from 'src/common/interface/auth.interface';
import { Response } from 'express';

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
                        { email: email || null },
                        { phone: phone || null }
                    ]
                }
            });

            if (userExists) throw new ConflictException('User already exists');
            const hashedPassword = await this.hashService.hashPassword(password);

            await this.userModel.create({ ...dto, password: hashedPassword, });
            return;

        } catch (error) {
            handleError(error);
        }
    }

    async loginUser(dto: any, res: Response) {
        const { username, phone, email, password } = dto;

        const userExists = await this.userModel.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email || null },
                    { phone: phone || null }
                ]
            },
            raw: true
        });

        if (!userExists) throw new UnauthorizedException('User does not exist');

        const isPasswordValid = await this.hashService.comparePassword(password, userExists.password);

        if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

        return this.generateTokens(userExists, res);
    }

    async changePassword(dto: any) {
        try {
            console.log("The DTO is: ", dto);

            const { userID, password } = dto;

            const userExists = await this.userModel.findOne({ where: { userID }, raw: true });
            if (!userExists) throw new NotFoundException('User does not exist');

            const isPasswordValid = await this.hashService.comparePassword(password, userExists.password);
            if (isPasswordValid) throw new BadRequestException('New password cannot be the same as old password');

            const hashedPassword = await this.hashService.hashPassword(password);
            await this.userModel.update({
                password: hashedPassword,
                lastPasswordChange: new Date()
            }, { where: { userID } });

            return 

        } catch (error) {
            handleError(error);
        }
    }

    async logoutUser(userID: number, refreshToken: string, res: Response) {
        res.clearCookie('refreshToken', { path: '/' });

        await this.deleteRefreshToken(userID, refreshToken);
    }

    /*--------------------- FUNCTIONS RELATED TO JWT TOKENS ---------------------*/
    async generateTokens(user: any, res: Response) {
        
        const payload: JwtPayload = {
            sub: user.userID,
            username: user.username,
            email: user.email,
            lastPasswordChange: user.lastPasswordChange,
            isProvider : user.providerID ? true : false
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

        console.log("The Refresh Token is: ", refreshToken);

        const hashedRefreshToken = await this.hashService.hashPassword(refreshToken);

        await this.deleteRefreshToken(user.userID);

        await this.refreshTokenModel.create({
            userID: user.userID,
            token: hashedRefreshToken,
            expiresAt: refreshExpiry
        })

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENVIRONMENT') === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
            user: {
                userID: user.userID,
                username: user.username,
            },
            accessToken,
        }
    }


    async refreshTokens(userID: number, refreshToken: string, res: Response) {
        const userExists = await this.userModel.findByPk(userID);
        if (!userExists) throw new UnauthorizedException('The User does not exist');

        const user = await this.validateRefreshToken(userID, refreshToken);
        if (!user) throw new UnauthorizedException('Invalid or expired refresh token');

        // Delete old refresh token
        await this.deleteRefreshToken(userID, refreshToken);

        // Create new refresh token
        return this.generateTokens(user, res);
    }

    /* Function to validate the refresh token 
    Used in : refreshTokens() */
    async validateRefreshToken(userID: number, refreshToken: string) {
        const record = await this.refreshTokenModel.findOne({
            where: {
                userID: userID,
                expiresAt: { [Op.gt]: new Date() }
            },
            include: [{ model: UsersModel, as: 'user' }],
        });

        if (!record) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const isValid = await this.hashService.comparePassword(refreshToken, record.token);
        if (!isValid) throw new UnauthorizedException('Invalid or expired refresh token');

        return {
            id: record.user.userID,
            username: record.user.username,
        };
    }

    /* Function to delete the refresh token 
    Used in : refreshTokens() */
    async deleteRefreshToken(userID: number, refreshToken?: string) {

        const record = await this.refreshTokenModel.findOne({ where: { userID }, raw: true });

        if (record && refreshToken) {
            const isValid = await this.hashService.comparePassword(refreshToken, record.token);

            if (!isValid) throw new UnauthorizedException('Invalid refresh token');
        }


        await this.refreshTokenModel.destroy({
            where: {
                userID: userID,
            },
        });
    }


}


