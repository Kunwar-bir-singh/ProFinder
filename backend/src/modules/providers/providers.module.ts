import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProvidersModel } from './models/providers.model';
import { LocationModule } from '../location/location.module';
import { ProfessionModule } from '../profession/profession.module';
@Module({
  imports: [SequelizeModule.forFeature([ProvidersModel]), LocationModule, ProfessionModule],
  providers: [ProvidersService],
  controllers: [ProvidersController],
  exports: [ProvidersService, SequelizeModule],
})
export class ProvidersModule {}
