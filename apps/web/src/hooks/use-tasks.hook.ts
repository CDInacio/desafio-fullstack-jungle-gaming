import { taskService } from "@/services/task-service";
import type {
  CreateTask,
  ITask,
  ITaskResponse,
  TaskApiResponse,
  ITaskComment,
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

export function useGetTasks(
  page: number = 1,
  size: number = 10,
  sortBy: string = "createdAt",
  sortOrder: "ASC" | "DESC" = "DESC"
) {
  return useQuery<ITaskResponse, Error>({
    queryKey: ["tasks", page, size, sortBy, sortOrder],
    queryFn: () => taskService.getAll(page, size, sortBy, sortOrder),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Partial<ITask>) => {
      if (!task.id) {
        throw new Error("Task ID is required for update");
      }
      return taskService.update(task.id, task);
    },
    onSuccess: (_, task) => {
      toast.success("Tarefa atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["task", task.id] });
    },
    onError: (error) => {
      toast.error("Erro ao atualizar tarefa", { description: error.message });
    },
  });
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      toast.success("Tarefa deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTimeout(() => {
        window.location.href = "/home";
      }, 1000);
    },
  });
};

export function useCreatTaskComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentData: ITaskComment) => {
      return taskService.createComment(commentData);
    },
    onSuccess: (_, commentData) => {
      toast.success("Comentário criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["task", commentData.taskId] });
      queryClient.invalidateQueries({
        queryKey: ["task-comments", commentData.taskId],
      });
    },
    onError: (error) => {
      toast.error("Erro ao criar comentário", { description: error.message });
    },
  });
}

export function useGetTaskComments(
  taskId: string,
  page: number = 1,
  size: number = 10,
  sortBy: string = "createdAt",
  sortOrder: "ASC" | "DESC" = "DESC"
) {
  return useQuery({
    queryKey: ["task-comments", taskId, page, size, sortBy, sortOrder],
    queryFn: () =>
      taskService.getComments(taskId, page, size, sortBy, sortOrder),
    enabled: !!taskId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
