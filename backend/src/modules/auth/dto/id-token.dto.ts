import { Column, DataType } from 'sequelize-typescript';

export class IDTokenDto {
  @Column({
    type: DataType.INTEGER,
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
  })
  refreshToken: string;
}
