import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from './models/users.model';
import { handleError } from 'src/utils/handle.error';
import { UserAndProviderDTo } from '../global/dto/common.dto';
import { UsersBookmarkModel } from './models/users-bookmark.model';
import { Op, Transaction } from 'sequelize';
import { ProvidersService } from '../providers/providers.service';
import { Sequelize } from 'sequelize-typescript';
import { RecordNotFoundException } from 'src/common/utils/throw.exceptions.util';
import { ProvidersModel } from '../providers/models/providers.model';
import { UserExistsDto } from '../auth/dto/auth.dto';
import { LocationService } from '../location/location.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel)
    private readonly userModel: typeof UsersModel,
    @InjectModel(ProvidersModel)
    private readonly providersModel: typeof ProvidersModel,
    @InjectModel(UsersBookmarkModel)
    private readonly usersBookmarkModel: typeof UsersBookmarkModel,

    private readonly providersService: ProvidersService,
    private readonly locationService: LocationService,
    private readonly sequelize: Sequelize,
  ) {}

  async createUser(
    dto: any,
    oAuth: string = 'local',
    transaction?: Transaction,
  ) {
    try {
      if (oAuth === 'local' && (await this.checkUserExists(dto)))
        throw new ConflictException('User already exists');

      const city = await this.locationService.findOrCreateCity(dto);

      const userCreated = await this.userModel.create(
        { ...dto, city_id: city?.city_id },
        { transaction },
      );

      const plainUser = userCreated.get({ plain: true });

      if (dto.isProvider) {
        await this.providersService.createProvider(
          { ...dto, user_id: plainUser.user_id },
          transaction,
        );
      }

      return plainUser;
    } catch (error) {
      handleError(error);
    }
  }

  async checkUserExists(dto: UserExistsDto): Promise<UsersModel | null> {
    try {
      const { username, email, phone } = dto;
      const userExists = await this.userModel.findOne({
        where: {
          [Op.or]: [
            { username: { [Op.eq]: username } },
            { email: { [Op.eq]: email } },
            { phone: { [Op.eq]: phone } },
          ],
        },
        raw: true,
      });

      if (userExists) return userExists;
      return null;
    } catch (error) {
      handleError(error);
      return null;
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userModel.findAll({
        raw: true,
        attributes: { exclude: ['password'] },
      });
      return users;
    } catch (error) {
      handleError(error);
    }
  }

  async getUserDetails(user_id: number) {
    try {
      return await this.userModel.findOne({
        where: { user_id },
        raw: true,
        attributes: { exclude: ['password'] },
        include: [
          {
            model: this.providersModel,
            as: 'provider',
            attributes: ['provider_id', 'description'],
          },
        ],
      });
    } catch (error) {
      handleError(error);
    }
  }

  async getBookmarkedPrvoiders(user_id: number) {
    try {
      const { rows, count} = await this.usersBookmarkModel.findAndCountAll({
        where: { user_id },
        raw: true,
      });

      return { rows, count };
    } catch (error) {
      handleError(error);
    }
  }

  async updateUserDetails(dto: any): Promise<Boolean> {
    const transaction = await this.sequelize.transaction();
    try {
      const { user_id } = dto;

      await RecordNotFoundException(
        user_id,
        await this.userModel.findOne({ where: { user_id }, raw: true }),
      );

      const city = await this.locationService.findOrCreateCity(dto);

      await this.userModel.update(
        { ...dto, city_id: city?.city_id },
        { where: { user_id }, transaction },
      );

      if (dto.isProvider) {
        await this.providersService.updateProvider(dto, transaction);
      }
      return true;
    } catch (error) {
      await transaction.rollback();
      handleError(error);
      return false;
    }
  }

  async createOrUpdateProviderBookmark(dto: UserAndProviderDTo) {
    try {
      const { user_id, provider_id } = dto;

      await RecordNotFoundException(
        this.userModel,
        { user_id },
        'User not found',
      );
      await RecordNotFoundException(
        this.providersModel,
        { provider_id },
        'Provider not found',
      );

      const alreadyBookmarked = await this.usersBookmarkModel.findOne({
        where: { user_id, provider_id },
      });

      if (alreadyBookmarked) {
        await this.usersBookmarkModel.destroy({
          where: { user_id, provider_id },
        });
        return { message: 'Provider un-bookmarked successfully!' };
      }

      await this.usersBookmarkModel.create(dto);

      return { message: 'Provider bookmarked successfully!' };
    } catch (error) {
      handleError(error);
    }
  }
}
