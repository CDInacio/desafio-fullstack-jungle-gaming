import {
  CheckCircle2,
  Edit3,
  MessageSquare,
  Trash2,
  UserPlus,
} from "lucide-react";
import type { AuditLog, AuditAction } from "@/types/audit";

interface AuditStatsProps {
  logs: AuditLog[];
}

export function AuditStats({ logs }: AuditStatsProps) {
  const stats = {
    CREATE: logs.filter((log) => log.action === "CREATE").length,
    UPDATE: logs.filter((log) => log.action === "UPDATE").length,
    DELETE: logs.filter((log) => log.action === "DELETE").length,
    ASSIGN: logs.filter((log) => log.action === "ASSIGN").length,
    COMMENT: logs.filter((log) => log.action === "COMMENT").length,
  };

  const statCards = [
    {
      label: "Criações",
      value: stats.CREATE,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-600/10",
    },
    {
      label: "Atualizações",
      value: stats.UPDATE,
      icon: Edit3,
      color: "text-blue-600",
      bg: "bg-blue-600/10",
    },
    {
      label: "Exclusões",
      value: stats.DELETE,
      icon: Trash2,
      color: "text-red-600",
      bg: "bg-red-600/10",
    },
    {
      label: "Atribuições",
      value: stats.ASSIGN,
      icon: UserPlus,
      color: "text-purple-600",
      bg: "bg-purple-600/10",
    },
    {
      label: "Comentários",
      value: stats.COMMENT,
      icon: MessageSquare,
      color: "text-orange-600",
      bg: "bg-orange-600/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.bg} rounded-lg p-2`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
