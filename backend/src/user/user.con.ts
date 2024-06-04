import { Controller, Get, Post, Body, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 모든 유저 조회
  @Get('findAll')
  getAllUsers() {
    return this.userService.findAllUsers();
  }

  // 회원가입
  @Post('signup')
  signup(@Body('user_id') user_id: string, @Body('user_pw') user_pw: string, @Body('nickname') nickname: string) {
    return this.userService.registerUser(user_id, user_pw, nickname);
  }

  // 로그인
  @Post('login')
  login(@Body('user_id') user_id: string, @Body('user_pw') user_pw: string) {
    return this.userService.loginUser(user_id, user_pw);
  }

  // 강제 알림 설정
  @Post('setForce')
  setForce(@Body('user_id') user_id: string, @Body('cur_year') cur_year: number, @Body('cur_month') cur_month: number, alarm: number) {
    return this.userService.setForce(user_id, cur_year, cur_month, alarm);
  }
}