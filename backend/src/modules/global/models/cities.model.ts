import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

export interface CityCreationAttributes extends Partial<CityAttributes> {
    cityName: string;
    rawName: string;
}

interface CityAttributes {
    cityID?: number;
    cityName?: string;
    rawName?: string
}

@Table({
    tableName: 'cities',
    schema: 'main', // Specify the schema name here
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
})
export class CitiesModel extends Model<CityAttributes, CityCreationAttributes> { // Use a class name Projsubmodule
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
    })
    cityID?: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    cityName?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    rawName?: string


}
