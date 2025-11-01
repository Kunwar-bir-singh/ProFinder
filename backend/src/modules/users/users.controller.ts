import { Body, Controller, Get, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAndProviderDTo } from '../global/dto/common.dto';

@Controller('user')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getUser(@Request() req) {
        const { userID } = req.user!;
        
        return await this.usersService.getUserDetails(userID);
    }

    @Get('bookmarks')
    @UseGuards(AuthGuard('jwt'))
    async getBookmarks(@Request() req) {
        const { userID } = req.user!;

        return await this.usersService.getBookmarkedPrvoiders(userID);
    }

    @Post('bookmark')
    @UseGuards(AuthGuard('jwt'))
    async updateBookmark(@Req() req, @Body() dto: UserAndProviderDTo) {
        const { userID } = req.user!;

        dto = { ...dto, userID };
        
        return await this.usersService.createOrUpdateProviderBookmark(dto);
    }
}
