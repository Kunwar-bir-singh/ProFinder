import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersModel } from './model/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersBookmarkModel } from './model/users-bookmark.model';
import { ProvidersModule } from '../providers/providers.module';
import { HashModule } from '../hash/hash.module';
import { LocationService } from '../location/location.service';
import { ProvidersService } from '../providers/providers.service';
import { CitiesModel } from '../location/model/cities.model';

@Module({
   imports: [
      SequelizeModule.forFeature([UsersModel, UsersBookmarkModel, CitiesModel]),
      ProvidersModule
    ],
  controllers: [UsersController],
  providers: [UsersService, ProvidersService, LocationService],
  exports: [UsersService, SequelizeModule]
})
export class UsersModule {}
