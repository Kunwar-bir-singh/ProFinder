import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { UsersModel } from 'src/modules/users/models/users.model';

export interface CityCreationAttributes extends Partial<CityAttributes> {
  city_name: string;
  raw_name: string;
}

export interface CityAttributes {
  city_id?: number;
  city_name?: string;
  raw_name?: string;
}

@Table({
  tableName: 'cities',
  schema: 'main', // Specify the schema name here
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CitiesModel extends Model<CityAttributes, CityCreationAttributes> {
  // Use a class name Projsubmodule
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  })
  city_id?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city_name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  raw_name?: string;

  @HasMany(() => UsersModel, { as: 'users' })
  users: UsersModel[];
}
