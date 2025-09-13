import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TestModel } from './others/test.model';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/exceptions.filter';
@Module({
  imports:
    [ConfigModule.forRoot({
      isGlobal: true,          // makes it available everywhere
      envFilePath: '.env',     // optional if .env is in root
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: '' + process.env.DB_HOST || 'localhost',
      port: parseInt((process.env.DB_PORT ?? '5432'), 10),
      username: '' + process.env.DB_USER || 'postgres',
      password: '' + process.env.DB_PASSWORD || 'password',
      database: '' + process.env.DB_NAME || 'profinder',
      autoLoadModels: true,
      synchronize: true,
      logging: console.log,
      timezone: '+05:30',
    }),
    SequelizeModule.forFeature(
      [TestModel]
    )],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  }],
})
export class AppModule { }
