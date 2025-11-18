import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProvidersModel } from './models/providers.model';
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
  ): Promise<Omit<IDProviderProfessionDto, 'city_id'> | undefined> {
    try {
      console.log('Dto bro', dto);

      const profession =  await this.professionService.findOrCreateProfession(dto);

      const providerExits = await this.providerModel.findOne({
        where: { user_id: dto.user_id },
      });

      if (providerExits) {
        return {
          provider_id: providerExits?.provider_id as number,
          profession_id: profession?.profession_id as number,
        };
      }

      const provider = await this.providerModel.create(dto, {
        transaction: transaction || null,
      });

      const plainProvider = provider.get({ plain: true });

      return {
        provider_id: plainProvider?.provider_id as number,
        profession_id: profession?.profession_id as number,
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

  async checkProviderExists(provider_id: number): Promise<boolean> {
    try {
      const providerExists = await this.providerModel.findOne({
        where: { provider_id },
      });
      return providerExists ? true : false;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async updateProvider(dto: any, transaction?: Transaction): Promise<boolean> {
    try {
      const { provider_id } = dto;

      if (!provider_id) {
        throw new Error('provider_id is required for provider update');
      }

      const result = await this.providerModel.update(dto, {
        where: { provider_id },
        transaction: transaction || null,
      });

      return result[0] > 0; // Sequelize update returns [affectedCount]
    } catch (error) {
      handleError(error);
      return false;
    }
  }
}
