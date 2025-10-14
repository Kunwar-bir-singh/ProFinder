import { Table, Column, Model, DataType, PrimaryKey} from 'sequelize-typescript';

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

}
