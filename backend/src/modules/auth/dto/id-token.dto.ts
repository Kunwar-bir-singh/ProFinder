import { Column, DataType } from "sequelize-typescript"

export class IDTokenDto {
    @Column({
        type : DataType.INTEGER
    })
    userID : number

    @Column({
        type : DataType.STRING
    })
    refreshToken : string
}