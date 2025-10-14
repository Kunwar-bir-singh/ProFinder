import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProfessionsModel } from '../global/models/profession.model';
import { CitiesModel } from '../global/models/cities.model';
import { handleError } from 'src/utils/handle.error';
import { Sequelize } from 'sequelize-typescript';
import { LocationService } from '../location/location.service';

@Injectable()
export class ProfessionService {
    constructor(
        @InjectModel(ProfessionsModel) private readonly professionModel: typeof ProfessionsModel,
        @InjectModel(CitiesModel) private readonly cityModel: typeof CitiesModel,

        private readonly locationService: LocationService,
        private readonly sequelize: Sequelize
    ) { }

    async createProfession(dto: any) {
        const transaction = await this.sequelize.transaction();
        try {
            const { cityName } = dto;

            const professionCityID = await this.locationService.createCity({ cityName });

            await this.professionModel.create({ ...dto, cityID: professionCityID }, { transaction });

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            handleError(error);
        }
    }

    async getProfessionsPerCity(dto : any) {
        try {
            const { cityID } = dto;
            const professions = await this.professionModel.findAll({
                include: [
                    {
                        model: this.cityModel,
                        where: { cityID },
                        required: true
                    }
                ]
            });

            return professions;

        } catch (error) {
            handleError(error);
        }
    }

    async checkProfessionExists(professionID: number): Promise<Boolean> {
        try {
            const professionExists = await this.professionModel.findOne({ where: { professionID } });

            if (professionExists) {
                return true;
            }

            return false;

        } catch (error) {
            handleError(error);
            return false;
        }
    }
}
