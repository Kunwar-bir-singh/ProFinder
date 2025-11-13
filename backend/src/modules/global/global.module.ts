import { Module } from '@nestjs/common';
import { ProfessionsModel } from '../profession/models/profession.model';
import { ProvidersModel } from '../providers/models/providers.model';
import { UsersModel } from '../users/models/users.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        SequelizeModule.forFeature([UsersModel, ProvidersModel, ProfessionsModel]),

    ],
})
export class GlobalModule { }
