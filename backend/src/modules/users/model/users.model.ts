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
import { ProvidersModel } from 'src/modules/providers/model/providers.model';
import { CitiesModel } from 'src/modules/location/model/cities.model';

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
  lastPasswordChange?: Date;
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
export class UsersModel extends Model<
  UsersAttributes,
  UsersCreationAttributes
> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  userID!: number;

  @ForeignKey(() => CitiesModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  cityID?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fullname!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  phone?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  auth_provider?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastPasswordChange?: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isVerified?: boolean;

  @HasOne(() => ProvidersModel)
  provider: ProvidersModel;

  @BelongsTo(() => CitiesModel, { as: 'city' })
  city: CitiesModel;

  @HasMany(() => UsersBookmarkModel)
  bookmarkedProviders: UsersBookmarkModel[];
}
