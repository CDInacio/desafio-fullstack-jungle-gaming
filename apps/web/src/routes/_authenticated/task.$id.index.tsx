import { useGetTask, useUpdateTask } from "@/hooks/use-tasks.hook";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { TaskDetailsCard } from "@/components/tasks/task-details-card";
import { TaskAssignmentsCard } from "@/components/tasks/task-assignment-card";
import { TaskCommentsCard } from "@/components/tasks/task-comments-card";
import type { ITask } from "@/types/task";
import type { StatusInfo } from "@/types/status-info";
import { useEffect } from "react";
import { useTaskEdit } from "@/context/task-edit-context";

export const Route = createFileRoute("/_authenticated/task/$id/")({
  component: TaskIndexComponent,
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

function TaskIndexComponent() {
  const { id } = useParams({ strict: false });
  const { data: response } = useGetTask(id);
  const { mutate: updateTask } = useUpdateTask();
  const { isEditMode, setIsEditMode, resetEditState, setCurrentTask } =
    useTaskEdit();

  const task = response?.data as ITask;

  const handleSaveTask = async (updatedFields: Partial<ITask>) => {
    updateTask(
      { id: task.id, ...updatedFields },
      {
        onSuccess: () => {
          resetEditState();
        },
      }
    );
  };

  useEffect(() => {
    if (task) {
      setCurrentTask(task);
    }
  }, [task, setCurrentTask]);

  return (
    <>
      <TaskDetailsCard
        task={task}
        onSetEditMode={setIsEditMode}
        isEditMode={isEditMode}
        statusConfig={statusConfig}
        onSave={handleSaveTask}
      />
      <TaskAssignmentsCard task={task} />
      <TaskCommentsCard />
    </>
  );
}
