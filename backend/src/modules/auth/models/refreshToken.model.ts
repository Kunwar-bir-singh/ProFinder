import { BelongsTo, Column, DataType, ForeignKey, Index, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UsersModel } from "src/modules/users/models/users.model";

interface RefreshTokenAttributes {
    user_id: number;
    token: string;
    expiresAt: Date;
}

@Table({
    tableName: 'refreshTokens',
    schema: 'main',
    timestamps: true
})
export class RefreshTokenModel extends Model<RefreshTokenAttributes> {
    @PrimaryKey
    @ForeignKey(() => UsersModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id!: number;

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