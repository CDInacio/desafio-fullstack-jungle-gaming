import { taskService } from "@/services/task-service";
import type { ITask } from "@/types/task";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateTask() {
  //<return, error, argument>
  return useMutation<ITask, Error, ITask>({
    mutationFn: (task: ITask) => taskService.create(task),
    onError: (error) => {
      toast.error("Erro ao criar tarefa", { description: error.message });
    },
    onSuccess: () => {
      toast.success("Tarefa criada com sucesso!");
    },
  });
}

export function useGetTasks() {
  return useQuery<ITask[], Error>({
    queryKey: ["tasks"],
    queryFn: () => taskService.getAll(),
  });
}
