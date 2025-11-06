import { useQuery } from "@tanstack/react-query";
import { auditService } from "@/services/audit-service";

export const useTaskHistory = (taskId: string, enabled = true) => {
  return useQuery({
    queryKey: ["task-history", taskId],
    queryFn: () => auditService.getTaskHistory(taskId),
    enabled: enabled && !!taskId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useUserHistory = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: ["user-history", userId],
    queryFn: () => auditService.getUserHistory(userId),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useAllAuditLogs = (params?: {
  page?: number;
  limit?: number;
  action?: string;
  entityType?: string;
}) => {
  return useQuery({
    queryKey: ["all-audit-logs", params],
    queryFn: () => auditService.getAllLogs(params),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};
