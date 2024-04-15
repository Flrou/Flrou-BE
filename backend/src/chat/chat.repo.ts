import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './chat.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Chat)
    private chatModel: typeof Chat,
  ) {}

  // 전체 대화 반환
  async findAll(user_id: string): Promise<Chat[]> {
    const user = await User.findOne({ where: { user_id } });
    return this.chatModel.findAll({where : {user_id : user.id}});
  }

  // 채팅 추가
  async create(user_id: string, content: string, isUser: boolean): Promise<void> {
    // const user = await User.findOne({ where: { user_id } });
    // if (!user) {
    //   throw new Error(`${user_id} not found`);
    // }
    // await this.chatModel.create({ content, user_id: user.id, isUser });
    const userId = 1;
    await this.chatModel.create({ content, isUser, userId });
  }
}