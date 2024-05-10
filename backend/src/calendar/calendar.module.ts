import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Calendar } from "./calendar.entity";
import { CalendarRepository } from "./calendar.repo";
import { CalendarService } from "./calendar.service";
import { CalendarController } from "./calendar.con";

@Module({
    imports : [SequelizeModule.forFeature([Calendar])],
    providers : [CalendarRepository, CalendarService],
    controllers : [CalendarController],
    exports : [SequelizeModule]
})

export class CalendarModule {}