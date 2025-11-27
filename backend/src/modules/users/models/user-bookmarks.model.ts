import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { UsersModel } from './users.model';

interface UserBookmarkAttributes {
    user_id: number;
    provider_id: number;
}

@Table({
    tableName: 'user_bookmarks',
    schema: 'main',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export class UserBookmarksModel extends Model<UserBookmarkAttributes> {
    @ForeignKey(() => UsersModel)
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        primaryKey: true,
    })
    user_id?: number;

    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        primaryKey: true,
    })
    provider_id?: number;

    @BelongsTo(() => UsersModel)
    user: UsersModel;

}
