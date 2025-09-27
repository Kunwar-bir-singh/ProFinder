import { BelongsTo, Column, DataType, ForeignKey, Index, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UsersModel } from "src/modules/global/models/users.model";

interface RefreshTokenAttributes {
    userID: number;
    token: string;
    expiresAt: Date;
}

@Table({
    tableName: 'refreshTokens',
    timestamps: true
})
export class RefreshTokenModel extends Model<RefreshTokenAttributes> {
    @PrimaryKey
    @ForeignKey(() => UsersModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userID!: number;

    @Index
    @Column({
        type: DataType.TEXT,
        allowNull: false,
        unique: true,
    })
    token!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    expiresAt!: Date;

    @BelongsTo(() => UsersModel)
    user!: UsersModel;
}