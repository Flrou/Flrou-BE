import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import * as admin from 'firebase-admin';

import { getAnalytics } from "firebase/analytics";

@Injectable()
export class FcmService {
  constructor() {}

  async fcm(token: string, title: string, message: string) {
    const payload = {
      token: token,
      notification: {
        title: title,
        body: message,
      },
      data: {
        body: message,
      },
    };
    console.log(payload);
    const result = await admin
      .messaging()
      .send(payload)
      .then((response) => {
        // Response is a message ID string.
        // console.log('Successfully sent message:', response);
        // return true;
        return { sent_message: response };
      })
      .catch((error) => {
        // console.log('error');
        // console.log(error.code);
        // return false;
        return { error: error.code };
      });
    return result;
  }
}