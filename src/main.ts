import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://3.238.241.19:1883',
        username: 'ecom',
        password: 'jonitiso1',
      },
    },
  );
  await app.listen();

  const appService = app.get(AppService);

  appService.sendStartPing();
}
bootstrap();
