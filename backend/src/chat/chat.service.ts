import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repo';
import { Chat } from './chat.entity';
import { GptService } from 'src/gpt/gpt.service';
import { spawn } from 'child_process';
import { TodoService } from 'src/todo/todo.service';

import axios from "axios";

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
      // 사용자 대화 타입
      console.log('chat type: ', mode);
      await this.chatRepository.create(content, 0, mode, user_id);
      
      // 일반대화 -> 일반 gpt
      if(mode == 0) {
        const generatedText = await this.gptService.generateText(content);
        await this.chatRepository.create(generatedText, 1, mode, user_id);
        return generatedText;

      // 캘린더
      }else if(mode == 1) {
        try {
          const {data} = await axios.post('http://127.0.0.1:8000/ner', { content });
          if(data[3] == null) {
            data[3] = '오전';
            data[9] = '오전'
          } 
          const plan = data.pop();

          return new Promise<any>((resolve, reject) => {
            const pythonProcess = spawn('python', ['src/model/okt.py', plan]);

            pythonProcess.stdout.on('data', (okt_res) => {
              let returnData = {
                s_year: Number(data[0]),
                s_month: Number(data[1]),
                s_day: Number(data[2]),
                s_ampm: data[3],
                s_hour: Number(data[4]),
                s_minute: Number(data[5]),
                f_year: Number(data[6]),
                f_month: Number(data[7]),
                f_day: Number(data[8]),
                f_ampm: data[9],
                f_hour: Number(data[10]),
                f_minute: Number(data[11]),
                plan: ''
              }
              console.log(returnData)

              if(okt_res) {
                returnData.plan = okt_res.toString();
                console.log(returnData)
                resolve(returnData);
              }else {
                returnData.plan = plan;
                console.log(returnData)
                resolve(returnData)
              }
            });
      
            pythonProcess.stderr.on('data', (data) => {
              reject(data.toString());
            });
          });
        } catch (error) {
          console.error('Error while processing text:', error);
          throw 'failed';
        }

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