import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CitiesModel } from './model/cities.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CitiesModel
    ])
  ],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService, SequelizeModule]
})
export class LocationModule {}
