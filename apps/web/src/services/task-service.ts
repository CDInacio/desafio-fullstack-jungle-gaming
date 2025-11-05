import type { CreateTask, ITask, ITaskComment } from "@/types/task";
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
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getAll(
    page: number = 1,
    size: number = 10,
    sortBy: string = "createdAt",
    sortOrder: "ASC" | "DESC" = "DESC"
  ) {
    try {
      const { data: result } = await api.get("/api/tasks", {
        params: { page, size, sortBy, sortOrder },
      });
      return result.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete(id: string) {
    try {
      const { data: result } = await api.delete(`/api/tasks/${id}`);
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

  async updateComment(id: string, comments: string[]) {
    try {
      const { data: result } = await api.put(`/api/tasks/${id}/comments`, {
        comments,
      });
      return result;
    } catch (error) {}
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

  async createComment(commentData: ITaskComment) {
    // console.log(commentData);
    try {
      const { data: result } = await api.post(
        `/api/tasks/${commentData.taskId}/comments`,
        {
          content: commentData.content,
          userId: commentData.userId,
          taskId: commentData.taskId,
        }
      );
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getComments(
    taskId: string,
    page: number = 1,
    size: number = 10,
    sortBy: string = "createdAt",
    sortOrder: "ASC" | "DESC" = "DESC"
  ) {
    try {
      const { data: result } = await api.get(`/api/tasks/${taskId}/comments`, {
        params: { page, size, sortBy, sortOrder },
      });
      return result.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}
export const taskService = new TaskService();
