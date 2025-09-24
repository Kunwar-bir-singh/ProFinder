import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersModel } from '../global/models/users.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
   imports: [
      SequelizeModule.forFeature([UsersModel])
    ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
