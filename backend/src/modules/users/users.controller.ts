import { Body, Controller, Get, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAndProviderDTo } from '../global/dto/common.dto';

@Controller('user')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get('all')
    async getAllUsers() {
        return await this.usersService.getAllUsers();
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getUser(@Request() req) {
        const { user_id } = req.user!;
        
        return await this.usersService.getUserDetails(user_id);
    }

    @Get('bookmarks')
    @UseGuards(AuthGuard('jwt'))
    async getBookmarks(@Request() req) {
        const { user_id } = req.user!;

        return await this.usersService.getBookmarkedPrvoiders(user_id);
    }

    @Post('bookmark')
    @UseGuards(AuthGuard('jwt'))
    async updateBookmark(@Req() req, @Body() dto: UserAndProviderDTo) {
        const { user_id } = req.user!;

        dto = { ...dto, user_id };
        
        return await this.usersService.createOrUpdateProviderBookmark(dto);
    }
}
