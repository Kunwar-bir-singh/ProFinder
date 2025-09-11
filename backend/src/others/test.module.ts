import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "test",
    schema: "main",
    timestamps: true
})

export class TestModule extends Model<TestModule> {
    @Column({
        type: DataType.STRING
    })
    name: string
}