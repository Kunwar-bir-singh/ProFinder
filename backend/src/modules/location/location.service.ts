import { Injectable } from '@nestjs/common';
import { CitiesModel, CityAttributes } from './models/cities.model';
import { InjectModel } from '@nestjs/sequelize';
import { handleError } from 'src/utils/handle.error';
import { Sequelize } from 'sequelize-typescript';
import {
  RecordDuplicateException,
  RecordNotFoundException,
} from 'src/common/utils/throw.exceptions.util';
import { findOrCreateCityDto } from './dto/location.dto';
import { Op } from 'sequelize';
import { formatName } from 'src/utils/formatName.util';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(CitiesModel)
    private readonly citiesModel: typeof CitiesModel,
    private readonly sequelize: Sequelize,
  ) {}

  async getAllCitiesDropDown() {
    try {
      return await this.citiesModel.findAll({
        attributes: ['city_id', 'city_name', 'raw_name'],
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findOrCreateCity(
    dto: findOrCreateCityDto,
  ): Promise<CityAttributes | undefined> {
    try {
      const { city, city_id } = dto;

      if (!city && !city_id) return undefined;
      console.log('city', city);

      const raw_name = formatName(city, 'raw');
      const formattedName = formatName(city, 'formatted');

      const cityExists = await this.checkCityExists<string>(
        city_id || raw_name,
      );

      if (cityExists) {
        return cityExists as CityAttributes;
      }

      const newCity = await this.citiesModel.create({
        city_name: formattedName,
        raw_name,
      });

      return newCity.get({ plain: true });
    } catch (error) {
      handleError(error);
    }
  }

  async checkCityExists<T>(value: T): Promise<undefined | CitiesModel> {
    try {
      const cityExists = await this.citiesModel.findOne({
        where: {
          [Op.or]: [
            { city_name: { [Op.eq]: String(value || '') } },
            { raw_name: { [Op.eq]: String(value || '') } },
            { city_id: { [Op.eq]: Number(value) || -1 } },
          ],
        },
        raw: true,
      });

      if (cityExists) {
        return cityExists;
      }

      return;
    } catch (error) {
      handleError(error);
    }
  }

  async deleteCity(city_id: number): Promise<Boolean> {
    try {
      await RecordNotFoundException(CitiesModel, { city_id }, 'City not found');

      await this.citiesModel.destroy({ where: { city_id } });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }
}
