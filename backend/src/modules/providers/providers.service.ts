import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProvidersModel } from './model/providers.model';
import { handleError } from 'src/utils/handle.error';

import { Transaction } from 'sequelize';
import { LocationService } from '../location/location.service';
import { ProfessionService } from '../profession/profession.service';
import { IDProviderProfessionDto } from '../provider-profession/dto/provider.profession.dto';
@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(ProvidersModel)
    private readonly providerModel: typeof ProvidersModel,
    private readonly professionService: ProfessionService,
  ) {}

  async createProvider(
    dto: any,
    transaction?: Transaction,
  ): Promise<Omit<IDProviderProfessionDto, 'cityID'> | undefined> {
    try {
      console.log('Dto bro', dto);

      const profession =
        await this.professionService.findOrCreateProfession(dto);

      const provider = await this.providerModel.create(dto, {
        transaction: transaction || null,
      });

      const plainProvider = provider.get({ plain: true });

      return {
        providerID: plainProvider?.providerID as number,
        professionID: profession?.professionID as number,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async getAllProviders(): Promise<ProvidersModel[]> {
    try {
      return await this.providerModel.findAll();
    } catch (error) {
      handleError(error);
      return [];
    }
  }

  async checkProviderExists(providerID: number): Promise<boolean> {
    try {
      const providerExists = await this.providerModel.findOne({
        where: { providerID },
      });
      return providerExists ? true : false;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async updateProvider(dto: any, transaction?: Transaction): Promise<boolean> {
    try {
      const { providerID } = dto;

      await this.providerModel.update(dto, {
        where: { providerID },
        transaction: transaction || null,
      });

      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }
}
