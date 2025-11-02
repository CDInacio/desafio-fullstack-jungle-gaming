import CenteredContainer from "@/components/centered-container";
import Layout from "@/components/layout";
import { useGetTask } from "@/hooks/use-tasks.hook";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { TaskHeader } from "@/components/tasks/task-header";
import { TaskDetailsCard } from "@/components/tasks/task-details-card";
import { TaskAssignmentsCard } from "@/components/tasks/task-assignment-card";
import { TaskCommentsCard } from "@/components/tasks/task-comments-card";
import type { ITask } from "@/types/task";
import { LoadingState } from "@/components/loading-state";
import { NotFoundState } from "@/components/not-found-state";
import type { StatusInfo } from "@/types/status-info";

export const Route = createFileRoute("/_authenticated/task/$id")({
  component: RouteComponent,
});

const statusConfig: Record<string, StatusInfo> = {
  TODO: {
    label: "A Fazer",
    color: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    icon: Circle,
  },
  IN_PROGRESS: {
    label: "Em Progresso",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Clock,
  },
  REVIEW: {
    label: "Em Revisão",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: AlertCircle,
  },
  DONE: {
    label: "Concluído",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle2,
  },
};

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data: response, isLoading } = useGetTask(id);

  if (isLoading) return <LoadingState />;
  if (!response) return <NotFoundState />;

  const task: ITask = response?.data;

  return (
    <Layout>
      <CenteredContainer>
        <div className="space-y-6">
          <TaskHeader task={task} />
          <TaskDetailsCard task={task} statusConfig={statusConfig} />
          <TaskAssignmentsCard task={task} />
          <TaskCommentsCard />
        </div>
      </CenteredContainer>
    </Layout>
  );
}
