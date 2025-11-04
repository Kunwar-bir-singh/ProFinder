import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProviderProfessionDto } from './dto/provider.profession.dto';
import { ProviderProfessionService } from './provider-profession.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('profession-providers')
export class ProvidersProfessionController {
  constructor(
    private readonly providerProfessionService: ProviderProfessionService,
  ) {}

  @Post('link')
  @UseGuards(AuthGuard('jwt'))
  async linkProviderProfession(@Body() dto: ProviderProfessionDto, @Req() req) {
    const { providerID } = req.user!;
    dto.providerID = providerID;
    return this.providerProfessionService.linkProviderProfession(dto);
  }

  @Post('unlink')
  @UseGuards(AuthGuard('jwt'))
  async unLinkProviderProfession(@Body() dto: ProviderProfessionDto) {
    return this.providerProfessionService.unLinkProviderProfession(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProviderPerProfessionPerCity(@Query() dto: ProviderProfessionDto) {
    return this.providerProfessionService.getProviderPerProfessionPerCity(dto);
  }
}
