import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProvidersModel } from './model/providers.model';
import { ProviderProfessionModel } from './model/provider-profession.model';
import { handleError } from 'src/utils/handle.error';
import { LinkProviderProfessionDto } from './dto/provider.profession.dto';
import { LocationService } from '../location/location.service';
import { Transaction } from 'sequelize';
import { ProfessionService } from '../profession/profession.service';
@Injectable()
export class ProvidersService {
    constructor(
        @InjectModel(ProvidersModel)
        private readonly providerModel: typeof ProvidersModel
    ) { }

    async createProvider(dto: any, transaction? : Transaction): Promise<Boolean> {
        try {
            await this.providerModel.create(dto, { transaction : transaction || null });
            return true;

        } catch (error) {
            handleError(error);
            return false;
        }
    }

    async checkProviderExists(providerID: number): Promise<Boolean> {
        try {
            const providerExists = await this.providerModel.findOne({ where: { providerID } });
            return providerExists ? true : false;
        } catch (error) {
            handleError(error);
            return false;
        }
    }

    async updateProvider(dto: any, transaction? : Transaction): Promise<Boolean> {
        try {
            const { providerID } = dto;

            await this.providerModel.update(dto, { where: { providerID }, transaction : transaction || null });
            
            return true;

        } catch (error) {
            handleError(error);
            return false;
        }
    }

}

@Injectable()
export class ProviderProfessionService {
    constructor(
        @InjectModel(ProviderProfessionModel)
        private readonly providerProfessionModel: typeof ProviderProfessionModel,

        private readonly professionService: ProfessionService,
        private readonly locationService: LocationService,

    ) { }

    async linkProviderProfession(dto: LinkProviderProfessionDto) {
        try {
            const { providerID, cityID, professionID } = dto;

            const alreadyLinked = await this.providerProfessionModel.findOne({ where: { providerID, cityID, professionID } });
            if (alreadyLinked) throw new BadRequestException('Profession already linked to provider');

            await this.providerProfessionModel.create(dto);

            return { message: 'Profession linked to provider successfully!' };

        } catch (error) {
            handleError(error);
        }
    }

    async unLinkProviderProfession(dto: LinkProviderProfessionDto) {
        try {
            const { providerID, cityID, professionID } = dto;

            const alreadyLinked = await this.providerProfessionModel.findOne({ where: { providerID, cityID, professionID } });
            if (!alreadyLinked) throw new BadRequestException('Profession not linked to provider');

            await this.providerProfessionModel.destroy({ where: { providerID, cityID, professionID } });

            return { message: 'Profession unlinked from provider successfully!' };

        } catch (error) {
            handleError(error);
        }
    }

    async getProviderPerProfessionPerCity(dto: any) {
        try {
            const { cityID, professionID } = dto;

            const professionExists = await this.professionService.checkProfessionExists(professionID);
            if (!professionExists) throw new BadRequestException('Profession not found');

            const cityExists = await this.locationService.checkCityExists(cityID);
            if (!cityExists) throw new BadRequestException('City not found');

            const provider = await this.providerProfessionModel.findAndCountAll({ where: { cityID, professionID }, raw: true });

            return provider;
        } catch (error) {
            handleError(error);
        }
    }
}

