import { Injectable } from '@nestjs/common';
import { CitiesModel } from './model/cities.model';
import { InjectModel } from '@nestjs/sequelize';
import { handleError } from 'src/utils/handle.error';
import { Sequelize } from 'sequelize-typescript';
import { convertNameToRaw } from 'src/utils/convertCityName.util';
import { RecordDuplicateException, RecordNotFoundException } from 'src/common/utils/throw.exceptions.util';
import { findOrCreateCityDto } from './dto/location.dto';
import { Op } from 'sequelize';

@Injectable()
export class LocationService {
    constructor(
        @InjectModel(CitiesModel)
        private readonly citiesModel: typeof CitiesModel,
        private readonly sequelize: Sequelize,
    ) { }

    async getAllCities() {
        try {
            return await this.citiesModel.findAll();

        } catch (error) {
            handleError(error);
        }
    }

    async findOrCreateCity(dto: findOrCreateCityDto): Promise<CitiesModel | undefined> {
        const transaction = await this.sequelize.transaction();
        try {
            const { city } = dto;

            const rawName = convertNameToRaw(city);

            const cityExists = await this.checkCityExists<string>(rawName);

            if (cityExists) {
                return cityExists as CitiesModel;
            }

            const newCity = await this.citiesModel.create({ cityName: city, rawName }, { transaction });
            await transaction.commit();

            return newCity
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
                        { cityName: { [Op.eq]: String(value) } },
                        { rawName: { [Op.eq]: String(value) } }
                    ]
                }
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
