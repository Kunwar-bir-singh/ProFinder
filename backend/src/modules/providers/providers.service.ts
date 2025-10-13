import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProvidersModel } from '../global/models/providers.model';
import { ProviderProfessionModel } from '../global/models/provider-profession.model';
import { handleError } from 'src/utils/handle.error';
import { LinkProviderProfessionDto } from './dto/provider.profession.dto';
import { RecordNotFoundException } from 'src/common/utils/throw.exceptions.util';

@Injectable()
export class ProvidersService {
    constructor(
        @InjectModel(ProvidersModel)
        private readonly providerModel: typeof ProvidersModel
    ) { }

 
}

@Injectable()
export class ProviderProfessionService {
    constructor(
       @InjectModel(ProviderProfessionModel)
       private readonly providerProfessionModel: typeof ProviderProfessionModel
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

            await RecordNotFoundException

            const provider = await this.providerProfessionModel.findOne({ where: { cityID, professionID }, raw: true });
            return provider;
        } catch (error) {
            handleError(error);
        }
    }
}
