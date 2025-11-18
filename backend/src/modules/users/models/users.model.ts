import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  HasOne,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UsersBookmarkModel } from './users-bookmark.model';
import { ProvidersModel } from 'src/modules/providers/models/providers.model';
import { CitiesModel } from 'src/modules/location/models/cities.model';

export interface UsersAttributes {
  user_id?: number;
  username: string;
  password: string;
  fullname: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  profile_image_url?: string;
  last_password_change?: Date;
  is_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

@Table({
  tableName: 'users',
  schema: 'main',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class UsersModel extends Model<UsersAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  user_id: number;

  @ForeignKey(() => CitiesModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  city_id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  fullname!: string;

  @Column({
    type: DataType.STRING(11),
    allowNull: true,
    unique: true,
  })
  phone?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  auth_provider?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  last_password_change?: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_verified?: boolean;

  @HasOne(() => ProvidersModel)
  provider: ProvidersModel;

  @BelongsTo(() => CitiesModel, { as: 'city' })
  city: CitiesModel;

  @HasMany(() => UsersBookmarkModel)
  bookmarkedProviders: UsersBookmarkModel[];
}
