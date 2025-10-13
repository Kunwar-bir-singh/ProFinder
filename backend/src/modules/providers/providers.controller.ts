import { Body, Controller, Post } from '@nestjs/common';
import { ProviderProfessionService } from './providers.service';
import { ProviderProfessionModel } from '../global/models/provider-profession.model';
import { LinkProviderProfessionDto } from './dto/provider.profession.dto';

@Controller('providers')
export class ProvidersController {
    
}

@Controller('profession')
export class ProvidersProfessionController {
    constructor(
        private readonly providerProfessionService: ProviderProfessionService
    ) {}
    
    @Post('link')
    async linkProviderProfession(@Body() dto: LinkProviderProfessionDto) {
        return this.providerProfessionService.linkProviderProfession(dto);
    }

    @Post('unlink')
    async unLinkProviderProfession(@Body() dto: LinkProviderProfessionDto) {
        return this.providerProfessionService.unLinkProviderProfession(dto);
    }
}
