import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Calendar } from './calendar.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class CalendarRepository {
  constructor(
    @InjectModel(Calendar)
    private calendarModel: typeof Calendar,
  ) {}

  // 전체 일정 반환
  async findAll(user_id: string): Promise<Calendar[]> {
    const user = await User.findOne({ where: { user_id } });
    return this.calendarModel.findAll({where : {user_id : user.id}});
  }

  // 월별 일정 반환
  async findAllByMonth(user_id: string, s_year: number, s_month: number): Promise<Calendar[]> {
    const user = await User.findOne({ where: { user_id } });
    return this.calendarModel.findAll({
      where: {
        user_id : user.id,
        s_year: s_year,
        s_month: s_month
      }
    });
  }
}