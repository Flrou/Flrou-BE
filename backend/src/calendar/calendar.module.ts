import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Calendar } from "./calendar.entity";
import { CalendarRepository } from "./calendar.repo";
import { CalendarService } from "./calendar.service";
import { CalendarController } from "./calendar.con";
import { FirebaseService } from "src/firebase/firebase.service";
import { UserRepository } from "src/user/user.repo";

@Module({
    imports : [SequelizeModule.forFeature([Calendar])],
    providers : [CalendarRepository, CalendarService, FirebaseService],
    controllers : [CalendarController],
    exports : [SequelizeModule]
})

export class CalendarModule {}