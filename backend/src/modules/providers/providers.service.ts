import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProvidersModel } from '../global/models/providers.model';

@Injectable()
export class ProvidersService {

    constructor(
        @InjectModel(ProvidersModel)
        private readonly providerModel: typeof ProvidersModel
    ) { }

 
}
