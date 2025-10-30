// types/tasks.ts
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTask {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  deadline?: string;
  createdBy: string;
}

export interface IUpdateTask {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  deadline?: string;
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface IStatus {
  label: string;
  value: TaskStatus;
}

export interface IPriority {
  label: string;
  value: TaskPriority;
}
