import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../global/models/users.model';
import { handleError } from 'src/utils/handle.error';
import { RecordDuplicateException } from 'src/common/utils/throw.exceptions.util';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UsersModel)
        private readonly userModel: typeof UsersModel,

    ) { }

    async registerUser(dto: any): Promise<any> {
        try {

            const { username, password, email, phone } = dto;
            const userExists = await this.userModel.findOne({
                where: {
                    [Op.or]: [
                        { username: username },
                        { email: email },
                        { phone: phone }
                    ]
                }
            });

            if (userExists) throw new ConflictException('User already exists');


            const hashedPassword = await bcrypt.hash(password, 10);

            await this.userModel.create({ password: hashedPassword, ...dto });
            return;

        } catch (error) {
            handleError(error);
        }
    }
}
