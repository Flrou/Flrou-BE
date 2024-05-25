import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Todo } from "./todo.entity";
import { TodoRepository } from "./todo.repo";
import { TodoService } from "./todo.service";
import { TodoController } from "./todo.con";

@Module({
    imports : [SequelizeModule.forFeature([Todo])],
    providers : [TodoRepository, TodoService],
    controllers : [TodoController],
    exports : [SequelizeModule]
})

export class TodoModule {}