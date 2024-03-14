import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { mac } from './constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(`ecom/${mac}/interact`)
  interact(@Payload() data: any) {
    return this.appService.interact(data);
  }
}
