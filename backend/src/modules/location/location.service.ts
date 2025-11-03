import { Injectable } from '@nestjs/common';
import { CitiesModel, CityAttributes } from './model/cities.model';
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
        attributes: ['cityID', 'cityName', 'rawName'],
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findOrCreateCity(
    dto: findOrCreateCityDto,
  ): Promise<CityAttributes | undefined> {
    const transaction = await this.sequelize.transaction();
    try {
      const { city, cityID } = dto;

      const rawName = formatName(city, 'raw');
      const formattedName = formatName(city, 'formatted');

      const cityExists = await this.checkCityExists<string>(cityID || rawName);

      if (cityExists) {
        return cityExists as CityAttributes;
      }

      const newCity = await this.citiesModel.create(
        { cityName: formattedName, rawName },
        { transaction },
      );

      await transaction.commit();

      return newCity.get({ plain: true });

    } catch (error) {
      await transaction.rollback();
      handleError(error);
    }
  }

  async checkCityExists<T>(value: T): Promise<Boolean | CitiesModel> {
    try {
      const cityExists = await this.citiesModel.findOne({
        where: {
          [Op.or]: [
            { cityName: { [Op.eq]: String(value || '') } },
            { rawName: { [Op.eq]: String(value || '') } },
            { cityID: { [Op.eq]: Number(value) || -1 } },
          ],
        },
        raw: true,
      });

      if (cityExists) {
        return cityExists;
      }

      return false;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async deleteCity(cityID: number): Promise<Boolean> {
    try {
      await RecordNotFoundException(CitiesModel, { cityID }, 'City not found');

      await this.citiesModel.destroy({ where: { cityID } });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }
}
