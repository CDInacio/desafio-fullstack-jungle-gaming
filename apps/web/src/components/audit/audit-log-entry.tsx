import { format, subHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle2,
  Edit3,
  MessageSquare,
  Trash2,
  UserPlus,
} from "lucide-react";
import type { AuditLog, AuditAction } from "@/types/audit";
import { Badge } from "@/components/ui/badge";

interface AuditLogEntryProps {
  log: AuditLog;
  isLast?: boolean;
}

const actionConfig: Record<
  AuditAction,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  CREATE: {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
    label: "Criado",
  },
  UPDATE: {
    icon: Edit3,
    color: "text-blue-600",
    bg: "bg-blue-100",
    label: "Atualizado",
  },
  DELETE: {
    icon: Trash2,
    color: "text-red-600",
    bg: "bg-red-100",
    label: "Deletado",
  },
  ASSIGN: {
    icon: UserPlus,
    color: "text-purple-600",
    bg: "bg-purple-100",
    label: "Atribuído",
  },
  COMMENT: {
    icon: MessageSquare,
    color: "text-orange-600",
    bg: "bg-orange-100",
    label: "Comentário",
  },
};

export function AuditLogEntry({ log, isLast = false }: AuditLogEntryProps) {
  const config = actionConfig[log.action];
  const Icon = config.icon;

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  // solução não muito boa, mudar depois para lidar com timezone no backend
  const formattedDate = format(
    subHours(log.createdAt, 3),
    "dd/MM/yyyy 'às' HH:mm",
    { locale: ptBR }
  );

  const renderDiff = () => {
    if (!log.oldValue && !log.newValue) return null;

    if (log.action === "CREATE") {
      return (
        <div className="mt-2 text-sm text-muted-foreground">
          <div className="">Valores iniciais:</div>
          <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
            {JSON.stringify(log.newValue, null, 2)}
          </pre>
        </div>
      );
    }

    if (log.action === "DELETE") {
      return (
        <div className="mt-2 text-sm text-muted-foreground">
          <div className="">Dados deletados:</div>
          <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
            {JSON.stringify(log.oldValue, null, 2)}
          </pre>
        </div>
      );
    }

    if (log.action === "UPDATE" && log.oldValue && log.newValue) {
      const changes = Object.keys(log.newValue);

      return (
        <div className="mt-2 space-y-2">
          {changes.map((key) => (
            <div key={key} className="text-sm">
              <span className="font-medium text-muted-foreground">{key}:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-red-600 line-through">
                  {formatValue(log.oldValue?.[key])}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="text-green-600 font-medium">
                  {formatValue(log.newValue?.[key])}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex gap-4 pb-6 relative flex-col sm:flex-row">
      {/* vertical line only on sm+ screens */}
      {!isLast && (
        <div className="hidden sm:block absolute left-4 top-10 bottom-0 w-px bg-border" />
      )}

      <div className={`relative z-10 shrink-0 ${config.bg} rounded-full p-2`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>

      <div className="flex-1 pt-0.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {config.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formattedDate}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-white wrap-break-word">
              {log.description}
            </p>
          </div>
        </div>

        {renderDiff()}
      </div>
    </div>
  );
}
