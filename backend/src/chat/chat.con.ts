import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 모든 채팅 조회
  @Get('getAllchat/:user_id')
  getAllChat(@Param('user_id') user_id: string) {
    return this.chatService.findAllChat(user_id);
  }

  // 채팅 보내기
  @Post('send')
  async signup(
    @Body('user_id') user_id: string,   // 유저의 아이디
    @Body('content') content: string,   // 대화 내용
    @Body('mode') mode: number,         // 일반대화 / 캘린더 입력 / 투두 입력 구분
    @Body('alarm') alarm: number | null // 캘린더 입력의 경우 알람 지정
  ) {
    try {
      const answer = await this.chatService.createChat(user_id, content, mode, alarm);
      console.log('con : ', answer);
      return answer;
    } catch (error) {
      console.error('controller 에러 발생:', error);
      return { error: 'controller 에러 발생' };
    }
  }
}