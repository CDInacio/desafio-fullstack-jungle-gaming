export interface NotificationEventPayload {
  eventType: "task.created" | "task.updated" | "comment.new";
  userIds: string[];
  data: any;
  metadata?: {
    taskId?: string;
    taskTitle?: string;
    commentId?: string;
    userId?: string; // Usuário que disparou a ação
  };
}

export class NotificationEventDto implements NotificationEventPayload {
  eventType: "task.created" | "task.updated" | "comment.new";
  userIds: string[];
  data: any;
  metadata?: {
    taskId?: string;
    taskTitle?: string;
    commentId?: string;
    userId?: string;
  };
}
