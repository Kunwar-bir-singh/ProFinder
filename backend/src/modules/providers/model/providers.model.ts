import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { UsersModel } from 'src/modules/users/model/users.model';

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

    @ForeignKey(() => UsersModel)
    @Column({
        type: DataType.INTEGER,
    })
    userID!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description?: string;

    @Column({
        type: DataType.JSON,
    })
    rating: object

    @Column({
        type: DataType.BOOLEAN,
    })
    isAvailable: boolean

    @BelongsTo(() => UsersModel)
    user: UsersModel;
}
