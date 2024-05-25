import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.con';
import { UserRepository } from './user/user.repo';
import { UserService } from './user/user.service';
import { Chat } from './chat/chat.entity';
import { ChatModule } from './chat/chat.module';
import { ChatController } from './chat/chat.con';
import { ChatRepository } from './chat/chat.repo';
import { ChatService } from './chat/chat.service';
import { GptService } from './gpt/gpt.service';
import { Calendar } from './calendar/calendar.entity';
import { CalendarModule } from './calendar/calendar.module';
import { CalendarController } from './calendar/calendar.con';
import { CalendarRepository } from './calendar/calendar.repo';
import { CalendarService } from './calendar/calendar.service';
import { Todo } from './todo/todo.entity';
import { TodoModule } from './todo/todo.module';
import { TodoController } from './todo/todo.con';
import { TodoRepository } from './todo/todo.repo';
import { TodoService } from './todo/todo.service';

@Module({
  imports: [
    MulterModule.register({
      dest: "./uploads",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect : 'mysql',
      host : process.env.DB_HOST ,
      port : 3306,
      username : process.env.DB_USERNAME,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_NAME,
      models : [User, Chat, Calendar, Todo],
      synchronize : true, // 처음 table 생성한 뒤에는 false로 변경
      autoLoadModels: true,
    }),
    User, UserModule, Chat, ChatModule, Calendar, CalendarModule, Todo, TodoModule
  ],
  controllers: [UserController, ChatController, CalendarController, TodoController],
  providers: [
    UserRepository, UserService,
    ChatRepository, ChatService, GptService,
    CalendarRepository, CalendarService,
    TodoRepository, TodoService,
  ],
})
export class AppModule {}
