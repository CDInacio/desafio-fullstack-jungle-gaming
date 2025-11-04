import { MessagePattern, Payload, ClientProxy } from '@nestjs/microservices';
import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTaskDto, type TaskCommentDto } from '@repo/shared/task';
import { NOTIFICATION_SERVICE_RABBITMQ } from '@repo/shared/index';
import type { PaginationQuery } from '@repo/shared/pagination';
import { NotificationHelper } from './helpers/notification.helper';

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

    if (result.data) {
      const notificationPayload = NotificationHelper.createNotificationPayload(
        'task.created',
        NotificationHelper.extractUserIdsFromTask(result.data),
        result.data,
        {
          taskId: result.data.id,
          taskTitle: result.data.title,
          userId: result.data.createdBy ?? undefined,
        },
      );

      this.notificationClient.emit('task.created', notificationPayload);
    }

    return result;
  }

  @MessagePattern('task.update')
  async updateTask(@Payload() payload: any) {
    const { id, ...rest } = payload;
    const updateData =
      payload.updateData ??
      Object.fromEntries(Object.entries(payload).filter(([k]) => k !== 'id'));

    const result = await this.appService.updateTask(id, rest);

    if (result.data) {
      const notificationPayload = NotificationHelper.createNotificationPayload(
        'task.created',
        NotificationHelper.extractUserIdsFromTask(result.data),
        result.data,
        {
          taskId: result.data.id,
          taskTitle: result.data.title,
          userId: result.data.createdBy ?? undefined,
        },
      );
      this.notificationClient.emit('task.updated', notificationPayload);
    }

    return result;
  }

  @MessagePattern('task.get')
  async getTaskById(@Payload() id: string) {
    const task = await this.appService.getTaskById(id);
    return task;
  }

  @MessagePattern('task.getAll')
  async getTasks(@Payload() query: PaginationQuery) {
    const tasks = await this.appService.getTasks(query);
    return tasks;
  }

  @MessagePattern('task.delete')
  async deleteTaskById(@Payload() id: string) {
    const result = await this.appService.deleteTaskById(id);
    console.log(result);
  }

  @MessagePattern('comment.new')
  async createComment(@Payload() payload: TaskCommentDto) {
    const result = await this.appService.createComment(payload);

    const notificationPayload = NotificationHelper.createNotificationPayload(
      'comment.new',
      result.userIds || [],
      result.data,
      result.metadata,
    );

    this.notificationClient.emit('comment.new', notificationPayload);
    return result;
  }
}
