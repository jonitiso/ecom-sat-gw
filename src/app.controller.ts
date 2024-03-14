import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('ecom/c8-3e-a7-01-3a-06/interact')
  interact(@Payload() data: any) {
    return this.appService.interact(data);
  }

  @MessagePattern('ecom/0a-00-27-00-00-0a/interact')
  interact2(@Payload() data: any) {
    return this.appService.interact(data);
  }
}
