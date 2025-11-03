import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from './model/users.model';
import { CitiesModel } from '../location/model/cities.model';
import { UsersBookmarkModel } from './model/users-bookmark.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ProvidersModule } from '../providers/providers.module';
import { LocationService } from '../location/location.service';
import { ProvidersService } from '../providers/providers.service';
import { ProfessionModule } from '../profession/profession.module';
import { LocationModule } from '../location/location.module';

@Module({
   imports: [
      SequelizeModule.forFeature([UsersModel, UsersBookmarkModel]),
      ProvidersModule,LocationModule, ProfessionModule
    ],
  controllers: [UsersController],
  providers: [UsersService, ProvidersService, LocationService],
  exports: [UsersService, SequelizeModule]
})
export class UsersModule {}
