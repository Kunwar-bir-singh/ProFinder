import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
export interface ProfessionAttributes {
  professionID?: number;
  professionName: string;
  rawName: string;
}
@Table({
  tableName: 'professions',
  schema: 'main', // Specify the schema name here
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
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
  professionID?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  professionName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  rawName?: string;
}
