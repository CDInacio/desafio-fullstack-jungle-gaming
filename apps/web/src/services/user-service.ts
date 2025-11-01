import type { ILogin, IRegister } from "@/types/auth";
import { api } from "./api";
import { handleApiError } from "@/utils/handle-api-error";

export class UserService {
  async register(data: IRegister) {
    try {
      const { confirmPassword, ...payload } = data;
      const { data: result } = await api.post("/api/auth/register", payload);
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async login(data: ILogin) {
    try {
      const { data: result } = await api.post("/api/auth/login", data);
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getUser(id: string) {
    try {
      const { data: result } = await api.get(`/api/users/${id}`);
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getUsers() {
    try {
      const { data: result } = await api.get("/api/users");
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const userService = new UserService();
