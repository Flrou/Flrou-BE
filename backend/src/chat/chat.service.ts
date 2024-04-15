import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repo';
import { Chat } from './chat.entity';
import { GptService } from 'src/gpt/gpt.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly gptService: GptService  
  ) {}

    async findAllChat(user_id: string): Promise<Chat[]> {
      return this.chatRepository.findAll(user_id);
    }

    async createChat(user_id: string, content: string, mode: number, alarm: number | null): Promise<string> {
      // 사용자 대화 저장
      await this.chatRepository.create(user_id, content, true);

      if(mode == 0) {
        // 일반대화 -> 일반 gpt
        const generatedText = await this.gptService.generateText(content);
        await this.chatRepository.create(user_id, generatedText, false);
        return generatedText;

      }else if(mode == 1) {
        // 캘린더 입력 -> 일정 관련 대화인지 chk -> 정제화 -> 분류 함수 실행 -> 캘린더 테이블에 저장
        const refinedText = await this.gptService.refineText(content);
        

      }else if(mode == 2) {
        // 투두 입력 -> 분류 함수 실행 -> 투두 테이블에 저장
      }
    }
}