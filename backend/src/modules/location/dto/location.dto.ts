import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Column } from "sequelize-typescript"

export class findOrCreateCityDto {
    @Column
    @IsInt()
    @IsOptional()
    cityID: string

    @Column
    @IsString()
    @IsNotEmpty()
    city: string

    @Column
    @IsInt()
    @IsOptional()
    userID : number 
}