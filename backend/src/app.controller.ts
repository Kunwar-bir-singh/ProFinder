import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TestModel } from './others/test.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  getHello(): string {
    return this.appService.getHealth();
  }

  @Get('test')
  getTest(): Promise<TestModel[]> {
    return this.appService.getTest();
  }
}
