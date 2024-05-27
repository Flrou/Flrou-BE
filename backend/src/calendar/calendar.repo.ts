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
  // async findAll(user_id: string): Promise<Calendar[]> {
  //   const user = await User.findOne({ where: { user_id } });
  //   return this.calendarModel.findAll({where : {user_id : user.id}});
  // }

  // 연별 일정 반환
  async findAllByYear(user_id: string, s_year: number): Promise<Calendar[]> {
    const user = await User.findOne({ where: { user_id } });
    return this.calendarModel.findAll({
      where: {
        userId : user.id,
        s_year: s_year,
      }
    });
  }

  // 월별 일정 반환
  async findAllByMonth(user_id: string, s_year: number, s_month: number): Promise<Calendar[]> {
    const user = await User.findOne({ where: { user_id } });
    return this.calendarModel.findAll({
      where: {
        userId : user.id,
        s_year: s_year,
        s_month: s_month
      }
    });
  }

  // 일정 추가
  async create(
    user_id: string, plan: string,
    s_year: number, s_month: number, s_day: number, s_hour: number, s_minute: number,
    f_year: number, f_month: number, f_day: number, f_hour: number, f_minute: number,
    alarm: number, color: number
  ): Promise<string|null> {
    const user = await User.findOne({ where: { user_id } });
    this.calendarModel.create({
      plan, s_year, s_month, s_day, s_hour, s_minute,
      f_year, f_month, f_day, f_hour, f_minute, alarm, color,
      userId: user.id
    })
    return 'success'
  }
  
  // 일정 수정
  async update(
    plan_id: number, plan: string,
    s_year: number, s_month: number, s_day: number, s_hour: number, s_minute: number,
    f_year: number, f_month: number, f_day: number, f_hour: number, f_minute: number,
    alarm: number, color: number
  ): Promise<string|null> {
    const calendar = await Calendar.findOne({ where: { id: plan_id }});
    if (!calendar) return 'failed';
    await this.calendarModel.update({
      plan, s_year, s_month, s_day, s_hour, s_minute,
      f_year, f_month, f_day, f_hour, f_minute, alarm, color,
    }, { where: { id: plan_id } });
    return 'success';
  }

  // 완료 여부 수정
  async updateDone(plan_id: number): Promise<string|null> {
    const calendar = await Calendar.findOne({ where: { id: plan_id }});
    if (!calendar) return 'failed';
    await this.calendarModel.update({ isDone: !calendar.isDone }, { where: { id: plan_id } })
  }

  // 삭제
  async destroy(plan_id: number): Promise<string|null> {
    const result = await Calendar.destroy({ where: { id: plan_id }});
    if (result === 0) return 'failed';
    return 'success';
  }}