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
    console.log('Received task.created payload:', payload);
    this.logger.log('task.created received');
    console.log(payload.assignments);
    const userIds = extractUserIds(payload).map(String);
    this.gateway.emitToUsers('task.created', payload, userIds);
    return { status: 'Notification sent' };
  }
}

function extractUserIds(payload: any): string[] {
  if (!payload) return [];

  const task = payload.data ?? payload.task ?? payload;

  try {
    console.log('Received payload:', JSON.stringify(payload, null, 2));
  } catch (err) {
    console.dir(payload, { depth: null });
  }

  const candidates =
    task?.assignments ??
    task?.assignedUsers ??
    task?.assignees ??
    task?.participantIds ??
    task?.assigneeIds ??
    [];

  const ids = new Set<string>();

  if (Array.isArray(candidates) && candidates.length > 0) {
    candidates.forEach((item) => {
      if (!item) return;

      if (typeof item === 'string' || typeof item === 'number') {
        ids.add(String(item));
        return;
      }

      if (item.userId) ids.add(String(item.userId));
      else if (item.user_id) ids.add(String(item.user_id));
      else if (item.id) ids.add(String(item.id));
      else if (item.assignedTo) ids.add(String(item.assignedTo));
      else if (item.user && (item.user.id || item.userId))
        ids.add(String(item.user.id ?? item.userId));
    });
  }

  // campos únicos no próprio task (fallback)
  const fallbacks = ['userId', 'creatorId', 'createdBy', 'created_by'];
  for (const f of fallbacks) {
    if (task && (task as any)[f]) ids.add(String((task as any)[f]));
  }

  return Array.from(ids);
}
