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
    @Column({type: DataType.INTEGER, defaultValue: 0})
    alarm: number;

    // 색
    @Column({type: DataType.INTEGER, defaultValue: 1})
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
                plan: '알바 대타',
                s_year: 2024, s_month: 6, s_day: 4, s_hour: 11, s_minute: 0,
                f_year: 2024, f_month: 6, f_day: 4, f_hour: 13, f_minute: 0,
                isDone: true, userId: 1
            });
            await Calendar.create({
                plan: '친구 저녁식사',
                s_year: 2024, s_month: 6, s_day: 8, s_hour: 19, s_minute: 0,
                f_year: 2024, f_month: 6, f_day: 8, f_hour: 21, f_minute: 0,
                isDone: true, userId: 1
            });
            await Calendar.create({
                plan: '자격증 공부',
                s_year: 2024, s_month: 6, s_day: 16, s_hour: 17, s_minute: 0,
                f_year: 2024, f_month: 6, f_day: 16, f_hour: 120, f_minute: 0,
                userId: 1
            });
            await Calendar.create({
                plan: '프로젝트 회의',
                s_year: 2024, s_month: 6, s_day: 12, s_hour: 22, s_minute: 0,
                f_year: 2024, f_month: 6, f_day: 12, f_hour: 23, f_minute: 0,
                isDone: true, userId: 1
            });
            await Calendar.create({
                plan: '기말 과제 제출',
                s_year: 2024, s_month: 6, s_day: 20, s_hour: 22, s_minute: 0,
                f_year: 2024, f_month: 6, f_day: 20, f_hour: 23, f_minute: 0,
                isDone: true, userId: 1
            });
            await Calendar.create({
                plan: '코딩 테스트 공부',
                s_year: 2024, s_month: 6, s_day: 26, s_hour: 17, s_minute: 0,
                f_year: 2024, f_month: 6, f_day: 26, f_hour: 120, f_minute: 0,
                userId: 1
            });
            await Calendar.create({
                plan: '종강 파티',
                s_year: 2024, s_month: 6, s_day: 30, s_hour: 17, s_minute: 0,
                f_year: 2024, f_month: 6, f_day: 30, f_hour: 18, f_minute: 0,
                userId: 1
            });

            await Calendar.create({
                plan: '친구 아들 결혼식',
                s_year: 2024, s_month: 5, s_day: 11, s_hour: 11, s_minute: 0,
                f_year: 2024, f_month: 5, f_day: 11, f_hour: 13, f_minute: 0,
                userId: 2
            });
            await Calendar.create({
                plan: '딸 알림장 준비물',
                s_year: 2024, s_month: 5, s_day: 14, s_hour: 8, s_minute: 0,
                f_year: 2024, f_month: 5, f_day: 14, f_hour: 8, f_minute: 0,
                userId: 2
            });
            await Calendar.create({
                plan: '가족 모임',
                s_year: 2024, s_month: 5, s_day: 18, s_hour: 12, s_minute: 0,
                f_year: 2024, f_month: 5, f_day: 18, f_hour: 15, f_minute: 0,
                isDone: true, userId: 2
            });
            await Calendar.create({
                plan: '동창회 모임',
                s_year: 2024, s_month: 5, s_day: 26, s_hour: 0, s_minute: 0,
                f_year: 2024, f_month: 5, f_day: 26, f_hour: 0, f_minute: 0,
                userId: 2
            });
            await Calendar.create({
                plan: '할인마트 빅세일',
                s_year: 2024, s_month: 6, s_day: 13, s_hour: 15, s_minute: 0,
                f_year: 2024, f_month: 6, f_day: 13, f_hour: 19, f_minute: 0,
                userId: 2
            });
            await Calendar.create({
                plan: '에어컨 수리 기사',
                s_year: 2024, s_month: 6, s_day: 24, s_hour: 12, s_minute: 0,
                f_year: 2024, f_month: 6, f_day: 24, f_hour: 13, f_minute: 0,
                userId: 2
            });
            await Calendar.create({
                plan: '딸 학부모 공개 수업',
                s_year: 2024, s_month: 6, s_day: 26, s_hour: 13, s_minute: 0,
                f_year: 2024, f_month: 6, f_day: 26, f_hour: 15, f_minute: 0,
                userId: 2
            });
        }
    }
}
