import { Injectable } from '@nestjs/common';
import { CitiesModel } from '../global/models/cities.model';
import { InjectModel } from '@nestjs/sequelize';
import { handleError } from 'src/utils/handle.error';
import { Sequelize } from 'sequelize-typescript';
import { RecordDuplicateException } from 'src/common/utils/throw.exceptions.util';
import { convertCityName } from 'src/utils/convertCityName.util';

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

    async createCity(dto: any) {
        const transaction = await this.sequelize.transaction();
        try {
            const { cityName } = dto;

            const rawName = convertCityName(cityName);

            const cityExists = await this.citiesModel.findOne({ where: { rawName }, transaction, raw: true });

            if (cityExists) {
                return cityExists;
            }
            const city = await this.citiesModel.create(dto);
            await transaction.commit();

            return city
        } catch (error) {
            await transaction.rollback();
            handleError(error);
        }
    }

    async checkCityExists(cityID: number): Promise<Boolean> {
        try {
            const cityExists = await this.citiesModel.findOne({ where: { cityID } });

            if (cityExists) {
                return true;
            }

            return false;

        } catch (error) {
            handleError(error);
            return false;
        }
    }
}
