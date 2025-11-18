import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAndProviderDTo } from '../global/dto/common.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('bookmark')
  @UseGuards(AuthGuard('jwt'))
  async updateBookmark(@Req() req, @Body() dto: UserAndProviderDTo) {
    const { user_id } = req.user!;

    dto = { ...dto, user_id };

    return await this.usersService.createOrUpdateProviderBookmark(dto);
  }

  @Post('request-verification')
  @UseGuards(AuthGuard('jwt'))
  async requestVerification(@Request() req) {
    const { user_id } = req.user!;

    return await this.usersService.requestVerification(user_id);
  }

  @Post('verify-profile')
  @UseGuards(AuthGuard('jwt'))
  async verifyProfile(@Body() dto: { otp: string; email: string }) {
    return await this.usersService.verifyProfile(dto);
  }

    @Get('all')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Request() req) {
    const { user_id } = req.user!;

    return await this.usersService.getUserProfileDetails(user_id);
  }

  @Get('bookmarks')
  @UseGuards(AuthGuard('jwt'))
  async getBookmarks(@Request() req) {
    const { user_id } = req.user!;

    return await this.usersService.getBookmarkedPrvoiders(user_id);
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Request() req, @Body() dto: any) {
    const { user_id } = req.user!;
    dto = { ...dto, user_id };
    console.log("DTO", dto);
    
    return await this.usersService.updateProfile(dto);
  }
}
