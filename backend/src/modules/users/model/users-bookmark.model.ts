import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { UsersModel } from './users.model';

interface UserBookmarkAttributes {
    userID: number;
    providerID: number;
}

@Table({
    tableName: 'users_bookmark',
    schema: 'main',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
})
export class UsersBookmarkModel extends Model<UserBookmarkAttributes> {
    @ForeignKey(() => UsersModel)
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        primaryKey: true,
    })
    userID?: number;

    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        primaryKey: true,
    })
    providerID?: number;

    @BelongsTo(() => UsersModel)
    user: UsersModel;

}
