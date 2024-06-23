import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Controller('plan')
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly firebaseService: FirebaseService
  ) {}

  // 연별 일정 조회
  @Get('getPlanByYear/:user_id/:s_year')
  getPlanByYear(@Param('user_id') user_id: string, @Param('s_year') s_year: number) {
    return this.calendarService.findAllByYear(user_id, s_year);
  }

  // 월별 일정 조회
  @Get('getPlanByMonth/:user_id/:s_year/:s_month')
  getPlanByMonth(@Param('user_id') user_id: string, @Param('s_year') s_year: number, @Param('s_month') s_month: number) {
    return this.calendarService.findAllByMonth(user_id, s_year, s_month);
  }

  // 일정 추가
  @Post('createPlan')
  createPlan(
    @Body('user_id') user_id: string, @Body('plan') plan: string,
    @Body('s_year') s_year: number, @Body('s_month') s_month: number, @Body('s_day') s_day: number, @Body('s_hour') s_hour: number, @Body('s_minute') s_minute: number,
    @Body('f_year') f_year: number, @Body('f_month') f_month: number, @Body('f_day') f_day: number, @Body('f_hour') f_hour: number, @Body('f_minute') f_minute: number,
    @Body('alarm') alarm: number, @Body('color') color: number
  ) {
    return this.calendarService.create(
      user_id, plan, s_year, s_month, s_day, s_hour, s_minute,
      f_year, f_month, f_day, f_hour, f_minute, alarm, color
    );
  }

  // 일정 수정
  @Post('updatePlan')
  updatePlan(
    @Body('plan_id') plan_id: number,
    @Body('plan') plan: string,
    @Body('s_year') s_year: number, @Body('s_month') s_month: number, @Body('s_day') s_day: number, @Body('s_hour') s_hour: number, @Body('s_minute') s_minute: number,
    @Body('f_year') f_year: number, @Body('f_month') f_month: number, @Body('f_day') f_day: number, @Body('f_hour') f_hour: number, @Body('f_minute') f_minute: number,
    @Body('alarm') alarm: number, @Body('color') color: number
  ) {
    return this.calendarService.update(
      plan_id, plan, s_year, s_month, s_day, s_hour, s_minute,
      f_year, f_month, f_day, f_hour, f_minute, alarm, color
    );
  }

  // 완료 여부
  @Post('updatePlanDone')
  updatePlanDone(@Body('plan_id') plan_id: number) {
    return this.calendarService.updateDone(plan_id);
  }

  // 일정 삭제
  @Post('deletePlan')
  deletePlan(@Body('plan_id') plan_id: number) {
    return this.calendarService.destroy(plan_id);
  }


  // 그래프 관련
  @Get('getGraph/:user_id/:s_year/:cur_month')
  getGraph(@Param('user_id') user_id: string, @Param('s_year') s_year: number, @Param('cur_month') cur_month: number) {
    return this.calendarService.findGraph(user_id, s_year, cur_month);
  }
}