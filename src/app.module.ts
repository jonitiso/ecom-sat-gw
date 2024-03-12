import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ECOM_SAT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://3.238.241.19:1883',
          username: 'ecom',
          password: 'jonitiso1',
        },
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
