import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
    tableName: 'professions',
    schema: 'main', // Specify the schema name here
    timestamps: false,
})
export class ProfessionsModel extends Model<ProfessionsModel> { // Use a class name Projsubmodule
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
    })
    professionID?: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    professionName?: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    professionCity?: string;

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: true,
    })
    providersLinked!: number[];

}
