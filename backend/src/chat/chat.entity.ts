import { AutoIncrement, BelongsTo, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
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

    @BelongsTo(() => User, {foreignKey : 'user_id'})
    user: User;
}
