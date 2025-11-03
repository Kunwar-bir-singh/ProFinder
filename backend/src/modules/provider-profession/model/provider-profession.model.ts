import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

interface ProviderProfessionAttributes {
  providerID: number;
  cityID: number;
  professionID: number;
}

@Table({
  tableName: 'provider_profession',
  schema: 'main', // Specify the schema name here
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
})
export class ProviderProfessionModel extends Model<ProviderProfessionAttributes> {
  // Use a class name Projsubmodule
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  providerID?: number;

  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  cityID?: number;

  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  professionID?: number;
}
