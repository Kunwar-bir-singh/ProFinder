import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProvidersService } from './providers.service';

@Controller('providers')
export class ProvidersController {
    constructor(
        private readonly providersService: ProvidersService
    ) { }

    @Get('all')
    async getAllProviders() {
        return await this.providersService.getAllProviders();
    }
}
