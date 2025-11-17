import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  AutoIncrement,

  Default,
} from 'sequelize-typescript';

interface OTPAttributes {
  email: string;
  otp_type: string;
  otp: string;
  expires_at: Date;
  attempts?: number;
  created_at?: Date;
  updated_at?: Date;
}
@Table({
  tableName: 'otp',
  schema: 'main',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class OTPModel extends Model<OTPAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  unique_id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: 'otp_type',
  })
  otp_type!: string;

  @Column({
    type: DataType.STRING(6),
    allowNull: false,
  })
  otp!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'expires_at',
  })
  expires_at!: Date;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  current_attempts?: number;
}
