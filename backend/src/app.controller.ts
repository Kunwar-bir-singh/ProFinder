import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TestModule } from './others/test.module';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHealth();
  }

  @Get('Test')
  getTest(): Promise<TestModule[]> {
    return this.appService.getTest();
  }
}
