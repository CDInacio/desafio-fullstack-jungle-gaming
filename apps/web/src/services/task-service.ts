import type { CreateTask, ITask } from "@/types/task";
import { api } from "./api";
import { handleApiError } from "@/utils/handle-api-error";

export class TaskService {
  async create(task: CreateTask) {
    try {
      const { data: result } = await api.post("/api/tasks", task);
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getById(id: string) {
    try {
      const { data: result } = await api.get(`/api/tasks/${id}`);
      console.log(result);
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getAll() {
    try {
      const { data: result } = await api.get("/api/tasks");
      return result.data;
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
  async addAssignments(taskId: string, userIds: string[], assignedBy: string) {
    try {
      const { data } = await api.post(`/api/tasks/${taskId}/assignments`, {
        userIds,
        assignedBy,
      });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const taskService = new TaskService();
