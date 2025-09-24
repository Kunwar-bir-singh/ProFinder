import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
    tableName: 'providers',
    schema: 'main', // Specify the schema name here
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
})
export class ProvidersModel extends Model<ProvidersModel> { // Use a class name Projsubmodule
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
    })
    providerID?: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description?: string;

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
    })
    professionsLinked: number[]

    @Column({
        type: DataType.JSON,
    })
    rating: object

    @Column({
        type: DataType.BOOLEAN,
    })
    isAvailable: boolean

}
