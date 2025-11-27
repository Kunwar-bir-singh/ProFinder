import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from './models/users.model';
import { CitiesModel } from '../location/models/cities.model';
import { UserBookmarksModel } from './models/user-bookmarks.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ProvidersModule } from '../providers/providers.module';
import { LocationService } from '../location/location.service';
import { ProvidersService } from '../providers/providers.service';
import { ProfessionModule } from '../profession/profession.module';
import { LocationModule } from '../location/location.module';
import { MailModule } from '../mail/mail.module';
import { ProviderProfessionModule } from '../provider-profession/provider-profession.module';

@Module({
  imports: [
    SequelizeModule.forFeature([UsersModel, UserBookmarksModel]),
    LocationModule,
    ProvidersModule,
    ProfessionModule,
    ProviderProfessionModule,
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ProvidersService, LocationService],
  exports: [UsersService, SequelizeModule],
})
export class UsersModule {}
