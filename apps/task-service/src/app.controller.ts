import { MessagePattern, Payload, ClientProxy } from '@nestjs/microservices';
import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTaskDto } from '@repo/shared/task';
import { NOTIFICATION_SERVICE_RABBITMQ } from '@repo/shared/index';

@Controller()
export class AppController {
  constructor(
    @Inject(NOTIFICATION_SERVICE_RABBITMQ)
    private readonly notificationClient: ClientProxy,
    private readonly appService: AppService,
  ) {}

  @MessagePattern('task.created')
  async handleCreateTask(@Payload() payload: CreateTaskDto) {
    const result = await this.appService.createTask(payload);

    this.notificationClient.emit('task.created', result);

    return result;
  }

  @MessagePattern('task.get')
  async getTaskById(@Payload() id: string) {
    const task = await this.appService.getTaskById(id);
    console.log(task);
  }

  @MessagePattern('task.delete')
  async deleteTaskById(@Payload() id: string) {
    const result = await this.appService.deleteTaskById(id);
    console.log(result);
  }
}
