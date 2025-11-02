// types/tasks.ts
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface IUser {
  id: string;
  username: string;
  email: string;
}

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

export interface IAssignment {
  id: string;
  taskId: string;
  userId: string;
  assignedAt: string;
  assignedBy: string;
  user: IUser | null;
  assigner: IUser | null;
}

export interface TaskApiResponse {
  statusCode: number;
  message: string;
  data: ITask;
}

export interface ITask {
  assignedUsers?: AssignedUser[];
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator: IUser | null;
  assignments: IAssignment[];
}

export interface IPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageLimit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ITaskResponse {
  tasks: ITask[];
  pagination: IPagination;
}

export interface FindParams {
  id: string;
}

// export type TaskFormData = Omit<CreateTask, "createdBy">;

export type TaskStatusLabel = {
  label: string;
  value: TaskStatus;
};

export type TaskPriorityLabel = {
  label: string;
  value: TaskPriority;
};

// Constantes auxiliares
export const TASK_STATUS_OPTIONS: TaskStatusLabel[] = [
  { label: "A fazer", value: "TODO" },
  { label: "Em progresso", value: "IN_PROGRESS" },
  { label: "Em revisão", value: "REVIEW" },
  { label: "Concluído", value: "DONE" },
];

export const TASK_PRIORITY_OPTIONS: TaskPriorityLabel[] = [
  { label: "Baixa", value: "LOW" },
  { label: "Média", value: "MEDIUM" },
  { label: "Alta", value: "HIGH" },
  { label: "Urgente", value: "URGENT" },
];
