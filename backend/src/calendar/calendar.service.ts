import { Injectable } from '@nestjs/common';
import { CalendarRepository } from './calendar.repo';
import { Calendar } from './calendar.entity';

@Injectable()
export class CalendarService {
  constructor(
    private readonly calendarRepository: CalendarRepository,
  ) {}

    async findAllPlan(user_id: string): Promise<Calendar[]> {
      return this.calendarRepository.findAll(user_id);
    }

    async findAllPlanByMonth(user_id: string, s_year: number, s_month: number): Promise<Calendar[]> {
      return this.calendarRepository.findAllByMonth(user_id, s_year, s_month);
    }

    async addPlan(): Promise<string|null> {
      return this.calendarRepository.createPlan();
    }
}