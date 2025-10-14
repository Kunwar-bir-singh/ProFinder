import { Module } from '@nestjs/common';
import { ProfessionController } from './profession.controller';
import { ProfessionService } from './profession.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfessionsModel } from '../global/models/profession.model';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProfessionsModel]),
    LocationModule,
  ],
  controllers: [ProfessionController],
  providers: [ProfessionService],
  exports: [ProfessionService, SequelizeModule]
})
export class ProfessionModule { }
