import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

export interface UsersAttributes {
    userID?: number;
    username: string;
    password: string;
    fullname: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    profileImageUrl?: string;
    bookmarkedProviders?: number[];
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UsersCreationAttributes extends Partial<UsersAttributes> {
    username: string;
    password: string;
    fullname: string;
}

@Table({
    tableName: 'users',
    schema: 'main',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
})
export class UsersModel extends Model<UsersAttributes, UsersCreationAttributes> {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    })
    userID!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    fullname!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    email?: string;


    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: true,
        defaultValue: [],
    })
    bookmarkedProviders?: number[];

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    isVerified?: boolean;
}