import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TestModel } from './others/test.model';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(TestModel) private readonly testModel: typeof TestModel
  ){}

  getHealth(): string {
    console.log("HEalth check");
    
    return 'The server is healthy!';
  }

  getTest(){
    return this.testModel.findAll();
  }
}
