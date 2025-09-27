import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
    async loginUser(@Body() dto: any) {
        return this.authService.loginUser(dto);
    }

    @Post('refresh')
    @UseGuards(AuthGuard('jwt-refresh'))
    async refreshTokens(@Body() dto: IDTokenDto) {
        const { userID, refreshToken } = dto;
        return this.authService.refreshTokens(userID, refreshToken);
    }

    @Post('logout')
    async logoutUser(@Body() dto: IDTokenDto) {
        const { userID, refreshToken } = dto;
        await this.authService.logoutUser(userID, refreshToken);
    }
}
