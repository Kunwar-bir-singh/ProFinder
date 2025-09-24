import { Module } from '@nestjs/common';
import { ProfessionsModel } from './models/profession.model';
import { ProvidersModel } from './models/providers.model';
import { UsersModel } from './models/users.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        SequelizeModule.forFeature([UsersModel, ProvidersModel, ProfessionsModel]),

    ],
})
export class GlobalModule { }
