import type { NotificationEventPayload } from '@repo/shared/notification-event';

export class NotificationHelper {
  // Cria um payload padronizado para eventos de notificação
  static createNotificationPayload(
    eventType: NotificationEventPayload['eventType'],
    userIds: string[],
    data: any,
    metadata?: NotificationEventPayload['metadata'],
  ): NotificationEventPayload {
    return {
      eventType,
      userIds: userIds.filter(Boolean).map(String), // Garante que são strings válidas
      data,
      metadata,
    };
  }

  // Extrai userIds de assignments de uma task
  static extractUserIdsFromTask(task: any): string[] {
    if (!task) return [];

    const assignments = task.assignments || [];
    return assignments.map((a: any) => a.userId || a.user_id).filter(Boolean);
  }
}
