import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from './model/users.model';
import { handleError } from 'src/utils/handle.error';
import { UserAndProviderDTo } from '../global/dto/common.dto';
import { UsersBookmarkModel } from './model/users-bookmark.model';
import { Op, Transaction } from 'sequelize';
import { ProvidersService } from '../providers/providers.service';
import { Sequelize } from 'sequelize-typescript';
import { RecordNotFoundException } from 'src/common/utils/throw.exceptions.util';
import { ProvidersModel } from '../providers/model/providers.model';

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
        private readonly sequelize: Sequelize,
    ) { }

    async createUser(dto: any, transaction?: Transaction) {
        try {

            if (await this.checkUserExists(dto)) throw new ConflictException('User already exists');

            const userCreated = await this.userModel.create(dto, { transaction });

            if (dto.isProvider) {
                await this.providersService.createProvider({ ...dto, userID: userCreated.userID }, transaction);
            }

            return true;

        } catch (error) {
            handleError(error);
            return false;
        }
    }

    async checkUserExists(dto: any): Promise<UsersModel | null> {
        try {

            const { username, email, phone } = dto;
            const userExists = await this.userModel.findOne({
                where: {
                    [Op.or]: [
                        { username: username || null },
                        { email: email || null },
                        { phone: phone || null }
                    ]
                },
                raw: true
            });
            if (userExists) return userExists;
            return null;
        } catch (error) {
            handleError(error);
            return null;
        }
    }

    async getUser(userID: number) {
        try {
            return await this.userModel.findOne({
                where: { userID }, raw: true, include: {
                    model: this.providersModel,
                    as: 'provider',
                    attributes: ['providerID', 'description']
                }
            });

        } catch (error) {
            handleError(error);
        }
    }

    async getBookmarkedPrvoiders(userID: number) {
        try {
            const bookmarks = await this.usersBookmarkModel.findOne({ where: { userID }, raw: true });

            return bookmarks || [];
        } catch (error) {
            handleError(error);
        }
    }

    async updateUser(dto: any): Promise<Boolean> {
        const transaction = await this.sequelize.transaction();
        try {
            const { userID } = dto;

            await RecordNotFoundException(userID, await this.userModel.findOne({ where: { userID }, raw: true }));

            await this.userModel.update(dto, { where: { userID }, transaction });

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
            const { userID, providerID } = dto;

            await RecordNotFoundException(this.userModel, { userID }, 'User not found');
            await RecordNotFoundException(this.providersModel, { providerID }, 'Provider not found');

            const alreadyBookmarked = await this.usersBookmarkModel.findOne({ where: { userID, providerID } });

            if (alreadyBookmarked) {
                await this.usersBookmarkModel.destroy({ where: { userID, providerID } });
                return { message: 'Provider unbookmarked successfully!' };
            }

            await this.usersBookmarkModel.create(dto);

            return { message: 'Provider bookmarked successfully!' };

        } catch (error) {
            handleError(error);
        }
    }




}
