import { AutoIncrement, BelongsTo, Column, DataType, Model, PrimaryKey, Table, AfterSync, ForeignKey } from "sequelize-typescript";
import { User } from "src/user/user.entity";

@Table({timestamps : true})
export class Todo extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    // 투두 내용
    @Column({type: DataType.STRING(30), allowNull: false})
    todo: string;

    // 완료 여부
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isDone: boolean;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User, { foreignKey: 'userId' })
    user: User;

    // @AfterSync
    // static async insertInitialData() {
    //     const count = await Todo.count();
    //     if (count === 0) {
    //         await Todo.create({ todo: '식당 예약', userId: 1 });
    //         await Todo.create({ todo: '다이소', userId: 1 });
    //     }
    // }
}
