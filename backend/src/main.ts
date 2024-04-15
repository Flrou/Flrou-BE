import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

// CORS 설정
const corsOptions: CorsOptions = {
  origin: ['http://127.0.0.1:5500'], // 허용할 도메인
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
  allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 적용
  app.enableCors(corsOptions);

  await app.listen(3000);
}
bootstrap();