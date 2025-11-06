import axios, { type InternalAxiosRequestConfig } from "axios";
import { AuthStorage } from "@/utils/auth-storage";

export const api = axios.create({
  baseURL: "http://localhost:3002",
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = AuthStorage.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
