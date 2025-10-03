import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../global/models/users.model';
import { handleError } from 'src/utils/handle.error';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(UsersModel)
        private readonly userModel: typeof UsersModel
    ) { }

    async getUser(userID: number) {
        try {
            return await this.userModel.findOne({ where: { userID }, raw: true });

        } catch (error) {
            handleError(error);
        }
    }

       async getBookmarkedPrvoiders(userID: number) {
        try {
            return await this.userModel.findOne({ where: { userID }, attributes: ['bookmarkedProviders'], raw: true });
        } catch (error) {
            handleError(error);
        }
    }
}
