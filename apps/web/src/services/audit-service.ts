import { api } from "./api";
import { handleApiError } from "@/utils/handle-api-error";
import type { AuditLogResponse } from "@/types/audit";

export class AuditService {
  async getTaskHistory(taskId: string): Promise<AuditLogResponse> {
    try {
      const { data } = await api.get<AuditLogResponse>(
        `/api/tasks/${taskId}/history`
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getUserHistory(userId: string): Promise<AuditLogResponse> {
    try {
      const { data } = await api.get<AuditLogResponse>(
        `/api/users/${userId}/history`
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getAllLogs(params?: {
    page?: number;
    limit?: number;
    action?: string;
    entityType?: string;
  }): Promise<AuditLogResponse> {
    try {
      const { data } = await api.get<AuditLogResponse>("/api/audit-logs", {
        params,
      });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const auditService = new AuditService();
