import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get('bookmarks')
    async getBookmarks(userID: number) {
        return await this.usersService.getBookmarkedPrvoiders(userID);
    }
}
