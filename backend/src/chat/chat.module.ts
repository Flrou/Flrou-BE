import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ChatRepository } from "./chat.repo";
import { ChatService } from "./chat.service";
import { Chat } from "./chat.entity";
import { ChatController } from "./chat.con";
import { GptService } from "src/gpt/gpt.service";
import { Todo } from "src/todo/todo.entity";
import { TodoService } from "src/todo/todo.service";
import { TodoRepository } from "src/todo/todo.repo";

@Module({
    imports : [SequelizeModule.forFeature([Chat, Todo])],
    providers : [ChatRepository, ChatService, GptService, TodoService, TodoRepository],
    controllers : [ChatController],
    exports : [SequelizeModule]
})

export class ChatModule {}