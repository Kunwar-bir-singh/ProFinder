import { Module } from '@nestjs/common';
import { ProfessionsModel } from '../profession/model/profession.model';
import { ProvidersModel } from '../providers/model/providers.model';
import { UsersModel } from '../users/model/users.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        SequelizeModule.forFeature([UsersModel, ProvidersModel, ProfessionsModel]),

    ],
})
export class GlobalModule { }
