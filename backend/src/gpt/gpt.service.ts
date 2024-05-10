import { Injectable } from '@nestjs/common';
import OpenAI from "openai";

@Injectable()
export class GptService {
  private readonly apiKey: string = process.env.GPT_API_KEY;

  // 1) 일반 대화
  async generateText(prompt: string): Promise<string> {
    const openai = new OpenAI({apiKey: this.apiKey});
    try {
        const completion = await openai.chat.completions.create({
            messages: [
            {
                role: "system",
                content: "You are a good Korean assistant and friend designed to output JSON.",
            },
            {
                role: "user",
                content: prompt },
            ],
            model: "gpt-3.5-turbo-0125",
            response_format: { type: "json_object" },
        });
        console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;

    } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('API 요청 실패');
    }
  }

  // 2) 일정 대화 정제하기
  async refineText(prompt: string): Promise<string> {
    const openai = new OpenAI({apiKey: this.apiKey});
    try {
        const completion = await openai.chat.completions.create({
            messages: [
            {
                role: "system",
                content: "You are a good Korean assistant and friend designed to output JSON.",
            },
            {
                role: "user",
                content: `
                    ${prompt} 
                    위의 입력을 아래와 같은 문장의 형식으로 출력해줘.
                    {s_year}년 {s_month}월 {s_day}일 {s_hour}시 {s_minute}분부터 {e_hour}시 {e_minute}까지 {plan}가 있어.
                ` },
            ],
            model: "gpt-3.5-turbo-0125",
            response_format: { type: "json_object" },
        });
        console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;

    } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('API 요청 실패');
    }
  }
}

//s_year: 시작 연도, s_month: 시작 월, s_day: 시작 일, s_hour: 시작 시, s_minute: 시작 분, e_hour: 끝나는 시, e_minute: 끝나는 분, plan: 일정내용