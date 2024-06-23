import { admin, adminApp } from './firebase.config';

import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(
    // @InjectRepository()
    // private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) {
    const serviceAccount = require(join(
      __dirname,
      './admin_private_key',
      'firebase_service_key.json'
    ));
  }

  private async getAccessToken(): Promise<string> {
    const credential = admin.credential.applicationDefault();
    const token = await credential.getAccessToken();
    return token.access_token;
  }

  async sendDirectTo(token: string, title: string, body: string): Promise<void> {
    const message = this.makeMessage(token, title, body);

    try {
      await admin.messaging().send(message);
      this.logger.log(`Message sent to ${token}`);
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
    }
  }

  async sendTopicTo(topicToken: string, title: string, body: string): Promise<void> {
    await this.sendDirectTo(topicToken, title, body);
  }

//   @Cron('0 0 * * * *')
//   async sendAllUsers(title: string, body: string): Promise<void> {
//     const users = await this.userRepository.findAll();
//     for (const user of users) {
//       this.logger.log(`Sending to ${user.fcm_token}`);
//       await this.sendDirectTo(user.fcm_token, title, body);
//     }
//   }

  private makeMessage(targetToken: string, title: string, body: string): admin.messaging.Message {
    return {
      token: targetToken,
      notification: {
        title,
        body,
      },
    };
  }
}