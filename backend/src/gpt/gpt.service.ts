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
                    ${prompt}를 'nn월 nn일 nn시 nn분에 어떤 할 일이 있어.' 이라는 문장으로 깔끔하게 정리해줘.
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
