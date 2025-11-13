import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { UsersModel } from 'src/modules/users/models/users.model';

interface OTPAttributes {
  email: string;
  otp_type: string;
  otp: string;
  expires_at: Date;
  attempts?: number;
  created_at?: Date;
}

@Table({
  tableName: 'otp',
  schema: 'main',
  timestamps: false, // created_at is manually defined
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

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at?: Date;
}
