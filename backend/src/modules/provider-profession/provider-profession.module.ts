import { Module } from '@nestjs/common';
import { ProviderProfessionService } from './provider-profession.service';
import { ProvidersProfessionController } from './provider-profession.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProviderProfessionModel } from './models/provider-profession.model';
import { LocationModule } from '../location/location.module';
import { ProfessionModule } from '../profession/profession.module';

@Module({
  imports: [SequelizeModule.forFeature([ProviderProfessionModel]), LocationModule, ProfessionModule],
  providers: [ProviderProfessionService],
  controllers: [ProvidersProfessionController],
  exports: [ProviderProfessionService],
})
export class ProviderProfessionModule {}
