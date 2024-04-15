import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ChatRepository } from "./chat.repo";
import { ChatService } from "./chat.service";
import { Chat } from "./chat.entity";
import { ChatController } from "./chat.con";
import { GptService } from "src/gpt/gpt.service";

@Module({
    imports : [SequelizeModule.forFeature([Chat])],
    providers : [ChatRepository, ChatService, GptService],
    controllers : [ChatController],
    exports : [SequelizeModule]
})

export class ChatModule {}