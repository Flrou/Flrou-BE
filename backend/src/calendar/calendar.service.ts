import { Injectable } from '@nestjs/common';
import { CalendarRepository } from './calendar.repo';
import { Calendar } from './calendar.entity';

@Injectable()
export class CalendarService {
  constructor(
    private readonly calendarRepository: CalendarRepository,
  ) {}

    async findAllByYear(user_id: string, s_year: number): Promise<Calendar[]> {
      return this.calendarRepository.findAllByYear(user_id, s_year);
    }

    async findAllByMonth(user_id: string, s_year: number, s_month: number): Promise<Calendar[]> {
      return this.calendarRepository.findAllByMonth(user_id, s_year, s_month);
    }

    async create(
      user_id: string, plan: string,
      s_year: number, s_month: number, s_day: number, s_hour: number, s_minute: number,
      f_year: number, f_month: number, f_day: number, f_hour: number, f_minute: number,
      alarm: number, color: number
    ): Promise<string|null> {
      return this.calendarRepository.create(
        user_id, plan, s_year, s_month, s_day, s_hour, s_minute,
        f_year, f_month, f_day, f_hour, f_minute, alarm, color
      );
    }

    async update(
      plan_id: number, plan: string,
      s_year: number, s_month: number, s_day: number, s_hour: number, s_minute: number,
      f_year: number, f_month: number, f_day: number, f_hour: number, f_minute: number,
      alarm: number, color: number
    ): Promise<string|null> {
      return this.calendarRepository.update(
        plan_id, plan, s_year, s_month, s_day, s_hour, s_minute,
        f_year, f_month, f_day, f_hour, f_minute, alarm, color
      );
    }

    async updateDone(plan_id: number): Promise<string|null> {
      return this.calendarRepository.updateDone(plan_id);
    }

    async destroy(plan_id: number): Promise<string|null> {
      return this.calendarRepository.destroy(plan_id);
    }

    // --- graph

    async findGraph(user_id: string, s_year: number, cur_month: number): Promise<string|null> {
      return this.calendarRepository.findGraph(user_id, s_year, cur_month)
    }

    // --- force

    async setForceAlarm(user_id: string, cur_year: number, cur_month: number, alarm: number): Promise<any> {
      return this.calendarRepository.setForceAlarm(user_id, cur_year, cur_month, alarm);
    }
}