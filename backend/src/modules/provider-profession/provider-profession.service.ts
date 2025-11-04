import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProfessionService } from '../profession/profession.service';
import { ProviderProfessionModel } from './model/provider-profession.model';
import { LocationService } from '../location/location.service';
import { ProviderProfessionDto } from './dto/provider.profession.dto';
import { handleError } from 'src/utils/handle.error';
import { Exception } from 'src/common/interface/exception.interface';

@Injectable()
export class ProviderProfessionService {
  constructor(
    @InjectModel(ProviderProfessionModel)
    private readonly providerProfessionModel: typeof ProviderProfessionModel,

    private readonly professionService: ProfessionService,
    private readonly locationService: LocationService,
  ) {}

  async linkProviderProfession(dto: ProviderProfessionDto) {
    try {
      const { providerID, cityID, professionID } = dto;

      const alreadyLinked = await this.providerProfessionModel.findOne({
        where: { providerID, cityID, professionID },
      });
      if (alreadyLinked)
        throw new BadRequestException('Profession already linked to provider');

      await this.providerProfessionModel.create(dto);

      return { message: 'Profession linked to provider successfully!' };
    } catch (error) {
      handleError(error);
    }
  }

  async unLinkProviderProfession(dto: ProviderProfessionDto) {
    try {
      const { providerID, cityID, professionID } = dto;

      const alreadyLinked = await this.providerProfessionModel.findOne({
        where: { providerID, cityID, professionID },
      });
      if (!alreadyLinked)
        throw new BadRequestException('Profession not linked to provider');

      await this.providerProfessionModel.destroy({
        where: { providerID, cityID, professionID },
      });

      return { message: 'Profession unlinked from provider successfully!' };
    } catch (error) {
      handleError(error);
    }
  }

  async getProviderPerProfessionPerCity(dto: ProviderProfessionDto) {
    try {
      const { cityID, professionID } = dto;

      const professionExists =
        await this.professionService.checkProfessionExists(professionID);

      if (!professionExists)
        throw new BadRequestException('Profession not found');

      const cityExists = await this.locationService.checkCityExists(cityID);
      if (!cityExists) throw new BadRequestException('City not found');

      const { rows, count } =
        await this.providerProfessionModel.findAndCountAll({
          where: { cityID, professionID },
          raw: true,
        });

      if (count == 0) {
        const exception: Exception = {
          errors: [
            {
              message:
                'No providers found for the given profession in the specified city',
            },
          ],
          message:
            'No providers found for the given profession in the specified city',
        };
        throw new BadRequestException(exception);
      }

      return rows;
    } catch (error) {
      handleError(error);
    }
  }
}
