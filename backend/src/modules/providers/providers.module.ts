import { Module } from '@nestjs/common';
import { ProvidersController, ProvidersProfessionController } from './providers.controller';
import { ProviderProfessionService, ProvidersService } from './providers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProvidersModel } from '../global/models/providers.model';
import { ProviderProfessionModel } from '../global/models/provider-profession.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ProvidersModel, ProviderProfessionModel])
  ],
  providers: [ProvidersService, ProviderProfessionService],
  controllers: [ProvidersController, ProvidersProfessionController],
})
export class ProvidersModule { }
