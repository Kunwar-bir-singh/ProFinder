import { Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ProfessionAttributes,
  ProfessionsModel,
} from './models/profession.model';
import { handleError } from 'src/utils/handle.error';
import { Sequelize } from 'sequelize-typescript';
import { LocationService } from '../location/location.service';
import { formatName } from 'src/utils/formatName.util';
import { ProfessionDto } from './dto/profession.dto';
import { IDProviderProfessionDto } from '../provider-profession/dto/provider.profession.dto';

@Injectable()
export class ProfessionService {
  constructor(
    @InjectModel(ProfessionsModel)
    private readonly professionModel: typeof ProfessionsModel,

    private readonly sequelize: Sequelize,
    private readonly locationService: LocationService,
  ) {}

  async findOrCreateProfession(
    dto: ProfessionDto,
  ): Promise<ProfessionAttributes | undefined> {
    const transaction = await this.sequelize.transaction();
    try {
      const { profession_id, profession_name } = dto;

      const raw_name = formatName(profession_name, 'raw');
      const formattedName = formatName(profession_name, 'formatted');

      const professionExists = await this.checkProfessionExists<number | string>(profession_id || raw_name);

      if (professionExists) {
        return professionExists as ProfessionAttributes;
      }

      const newProfession = await this.professionModel.create(
        { profession_name: formattedName, raw_name },
        { transaction },
      );

      await transaction.commit();
      return newProfession.get({ plain: true });
    } catch (error) {
      await transaction.rollback();
      handleError(error);
    }
  }

  async checkProfessionExists<T>(
    value: T,
  ): Promise<undefined | ProfessionsModel> {
    try {
      const professionExists = await this.professionModel.findOne({
        where: {
          [Op.or]: [
            { profession_name: { [Op.eq]: String(value || '') } },
            { raw_name: { [Op.eq]: String(value || '') } },
            { profession_id: { [Op.eq]: Number(value) || -1 } },
          ],
        },
        raw: true,
      });

      if (professionExists) {
        return professionExists;
      }

      return ;
    } catch (error) {
      handleError(error);
      
    }
  }

  async createProfession(dto: any): Promise<IDProviderProfessionDto | null> {
    const transaction = await this.sequelize.transaction();
    try {
      const { provider_id, profession_name } = dto;

      const raw_name = formatName(profession_name, 'raw');
      const formattedName = formatName(profession_name, 'formatted');

      const professionCity = await this.locationService.findOrCreateCity(dto);

      const newProfession = await this.professionModel.create(
        { profession_name: formattedName, raw_name },
        { transaction },
      );

      await transaction.commit();
      return {
        provider_id,
        city_id: professionCity?.city_id as number,
        profession_id: newProfession?.profession_id as number,
      };
    } catch (error) {
      await transaction.rollback();
      handleError(error);
      return null;
    }
  }

  // async getProfessionsPerCity(dto: any) {
  //   try {
  //     const { city_id } = dto;
  //     const professions = await this.professionModel.findAll({
  //       include: [
  //         {
  //           model: this.cityModel,
  //           where: { city_id },
  //           required: true,
  //         },
  //       ],
  //     });

  //     return professions;
  //   } catch (error) {
  //     handleError(error);
  //   }
  // }
}
