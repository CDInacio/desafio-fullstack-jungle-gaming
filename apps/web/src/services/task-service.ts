import type { ITask } from "@/types/task";
import { api } from "./api";
import { handleApiError } from "@/utils/handle-api-error";

export class TaskService {
  async create(task: ITask) {
    try {
      const { data: result } = await api.post("/api/tasks", task);
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async get(id: string) {
    try {
      const { data: result } = await api.get(`/api/tasks/${id}`);
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getAll() {
    try {
      const { data: result } = await api.get("/api/tasks");
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async update(id: string, task: Partial<ITask>) {
    try {
      const { data: result } = await api.put(`/api/tasks/${id}`, task);
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const taskService = new TaskService();
