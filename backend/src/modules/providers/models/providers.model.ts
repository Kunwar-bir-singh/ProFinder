import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { UsersModel } from 'src/modules/users/models/users.model';

@Table({
  tableName: 'providers',
  schema: 'main',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProvidersModel extends Model<ProvidersModel> {
  // Use a class name Projsubmodule
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  })
  provider_id: number;

  @ForeignKey(() => UsersModel)
  @Column({
    type: DataType.INTEGER,
  })
  user_id: number;

  @Column({
    type: DataType.INTEGER,
  })
  year_of_experience: number;

  @Column({
    type: DataType.TEXT,
  })
  bio: string;

  @Column({
    type: DataType.TEXT,
  })
  service_area: string;

  @Column({
    type: DataType.JSONB,
  })
  rating: object;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_available: boolean;

  @BelongsTo(() => UsersModel)
  user: UsersModel;
}
