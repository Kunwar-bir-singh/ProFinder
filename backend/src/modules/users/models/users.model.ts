import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
    tableName: 'users',
    schema: 'main', // Specify the schema name here
    timestamps: false,
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
    userName?: string;

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
    imageUrl?: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isVerified?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isProvider?: boolean;
    
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isAvailable?: boolean;

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: true,
    })
    bookmarkedProviders!: number[];
    
    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: true,
    })
    profession!: number[];



}
