// types/tasks.ts
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface AssignedUser {
  id: string;
  username?: string;
  email?: string;
}

export interface CreateTask {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: Date | string;
  createdBy: string;
  assignedUsers?: AssignedUser[];
}

export interface UpdateTask {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  deadline?: Date | string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: Date | string;
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FindParams {
  id: string;
}

export interface ITask extends TaskResponse {}

export type TaskFormData = Omit<CreateTask, "createdBy">;

export type TaskStatusLabel = {
  label: string;
  value: TaskStatus;
};

export type TaskPriorityLabel = {
  label: string;
  value: TaskPriority;
};

// Constantes auxiliares para uso em componentes
export const TASK_STATUS_OPTIONS: TaskStatusLabel[] = [
  { label: "A fazer", value: "TODO" },
  { label: "Em progresso", value: "IN_PROGRESS" },
  { label: "Em revisão", value: "REVIEW" },
  { label: "Concluído", value: "DONE" },
];

// export const TASK_PRIORITY_OPTIONS: TaskPriorityLabel[] = [
//   { label: "Baixa", value: TaskPriority.LOW },
//   { label: "Média", value: TaskPriority.MEDIUM },
//   { label: "Alta", value: TaskPriority.HIGH },
//   { label: "Urgente", value: TaskPriority.URGENT },
// ];

// Helper functions para conversão de labels
export const getStatusLabel = (status: TaskStatus): string => {
  return TASK_STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
};

// export const getPriorityLabel = (priority: TaskPriority): string => {
//   return (
//     TASK_PRIORITY_OPTIONS.find((p) => p.value === priority)?.label ?? priority
//   );
// };

// // Type guards
// export const isTaskStatus = (value: string): value is TaskStatus => {
//   return Object.values(TaskStatus).includes(value as TaskStatus);
// };

// export const isTaskPriority = (value: string): value is TaskPriority => {
//   return Object.values(TaskPriority).includes(value as TaskPriority);
// };
