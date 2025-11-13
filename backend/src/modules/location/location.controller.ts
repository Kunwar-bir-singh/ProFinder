import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { AuthGuard } from '@nestjs/passport';
import { findOrCreateCityDto } from './dto/location.dto';

@Controller('location')
export class LocationController {

    constructor(
        private readonly locationService: LocationService
    ) {}

    @Get('drop-down')
    @UseGuards(AuthGuard('jwt'))
    async getAllCities() {
        return await this.locationService.getAllCitiesDropDown();
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async findOrCreateCity(@Body() dto: findOrCreateCityDto, @Req() req) {
        const { user_id } = req.user!;
        dto.user_id = user_id;
        return await this.locationService.findOrCreateCity(dto);
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    async deleteCity(@Query('city_id') city_id: number) {
        return await this.locationService.deleteCity(city_id);
    }

}
