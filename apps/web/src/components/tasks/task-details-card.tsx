import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge } from "@/components/priority-badge";
import type { ITask } from "@/types/task";
import { Badge } from "../ui/badge";
import type { TaskStatusKey } from "@/types/status-info";

interface TaskDetailsCardProps {
  task: ITask;
  statusConfig: Record<
    TaskStatusKey,
    {
      label: string;
      color: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  >;
}

export function TaskDetailsCard({ task, statusConfig }: TaskDetailsCardProps) {
  const StatusIcon = statusConfig[task.status]?.icon;
  const statusInfo = statusConfig[task.status] || statusConfig.TODO;

  return (
    <Card className="bg-primary border-zinc-800">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center gap-3">
          <PriorityBadge priority={task.priority} />
          <Badge variant="outline" className={statusInfo.color}>
            <StatusIcon className="h-3 w-3 mr-1.5" />
            {statusInfo.label}
          </Badge>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-white">Descrição</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {task.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-zinc-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white mb-0.5">Prazo</p>
              <p className="text-sm text-zinc-400">
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString("pt-BR")
                  : "Sem prazo definido"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-zinc-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white mb-0.5">
                Criado por
              </p>
              <p className="text-sm text-zinc-400 font-mono ">
                {task.creator?.username}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-zinc-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white mb-0.5">
                Última atualização
              </p>
              <p className="text-sm text-zinc-400">
                {new Date(task.updatedAt).toLocaleDateString("pt-BR")} às{" "}
                {new Date(task.updatedAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
