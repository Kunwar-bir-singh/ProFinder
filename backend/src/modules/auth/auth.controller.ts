import type { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() dto: any, @Res({ passthrough: true }) res: Response) {
    return await this.authService.registerUser(dto, res);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() dto: any, @Res({ passthrough: true }) res: Response) {
    return await this.authService.loginUser(dto, res);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body() dto: any ) {

    await this.authService.changePassword(dto);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(' req:', req);
    const { refreshToken } = req.cookies;
    const { user_id } = req.user!;

    return await this.authService.refreshTokens(user_id, refreshToken, res);
  }

  @Delete('logout')
  @UseGuards(AuthGuard('jwt'))
  async logoutUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user_id } = req.user!;

    await this.authService.logoutUser(user_id, res);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // This route initiates Google OAuth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.googleLogin(req, res);
    return res.redirect('http://localhost:3000/');
  }
}
