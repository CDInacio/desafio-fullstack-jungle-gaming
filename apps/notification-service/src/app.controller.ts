import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationsGateway } from './notifications.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gateway: NotificationsGateway,
  ) {}
  private logger = new Logger('AppController');

  @MessagePattern('task.created')
  async handleTaskCreated(@Payload() payload: any) {
    this.logger.log('task.created received');
    const userIds = extractUserIds(payload).map(String);
    console.log('Notifying...:');
    this.gateway.emitToUsers('task.created', payload, userIds);

    return { status: 'Notification sent' };
  }
}

function extractUserIds(payload: any): (string | number)[] {
  if (!payload) return [];
  // possiveis campos
  if (Array.isArray(payload.assigneeIds) && payload.assigneeIds.length) {
    return payload.assigneeIds;
  }
  if (Array.isArray(payload.assignees) && payload.assignees.length) {
    return payload.assignees.map((a) => a.id || a.userId);
  }
  // para comentários: participantes, subscribers, members...
  if (Array.isArray(payload.participantIds) && payload.participantIds.length) {
    return payload.participantIds;
  }
  // fallback: if payload contains userId
  if (payload.userId) return [payload.userId];
  if (payload.creatorId) return [payload.creatorId];
  // If task present, try task.assignees
  if (payload.task && Array.isArray(payload.task.assignees)) {
    return payload.task.assignees.map((a) => a.id || a.userId);
  }
  return [];
}
