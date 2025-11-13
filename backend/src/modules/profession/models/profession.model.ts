import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
export interface ProfessionAttributes {
  profession_id?: number;
  profession_name: string;
  raw_name: string;
}
@Table({
  tableName: 'professions',
  schema: 'main', // Specify the schema name here
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProfessionsModel extends Model<ProfessionAttributes> {
  // Use a class name Projsubmodule
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  })
  profession_id?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  profession_name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  raw_name?: string;
}
