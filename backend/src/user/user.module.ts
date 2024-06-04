import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserService } from "./user.service";
import { UserController } from "./user.con";
import { User } from "./user.entity";
import { UserRepository } from "./user.repo";
import { Calendar } from "src/calendar/calendar.entity";
import { CalendarService } from "src/calendar/calendar.service";
import { CalendarRepository } from "src/calendar/calendar.repo";

@Module({
    imports : [SequelizeModule.forFeature([User, Calendar])],
    providers : [UserRepository, UserService, CalendarService, CalendarRepository],
    controllers : [UserController],
    exports : [SequelizeModule]
})

export class UserModule {}