import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repo';
import { User } from './user.entity';

import * as bcrypt from 'bcrypt';
import { CalendarService } from 'src/calendar/calendar.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly calendarService: CalendarService,
  ) {}

    async findAllUsers(): Promise<User[]> {
      return this.userRepository.findAll();
    }

    async registerUser(user_id: string, user_pw: string, nickname: string): Promise<string | null> {
      // 아이디 중복 확인
      const user = await this.userRepository.findOneByUserId(user_id);
      if(user) return 'duplicated user_id';

      const hash = bcrypt.hashSync(user_pw, 10); // 패스워드 10자리 해시화

      // 아이디, 패스워드 모두 존재하면 카카오 로그인인 것으로 추정 -> 로그인 진행
      if(hash) {
        this.loginUser(user_id, user_pw);
      }

      // 유저 생성
      try {
        await this.userRepository.create({
          user_id: user_id,
          user_pw: hash,
          nickname: nickname
        });
        console.log('user table insert succeed');
        return 'success';
      } catch (error) {
        console.log(error);
        return 'failed';
      }
    }

    async loginUser(user_id: string, user_pw: string): Promise<User | string | null> {
      // 맞게 입력했는지 확인
      const user = await this.userRepository.findOneByUserId(user_id);
      if(!user) {
        return 'wrong user_id';
      }else {
        const same = bcrypt.compareSync(user_pw, user.user_pw); // 입력한 패스워드와 해시값 비교
        if(same) {
          return user; // 맞으면 유저 정보 반환
        }
      }
    }

    async setForce(user_id: string, cur_year: number, cur_month: number, alarm: number): Promise<any> {
      try {
        // force 설정 (true/false)
        const setting = await this.userRepository.setForce(user_id);
        // 강제 알림
        if(setting) { // force == true
          await this.calendarService.setForceAlarm(user_id, cur_year, cur_month, alarm);
        }else { // force == false
          
        }
        return 'success';
      } catch (error) {
        return 'failed'
      }
    }
}