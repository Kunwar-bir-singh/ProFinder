import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProvidersModel } from '../global/models/providers.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ProvidersModel])
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService]
})
export class ProvidersModule {}
