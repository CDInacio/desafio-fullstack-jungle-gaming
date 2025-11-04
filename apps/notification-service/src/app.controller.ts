import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationsGateway } from './notifications.gateway';
import type { NotificationEventPayload } from '@repo/shared/notification-event';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gateway: NotificationsGateway,
  ) {}
  private logger = new Logger('AppController');

  @MessagePattern('task.created')
  async handleTaskCreated(@Payload() payload: NotificationEventPayload) {
    this.logger.log('task.created received');
    this.gateway.emitToUsers('task.created', payload, payload.userIds);
    return { status: 'Notification sent' };
  }

  @MessagePattern('task.updated')
  async handleTaskUpdated(@Payload() payload: NotificationEventPayload) {
    this.logger.log('task.updated received');
    console.log(payload);
    this.gateway.emitToUsers('task.updated', payload, payload.userIds);
    return { status: 'Notification sent' };
  }

  @MessagePattern('comment.new')
  async handleCommentCreated(@Payload() payload: NotificationEventPayload) {
    this.logger.log('comment.created received');
    this.gateway.emitToUsers('comment.new', payload, payload.userIds);
    return { status: 'Notification sent' };
  }
}
