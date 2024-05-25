import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repo';
import { Chat } from './chat.entity';
import { GptService } from 'src/gpt/gpt.service';
import { spawn } from 'child_process';
import { TodoService } from 'src/todo/todo.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly gptService: GptService,
    private readonly todoService: TodoService,
  ) {}

    async findAllChat(user_id: string): Promise<Chat[]> {
      return this.chatRepository.findAll(user_id);
    }

    async createChat(user_id: string, content: string, mode: number, alarm: number | null): Promise<any> {
      // 사용자 대화 저장
      await this.chatRepository.create(user_id, content, true);
      console.log(mode);

      if(mode == 0) {
        // 일반대화 -> 일반 gpt
        const generatedText = await this.gptService.generateText(content);
        await this.chatRepository.create(user_id, generatedText, false);
        return generatedText;

      }else if(mode == 1) {
        return new Promise<string>((resolve, reject) => {
          const nerProcess = spawn('python', ['src/model/ner.py', content]);
          let nerOutput = '';

          nerProcess.stdout.on('data', (data) => {
            nerOutput += data.toString();
            console.log(nerOutput);
            resolve(data.toString())
          });
      
          nerProcess.stderr.on('data', (data) => {
            reject(`ner.py error: ${data.toString()}`);
          });
      
          nerProcess.on('close', (code) => {
            if (code !== 0) {
              reject(`ner.py process exited with code ${code}`);
              return;
            }
          });
        });


        // return new Promise<string>((resolve, reject) => {
        //   // NER 모델 돌리기
        //   const nerProcess = spawn('python', ['src/model/ner.py', content]);
        //   let nerOutput = '';
      
        //   nerProcess.stdout.on('data', (data) => {
        //     nerOutput += data.toString();
        //   });
      
        //   nerProcess.stderr.on('data', (data) => {
        //     reject(`ner.py error: ${data.toString()}`);
        //   });
      
        //   nerProcess.on('close', (code) => {
        //     if (code !== 0) {
        //       reject(`ner.py process exited with code ${code}`);
        //       return;
        //     }
      
        //     // OKT 모델 돌리기
        //     const pythonProcess = spawn('python', ['src/model/okt.py', nerOutput.trim()]);
      
        //     let oktOutput = '';
      
        //     pythonProcess.stdout.on('data', (data) => {
        //       oktOutput += data.toString();
        //     });
      
        //     pythonProcess.stderr.on('data', (data) => {
        //       reject(`okt.py error: ${data.toString()}`);
        //     });
      
        //     pythonProcess.on('close', (code) => {
        //       if (code !== 0) {
        //         reject(`okt.py process exited with code ${code}`);
        //       } else {
        //         resolve(oktOutput.trim());
        //       }
        //     });
        //   });
        // });

      }else if(mode == 2) {
        // 투두 리스트
        return new Promise<string>((resolve, reject) => {
          const pythonProcess = spawn('python', ['src/model/okt2.py', content]);
    
          pythonProcess.stdout.on('data', (data) => {
            if(data) {
              resolve(data.toString());
              console.log(data.toString())
              this.todoService.create(user_id, data.toString());
            }else {
              resolve('failed')
            }
          });
    
          pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
          });
        });
      }
    }
}