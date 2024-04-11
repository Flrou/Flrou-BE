import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({timestamps : true})
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({type: DataType.STRING(50), allowNull: false, unique: true})
    user_id: string;

    @Column({type: DataType.STRING(190), allowNull: false})
    user_pw: string;

    @Column({type: DataType.STRING(20), allowNull: false})
    nickname: string;

    // 유저가 가지고 있는 TBA
    // @HasMany(() => TBA, { foreignKey: 'user_id', as: 'userTBA' })
    // tba: TBA[];
}
