import Layout from "@/components/layout";
import CenteredContainer from "@/components/centered-container";
import { useGetTasks, useCreateTask } from "@/hooks/use-tasks.hook";
import { useUsers } from "@/hooks/use-users.hook";
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
  const handleCreateTask = (data: CreateTask) => {
    createTask(data);
  };

  return (
    <Layout>
      <CenteredContainer className="px-0 sm:px-0 md:px-0">
        <div className="flex flex-col sm:flex-row sm:justify-end mt-4 sm:mt-6 gap-3 ">
          <TaskFormDialog users={users ?? []} onSubmit={handleCreateTask} />
        </div>
        {tasks?.tasks && <TaskTable tasks={tasks.tasks} />}
      </CenteredContainer>
    </Layout>
  );
}
