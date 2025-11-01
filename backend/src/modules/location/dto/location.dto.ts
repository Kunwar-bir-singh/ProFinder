import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Column } from "sequelize-typescript"

export class findOrCreateCityDto {
    @Column
    @IsString()
    @IsNotEmpty()
    city: string

    @Column
    @IsInt()
    @IsOptional()
    userID : number 
}