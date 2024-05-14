import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // 모든 일정 조회
  @Get('getAllPlan/:user_id')
  getAllPlan(@Param('user_id') user_id: string) {
    return this.calendarService.findAllPlan(user_id);
  }

  // 월별 일정 조회
  @Get('getAllPlanByMonth/:user_id/:s_year/:s_month')
  getAllPlanByMonth(@Param('user_id') user_id: string, @Param('s_year') s_year: number, @Param('s_month') s_month: number) {
    return this.calendarService.findAllPlanByMonth(user_id, s_year, s_month);
  }

  // 일정 추가
  @Post('createPlan')
  createPlan(
    @Param('user_id') user_id: string, @Param('s_year') s_year: number, // 캘린더 테이블에 들어갈 데이터 전부
  ) {
    return this.calendarService.addPlan();
  }
}