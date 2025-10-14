import { Module } from '@nestjs/common';
import { ProvidersController, ProvidersProfessionController } from './providers.controller';
import { ProviderProfessionService, ProvidersService } from './providers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProvidersModel } from '../global/models/providers.model';
import { ProviderProfessionModel } from '../global/models/provider-profession.model';
import { LocationModule } from '../location/location.module';
import { ProfessionModule } from '../profession/profession.module';
import { UsersBookmarkModel } from '../global/models/users-bookmark.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ProvidersModel, ProviderProfessionModel]),
    LocationModule, ProfessionModule
  ],
  providers: [ProvidersService, ProviderProfessionService],
  controllers: [ProvidersController, ProvidersProfessionController],
  exports: [ProvidersService, SequelizeModule]
})
export class ProvidersModule { }
