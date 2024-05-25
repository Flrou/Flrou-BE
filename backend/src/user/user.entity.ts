import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table, AfterSync } from "sequelize-typescript";
import { Chat } from "src/chat/chat.entity";

@Table({timestamps : true})
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({type: DataType.STRING(50), allowNull: false, unique: true})
    user_id: string;

    @Column({type: DataType.STRING(190)}) // 카카오 로그인 시 없어도 됨
    user_pw: string;

    @Column({type: DataType.STRING(20)}) // 카카오 로그인 시 없어도 됨
    nickname: string;

    // 유저가 가지고 있는 TBA
    @HasMany(() => Chat, { foreignKey: 'user_id', as: 'userChat' })
    chat: Chat[];

    // nest 시작과 동시에 디폴트 데이터 넣어주기
    @AfterSync
    static async insertInitialData() {
        const count = await User.count();
        if (count === 0) {
            await User.create({ user_id: '111', user_pw: '111', nickname: '111' });
        }
    }
}
