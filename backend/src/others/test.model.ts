import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "test",
    schema: "main",
    // timestamps: true
    createdAt: false,
    updatedAt: false
})

export class TestModel extends Model<TestModel> {
    @PrimaryKey
    @Column({
        type: DataType.STRING
    })
    username: string

    @Column({
        type: DataType.STRING
    })
    password: string
}