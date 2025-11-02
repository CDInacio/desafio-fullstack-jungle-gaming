import { taskService } from "@/services/task-service";
import type {
  CreateTask,
  ITask,
  ITaskResponse,
  TaskApiResponse,
} from "@/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateTask() {
  const queryClient = useQueryClient();
  //<return, error, argument>
  return useMutation<ITask, Error, CreateTask>({
    mutationFn: (task: CreateTask) => taskService.create(task),
    onError: (error) => {
      toast.error("Erro ao criar tarefa", { description: error.message });
    },
    onSuccess: () => {
      toast.success("Tarefa criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useGetTask(id: string) {
  return useQuery<TaskApiResponse, Error>({
    queryKey: ["task", id],
    queryFn: () => taskService.getById(id),
  });
}

export function useGetTasks() {
  return useQuery<ITaskResponse, Error>({
    queryKey: ["tasks"],
    queryFn: () => taskService.getAll(),
  });
}
