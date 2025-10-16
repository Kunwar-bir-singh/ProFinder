import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProviderProfessionService } from './providers.service';
import { ProviderProfessionDto } from './dto/provider.profession.dto';

@Controller('providers')
export class ProvidersController {}

@Controller('profession')
export class ProvidersProfessionController {
  constructor(
    private readonly providerProfessionService: ProviderProfessionService,
  ) {}

  @Post('link')
  async linkProviderProfession(@Body() dto: ProviderProfessionDto) {
    return this.providerProfessionService.linkProviderProfession(dto);
  }

  @Post('unlink')
  async unLinkProviderProfession(@Body() dto: ProviderProfessionDto) {
    return this.providerProfessionService.unLinkProviderProfession(dto);
  }

  @Get('providers')
  async getProviderPerProfessionPerCity(@Query() dto: ProviderProfessionDto) {
    return this.providerProfessionService.getProviderPerProfessionPerCity(dto);
  }
}
