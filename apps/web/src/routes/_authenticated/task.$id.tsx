import CenteredContainer from "@/components/centered-container";
import Layout from "@/components/layout";
import { useGetTask } from "@/hooks/use-tasks.hook";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { TaskHeader } from "@/components/tasks/task-header";
import { TaskEditProvider } from "@/context/task-edit-context";
import { TaskDetailsSkeleton } from "@/components/ui/task-details-skeleton";

export const Route = createFileRoute("/_authenticated/task/$id")({
  component: RouteComponent,
});

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
