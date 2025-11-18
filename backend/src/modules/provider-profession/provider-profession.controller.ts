import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProviderProfessionService } from './provider-profession.service';
import { AuthGuard } from '@nestjs/passport';
import {
  GetProviderProfessionDto,
  IDProviderProfessionDto,
} from './dto/provider.profession.dto';

@Controller('profession-providers')
export class ProvidersProfessionController {
  constructor(
    private readonly providerProfessionService: ProviderProfessionService,
  ) {}

  @Post('link')
  @UseGuards(AuthGuard('jwt'))
  async linkProviderProfession(
    @Body() dto: IDProviderProfessionDto,
    @Req() req,
  ) {
    const { provider_id } = req.user!;
    console.log('Req', req.user);

    dto.provider_id = provider_id;
    return this.providerProfessionService.linkProviderProfession(dto);
  }

  @Post('un-link')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async unLinkProviderProfession(@Req() req, @Body() dto: IDProviderProfessionDto) {
    const { provider_id } = req.user!;
    dto.provider_id = provider_id;
    return this.providerProfessionService.unLinkProviderProfession(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProviderPerProfessionPerCity(
    @Query() dto: GetProviderProfessionDto,
  ) {
    return this.providerProfessionService.getProviderPerProfessionPerCity(dto);
  }
}
