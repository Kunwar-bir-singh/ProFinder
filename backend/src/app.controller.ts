import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { TestModel } from './others/test.model';
import { ApiClientGuard } from './common/guards/apiClientGuard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHello(): string {
    return this.appService.getHealth();
  }

  @Get('test')
  getTest(): Promise<TestModel[]> {
    return this.appService.getTest();
  }

  @Delete('delete-user/:user_id')
  @UseGuards(ApiClientGuard)
  async deleteUser(@Param('user_id') user_id: number): Promise<void> {
    return await this.appService.deleteUsers(user_id);
  }
}
