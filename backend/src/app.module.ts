import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TestModule } from './others/test.module';

@Module({
  imports: [SequelizeModule.forFeature(
    [TestModule]
  )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
