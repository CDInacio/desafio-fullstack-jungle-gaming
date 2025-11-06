import { AuditLogsPage } from "@/components/audit/audit-logs-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/audit-logs")({
  component: AuditLogsPage,
});
