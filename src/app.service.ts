import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as address from 'address';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';

@Injectable()
export class AppService {
  constructor(@Inject('ECOM_SAT_SERVICE') private client: ClientProxy) {}

  async runCmnd(cmd: string) {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error || stderr) {
          reject({
            error,
            response: stderr,
          });
        }
        resolve(stdout);
      });
    });
  }

  async runPython(filename: string) {
    try {
      return await this.runCmnd(`python /home/pi/ecom/ecom/${filename}`);
    } catch (e: any) {
      console.error('Error running python: ', e);
    }
  }

  async interact(data: { filename: string; interactionId: string }) {
    console.log('Interacting with: ', data);
    try {
      const response = await this.runCmnd('whoami');
      console.log('Response: ', response);
      await this.emitInteractResponse({
        success: true,
        response: response,
        interactionId: data.interactionId,
      });
    } catch (e: any) {
      console.error('Error interacting: ', e);
      await this.emitInteractResponse({
        success: false,
        error: {
          trace: e.error,
          message: e.response,
        },
        interactionId: data.interactionId,
      });
    }
  }

  async emitInteractResponse(data: {
    success: boolean;
    response?: any;
    error?: {
      message: string;
      trace: any;
    };
    interactionId: string;
  }) {
    this.client.emit('ecom/0a-00-27-00-00-0a/interact-response', data);
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
