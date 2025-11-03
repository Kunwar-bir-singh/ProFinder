import { Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ProfessionAttributes,
  ProfessionsModel,
} from './model/profession.model';
import { handleError } from 'src/utils/handle.error';
import { Sequelize } from 'sequelize-typescript';
import { LocationService } from '../location/location.service';
import { formatName } from 'src/utils/formatName.util';
import { ProviderProfessionDto } from '../provider-profession/dto/provider.profession.dto';
import { ProfessionDto } from './dto/profession.dto';

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
      const { professionID, professionName } = dto;

      const rawName = formatName(professionName, 'raw');
      const formattedName = formatName(professionName, 'formatted');

      const professionExists = await this.checkProfessionExists<number | string>(professionID || rawName);

      if (professionExists) {
        return professionExists as ProfessionAttributes;
      }

      const newProfession = await this.professionModel.create(
        { professionName: formattedName, rawName },
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
  ): Promise<boolean | ProfessionsModel> {
    try {
      const professionExists = await this.professionModel.findOne({
        where: {
          [Op.or]: [
            { professionName: { [Op.eq]: String(value || '') } },
            { rawName: { [Op.eq]: String(value || '') } },
            { professionID: { [Op.eq]: Number(value) || -1 } },
          ],
        },
        raw: true,
      });

      if (professionExists) {
        return professionExists;
      }

      return false;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async createProfession(dto: any): Promise<ProviderProfessionDto | null> {
    const transaction = await this.sequelize.transaction();
    try {
      const { providerID, professionName } = dto;

      const rawName = formatName(professionName, 'raw');
      const formattedName = formatName(professionName, 'formatted');

      const professionCity = await this.locationService.findOrCreateCity(dto);

      const newProfession = await this.professionModel.create(
        { professionName: formattedName, rawName },
        { transaction },
      );

      await transaction.commit();
      return {
        providerID,
        cityID: professionCity?.cityID as number,
        professionID: newProfession?.professionID as number,
      };
    } catch (error) {
      await transaction.rollback();
      handleError(error);
      return null;
    }
  }

  // async getProfessionsPerCity(dto: any) {
  //   try {
  //     const { cityID } = dto;
  //     const professions = await this.professionModel.findAll({
  //       include: [
  //         {
  //           model: this.cityModel,
  //           where: { cityID },
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
