import { AutoIncrement, BelongsTo, Column, DataType, Model, PrimaryKey, Table, ForeignKey, AfterSync } from "sequelize-typescript";
import { User } from "src/user/user.entity";

@Table({timestamps : true})
export class Calendar extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    // 일정 내용
    @Column({type: DataType.STRING(30), allowNull: false})
    plan: string;

    // 시작 연월일시분
    @Column({type: DataType.INTEGER, allowNull: false})
    s_year: number;
    @Column({type: DataType.INTEGER, allowNull: false})
    s_month: number;
    @Column({type: DataType.INTEGER, allowNull: false})
    s_day: number;
    @Column({type: DataType.INTEGER})
    s_hour: number;
    @Column({type: DataType.INTEGER})
    s_minute: number;

    // 끝 연월일시분
    @Column({type: DataType.INTEGER})
    f_year: number;
    @Column({type: DataType.INTEGER})
    f_month: number;
    @Column({type: DataType.INTEGER})
    f_day: number;
    @Column({type: DataType.INTEGER})
    f_hour: number;
    @Column({type: DataType.INTEGER})
    f_minute: number;

    // 알람
    @Column({type: DataType.INTEGER, defaultValue: 15}) // 디폴트 15분
    alarm: number;

    // 색
    @Column({type: DataType.INTEGER, defaultValue: 1}) // 디폴트 15분
    color: number;

    // 완료 여부
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isDone: boolean;

    // 누구의 일정인지
    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User, { foreignKey: 'userId' })
    user: User;

    @AfterSync
    static async insertInitialData() {
        const count = await Calendar.count();
        if (count === 0) {
            await Calendar.create({
                plan: '과제 제출',
                s_year: 2024, s_month: 5, s_day: 30, s_hour: 17, s_minute: 0,
                f_year: 2024, f_month: 5, f_day: 30, f_hour: 18, f_minute: 0,
                userId: 1 });
        }
    }
}
