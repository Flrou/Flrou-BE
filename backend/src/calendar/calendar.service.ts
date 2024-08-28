import { Injectable } from '@nestjs/common';
import { CalendarRepository } from './calendar.repo';
import { Calendar } from './calendar.entity';
import { User } from 'src/user/user.entity';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class CalendarService {
  constructor(
    private readonly calendarRepository: CalendarRepository,
    private readonly firebaseService: FirebaseService,
  ) {}

  async findAllByYear(user_id: string, s_year: number): Promise<Calendar[]> {
    return this.calendarRepository.findAllByYear(user_id, s_year);
  }

  async findAllByMonth(
    user_id: string,
    s_year: number,
    s_month: number,
  ): Promise<Calendar[]> {
    return this.calendarRepository.findAllByMonth(user_id, s_year, s_month);
  }

  async create(
    user_id: string,
    plan: string,
    s_year: number,
    s_month: number,
    s_day: number,
    s_hour: number,
    s_minute: number,
    f_year: number,
    f_month: number,
    f_day: number,
    f_hour: number,
    f_minute: number,
    alarm: number,
    color: number,
  ): Promise<string | null> {
    const user = await this.calendarRepository.create(
      user_id,
      plan,
      s_year,
      s_month,
      s_day,
      s_hour,
      s_minute,
      f_year,
      f_month,
      f_day,
      f_hour,
      f_minute,
      alarm,
      color,
    );

    if (alarm > 0 && user.device_token) {
      console.log(s_year, s_month, s_day, s_hour, s_minute);
      const sendAt = new Date(s_year, s_month - 1, s_day, s_hour, s_minute);
      sendAt.setMinutes(sendAt.getMinutes() - alarm);
      console.log('메시지 예약 시간 : ', sendAt);
      this.sendDirectTo(
        user_id,
        'From Flrou',
        `${user.nickname}님, ${plan}${alarm}분 전입니다.`,
        sendAt,
      );
    }

    return 'success';
  }

  async update(
    plan_id: number,
    plan: string,
    s_year: number,
    s_month: number,
    s_day: number,
    s_hour: number,
    s_minute: number,
    f_year: number,
    f_month: number,
    f_day: number,
    f_hour: number,
    f_minute: number,
    alarm: number,
    color: number,
  ): Promise<string | null> {
    return this.calendarRepository.update(
      plan_id,
      plan,
      s_year,
      s_month,
      s_day,
      s_hour,
      s_minute,
      f_year,
      f_month,
      f_day,
      f_hour,
      f_minute,
      alarm,
      color,
    );
  }

  async updateDone(plan_id: number): Promise<string | null> {
    return this.calendarRepository.updateDone(plan_id);
  }

  async destroy(plan_id: number): Promise<string | null> {
    return this.calendarRepository.destroy(plan_id);
  }

  // --- graph

  async findGraph(
    user_id: string,
    s_year: number,
    cur_month: number,
  ): Promise<string | null> {
    return this.calendarRepository.findGraph(user_id, s_year, cur_month);
  }

  // --- force

  async setForceAlarm(
    user_id: string,
    cur_year: number,
    cur_month: number,
    cur_day: number,
    alarm: number,
  ): Promise<any> {
    const { user, updated } = await this.calendarRepository.setForceAlarm(
      user_id,
      cur_year,
      cur_month,
      cur_day,
      alarm,
    );
    for (const calendar of updated) {
      const sendAt = new Date(
        cur_year,
        cur_month - 1,
        calendar.s_day,
        calendar.s_hour,
        calendar.s_minute,
      );
      sendAt.setMinutes(sendAt.getMinutes() - alarm);
      console.log('메시지 예약 시간 : ', sendAt);
      this.sendDirectTo(
        user_id,
        'From Flrou',
        `${user.nickname}님, ${calendar.plan}${alarm}분 전입니다.`,
        sendAt,
      );
    }
    return 'success';
  }

  // --- FCM
  async sendDirectTo(
    user_id: string,
    title: string,
    body: string,
    sendAt: Date,
  ): Promise<any> {
    const user = await User.findOne({ where: { user_id } });
    const res = this.firebaseService.scheduleMessage(
      user.device_token,
      title,
      body,
      sendAt,
    );
    return res;
  }
}
