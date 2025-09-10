import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports :[
        SequelizeModule.forRoot({
            dialect : 'postgres',
            host : 'localhost',
            port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
      models: [User],
      autoLoadModels: true,
      synchronize: true,
        })
    ]
})