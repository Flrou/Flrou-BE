import { AutoIncrement, BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
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
    @Column({type: DataType.INTEGER, allowNull: false})
    e_year: number;
    @Column({type: DataType.INTEGER, allowNull: false})
    e_month: number;
    @Column({type: DataType.INTEGER, allowNull: false})
    e_day: number;
    @Column({type: DataType.INTEGER})
    e_hour: number;
    @Column({type: DataType.INTEGER})
    e_minute: number;

    // 알람
    @Column({type: DataType.INTEGER, defaultValue: 15}) // 디폴트 15분
    alarm: number;

    // 완료 여부
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isDone: boolean;

    // 누구의 일정인지
    @BelongsTo(() => User, {foreignKey : 'user_id'})
    user: User;
}
