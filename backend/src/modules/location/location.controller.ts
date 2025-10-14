import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCityDto } from './dto/location.dto';

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
    async createCity(@Body() dto: CreateCityDto, @Req() req) {
        const { userID } = req.user!;
        dto.userID = userID;
        return await this.locationService.createCity(dto);
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    async deleteCity(@Query('cityID') cityID: number) {
        return await this.locationService.deleteCity(cityID);
    }

}
