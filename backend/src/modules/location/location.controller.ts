import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { AuthGuard } from '@nestjs/passport';
import { findOrCreateCityDto } from './dto/location.dto';

@Controller('location')
export class LocationController {

    constructor(
        private readonly locationService: LocationService
    ) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllCities() {
        return await this.locationService.getAllCities();
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async findOrCreateCity(@Body() dto: findOrCreateCityDto, @Req() req) {
        const { userID } = req.user!;
        dto.userID = userID;
        return await this.locationService.findOrCreateCity(dto);
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    async deleteCity(@Query('cityID') cityID: number) {
        return await this.locationService.deleteCity(cityID);
    }

}
