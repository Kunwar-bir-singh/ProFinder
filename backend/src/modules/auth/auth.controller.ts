import type { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IDTokenDto } from './dto/id-token.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
        const { userID } = req.user!;

    const data = { userID, ...dto };

    await this.authService.changePassword(data);
  }

    @Post('refresh')
    @UseGuards(AuthGuard('jwt-refresh'))
    async refreshTokens(@Req() req: Request,  @Res({ passthrough: true }) res: Response) {
        console.log(" req:", req);
        const {refreshToken} = req.cookies;
        const { userID } = req.user!;

    return this.authService.refreshTokens(userID, refreshToken, res);
  }

    @Delete('logout')
    async logoutUser(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() dto: IDTokenDto,) {
        const refreshToken = req.cookies['refreshToken'];

    const { userID } = dto;

    await this.authService.logoutUser(userID, refreshToken, res);
  }
}
