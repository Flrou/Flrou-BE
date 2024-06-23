import { AutoIncrement, BelongsTo, Column, DataType, HasMany, Model, PrimaryKey, Table, ForeignKey } from "sequelize-typescript";
import { User } from "src/user/user.entity";

@Table({timestamps : true})
export class Chat extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({type: DataType.STRING(300), allowNull: false})
    content: string;

    @Column({type: DataType.INTEGER})
    isUser: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User, { foreignKey: 'userId' })
    user: User;
}
