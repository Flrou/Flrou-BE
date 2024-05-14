import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repo';
import { Chat } from './chat.entity';
import { GptService } from 'src/gpt/gpt.service';
import { spawn } from 'child_process';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly gptService: GptService  
  ) {}

    async findAllChat(user_id: string): Promise<Chat[]> {
      return this.chatRepository.findAll(user_id);
    }

    async createChat(user_id: string, content: string, mode: number, alarm: number | null): Promise<any> {
      // 사용자 대화 저장
      await this.chatRepository.create(user_id, content, true);

      if(mode == 0) {
        // 일반대화 -> 일반 gpt
        const generatedText = await this.gptService.generateText(content);
        await this.chatRepository.create(user_id, generatedText, false);
        return generatedText;

      }else if(mode == 1) {
        // 문장 정제하기 (사용 X)
        // const refinedText = await this.gptService.refineText(content);

        // NER 모델 돌리기


        // OKT 모델 돌리기
        return new Promise<string>((resolve, reject) => {
          const pythonProcess = spawn('python', ['src/model/okt.py', content]);
    
          pythonProcess.stdout.on('data', (data) => {
            resolve(data.toString());
          });
    
          pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
          });
        });

      }else if(mode == 2) {
        // 투두 리스트
        return new Promise<string>((resolve, reject) => {
          const pythonProcess = spawn('python', ['src/model/okt2.py', content]);
    
          pythonProcess.stdout.on('data', (data) => {
            resolve(data.toString());
          });
    
          pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
          });
        });
      }
    }
}