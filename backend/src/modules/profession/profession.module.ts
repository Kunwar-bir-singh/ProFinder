import { Module } from '@nestjs/common';
import { ProfessionController } from './profession.controller';
import { ProfessionService } from './profession.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfessionsModel } from './models/profession.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ProfessionsModel])
  ],
  controllers: [ProfessionController],
  providers: [ProfessionService]
})
export class ProfessionModule { }
