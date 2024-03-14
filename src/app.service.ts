import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as address from 'address';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';

@Injectable()
export class AppService {
  constructor(@Inject('ECOM_SAT_SERVICE') private client: ClientProxy) {}

  async asyncRun(filename: string) {
    return new Promise((resolve, reject) => {
      exec(`python /home/pi/ecom/ecom/${filename}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      });
    });
  }

  async interact(data: { filename: string }) {
    console.log('Interacting with: ', data);
    try {
      const response = await this.asyncRun(data.filename);
      console.log('Response: ', response);
    } catch (e) {
      console.error('Error interacting: ', e);
    }
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
    try {
      const mac = await this.getMacAddress();
      this.client.emit('ecom/connected-device', {
        mac,
      });
    } catch (e) {
      console.error('Error sending start ping: ', e);
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async sendPing() {
    try {
      const mac = await this.getMacAddress();
      this.client.emit('ecom/ping', {
        mac,
      });
    } catch (e) {
      console.error('Error sending ping: ', e);
    }
  }
}
