export const AuditAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  ASSIGN: "ASSIGN",
  COMMENT: "COMMENT",
};

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  userId: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  description: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AuditLogResponse {
  message: string;
  data: AuditLog[];
}
