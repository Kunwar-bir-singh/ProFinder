import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TestModule } from './others/test.module';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(TestModule) private readonly testModel: typeof TestModule
  ){}

  getHealth(): string {
    return 'The server is healthy!';
  }

  getTest(){
    return this.testModel.findAll();
  }
}
