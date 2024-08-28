import { admin, adminApp } from './firebase.config';

import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    const serviceAccount = require(
      join(__dirname, './admin_private_key', 'firebase_service_key.json'),
    );
  }

  private async getAccessToken(): Promise<string> {
    const credential = admin.credential.applicationDefault();
    const token = await credential.getAccessToken();
    return token.access_token;
  }

  // async scheduleMessage(token: string, title: string, body: string, sendAt: Date): Promise<void> {
  //   const job = new CronJob(sendAt, async () => {
  //     await this.sendDirectTo(token, title, body);
  //     this.schedulerRegistry.deleteCronJob(`send-message-${token}-${sendAt.getTime()}`);
  //     this.logger.log(`Scheduled message sent to ${token} at ${sendAt}`);
  //   });

  //   this.schedulerRegistry.addCronJob(`send-message-${token}-${sendAt.getTime()}`, job);
  //   job.start();

  //   this.logger.log(`Scheduled message to ${token} at ${sendAt}`);
  // }

  async scheduleMessage(
    token: string,
    title: string,
    body: string,
    sendAt: Date,
  ): Promise<void> {
    // 과거 시간이 입력되었을 경우 리턴
    const now = new Date();
    if (sendAt <= now) {
      return;
    }

    const job = new CronJob(sendAt, async () => {
      await this.sendDirectTo(token, title, body);
      this.schedulerRegistry.deleteCronJob(
        `send-message-${token}-${sendAt.getTime()}`,
      );
      this.logger.log(`Scheduled message sent to ${token} at ${sendAt}`);
    });

    this.schedulerRegistry.addCronJob(
      `send-message-${token}-${sendAt.getTime()}`,
      job,
    );
    job.start();

    this.logger.log(`Scheduled message to ${token} at ${sendAt}`);
  }

  async sendDirectTo(
    token: string,
    title: string,
    body: string,
  ): Promise<void> {
    const message = this.makeMessage(token, title, body);

    try {
      await admin.messaging().send(message);
      this.logger.log(`Message sent to ${token}`);
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
    }
  }

  async sendTopicTo(
    topicToken: string,
    title: string,
    body: string,
  ): Promise<void> {
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

  private makeMessage(
    targetToken: string,
    title: string,
    body: string,
  ): admin.messaging.Message {
    return {
      token: targetToken,
      notification: {
        title,
        body,
      },
    };
  }
}
