import CenteredContainer from "@/components/centered-container";
import Layout from "@/components/layout";
import { useGetTask } from "@/hooks/use-tasks.hook";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { TaskHeader } from "@/components/tasks/task-header";
import { NotFoundState } from "@/components/not-found-state";
import type { StatusInfo } from "@/types/status-info";
import { TaskEditProvider } from "@/context/task-edit-context";
import { LoadingState } from "@/components/loading-state";
import { TaskDetailsSkeleton } from "@/components/ui/task-details-skeleton";

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

  const task = response?.data;

  return (
    <TaskEditProvider initialTask={task}>
      <Layout>
        <CenteredContainer>
          {isLoading ? (
            <TaskDetailsSkeleton />
          ) : (
            <div className="space-y-6">
              <TaskHeader />
              <Outlet />
            </div>
          )}
        </CenteredContainer>
      </Layout>
    </TaskEditProvider>
  );
}
