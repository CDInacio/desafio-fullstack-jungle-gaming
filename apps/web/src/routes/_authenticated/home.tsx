import Layout from "@/components/layout";
import CenteredContainer from "@/components/centered-container";
import { useGetTasks, useCreateTask } from "@/hooks/use-tasks.hook";
import { useUsers } from "@/hooks/use-users.hook";
import { useAuth } from "@/context/auth-context";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskTable } from "@/components/tasks/task-table";
import type { CreateTask } from "@/types/task";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: tasks } = useGetTasks();
  const { data: users } = useUsers();
  const { mutate: createTask } = useCreateTask();
  const { user } = useAuth();
  console.log(tasks);
  const handleCreateTask = (data: CreateTask) => {
    createTask({
      ...data,
      createdBy: user?.id ?? "",
    });
  };

  return (
    <Layout>
      <CenteredContainer>
        <div className="flex justify-end mt-6">
          <TaskFormDialog users={users ?? []} onSubmit={handleCreateTask} />
        </div>
        {tasks?.tasks && <TaskTable tasks={tasks.tasks} />}
      </CenteredContainer>
    </Layout>
  );
}
