import { MessagePattern } from '@nestjs/microservices';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('task-created')
  getHello(): string {
    console.log('task created');
    return this.appService.getHello();
  }
}
