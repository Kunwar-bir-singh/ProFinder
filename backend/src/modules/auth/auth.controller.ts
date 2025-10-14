import type { Request, Response } from 'express';
import { Body, Catch, Controller, Delete, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IDTokenDto } from './dto/id-token.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async registerUser(@Body() dto: any) {
        await this.authService.registerUser(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() dto: any, @Res({ passthrough: true }) res: Response) {
        return this.authService.loginUser(dto, res);
    }

    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async changePassword(@Body() dto: any, @Req() req: Request) {
        const { id: userID } = req.user!;

        const data = { userID, ...dto };
        
        await this.authService.changePassword(data);
    }

    @Post('refresh')
    @UseGuards(AuthGuard('jwt-refresh'))
    async refreshTokens(@Req() req: Request, @Body() dto: IDTokenDto, @Res() res: Response) {
        const refreshToken = req.cookies['refresh_token'];

        const { userID } = dto;

        return this.authService.refreshTokens(userID, refreshToken, res);
    }

    @Delete('logout')
    async logoutUser(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() dto: IDTokenDto,) {
        const refreshToken = req.cookies['refresh_token'];

        const { userID } = dto;

        await this.authService.logoutUser(userID, refreshToken, res);
    }
}
