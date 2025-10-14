import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersModel } from '../global/models/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersBookmarkModel } from '../global/models/users-bookmark.model';
import { ProvidersModule } from '../providers/providers.module';
import { HashModule } from '../hash/hash.module';

@Module({
   imports: [
      SequelizeModule.forFeature([UsersModel, UsersBookmarkModel]),
      ProvidersModule
    ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, SequelizeModule]
})
export class UsersModule {}
