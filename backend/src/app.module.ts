import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TestModel } from './others/test.model';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/exceptions.filter';
import { ProfessionModule } from './modules/profession/profession.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { UsersModule } from './modules/users/users.module';
import { GlobalModule } from './modules/global/global.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports:
    [ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
    ),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: '' + process.env.DB_HOST || 'localhost',
      port: parseInt((process.env.DB_PORT ?? '16345'), 10),
      username: '' + process.env.DB_USER || 'postgres',
      password: '' + process.env.DB_PASSWORD || 'postgres',
      database: '' + process.env.DB_NAME || 'profinder',
      autoLoadModels: true,
      sync: { alter: true },
      logging: console.log,
      timezone: '+05:30',
      retry: {
        max: 1,
      },
    }),

    SequelizeModule.forFeature(
      [TestModel]
    ), GlobalModule, AuthModule, UsersModule,ProvidersModule, ProfessionModule ],
  
    controllers: [AppController],
    providers: [AppService, {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  }],
})
export class AppModule { }
