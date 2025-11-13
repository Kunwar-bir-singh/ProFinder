import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

interface ProviderProfessionAttributes {
  provider_id: number;
  city_id: number;
  profession_id: number;
}

@Table({
  tableName: 'provider_profession',
  schema: 'main', // Specify the schema name here
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProviderProfessionModel extends Model<ProviderProfessionAttributes> {
  // Use a class name Projsubmodule
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  provider_id?: number;

  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  city_id?: number;

  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  profession_id?: number;
}
