import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as address from 'address';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(@Inject('ECOM_SAT_SERVICE') private client: ClientProxy) {}
  getHello() {
    console.log('Hello World!');
  }

  async getMacAddress() {
    return new Promise((resolve, reject) => {
      address.mac((err, add) => {
        if (err) {
          reject(err);
        }
        resolve(add);
      });
    });
  }

  async sendStartPing() {
    const mac = await this.getMacAddress();
    this.client.emit('ecom/connected-device', {
      mac,
    });
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async sendPing() {
    console.log('Sending ping');
    const mac = await this.getMacAddress();
    this.client.emit('ecom/ping', {
      mac,
    });
  }
}
