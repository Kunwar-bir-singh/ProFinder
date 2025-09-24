import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
    tableName: 'users',
    schema: 'main', // Specify the schema name here
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
})
export class UsersModel extends Model<UsersModel> { // Use a class name Projsubmodule
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
    })
    userID?: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    username?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    fullname?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    phone?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    address?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    city?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    profileImageUrl?: string;

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: true,
    })
    bookmarkedProviders!: number[];

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isVerified?: boolean;
}
