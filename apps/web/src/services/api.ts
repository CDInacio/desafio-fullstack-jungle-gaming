import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";
import { AuthStorage } from "@/utils/auth-storage";

export const api = axios.create({
  baseURL: "http://localhost:3002",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

//  Adiciona o token JWT em todas as requisições
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

// Renova token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Se não for erro 401 ou já tentou renovar, rejeita
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Se já está renovando o token, adiciona à fila de espera
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = AuthStorage.getRefreshToken();

    if (!refreshToken) {
      // Se não tem refresh token, limpa tudo e redireciona
      AuthStorage.clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      // Tenta renovar o token
      const response = await axios.post(
        "http://localhost:3002/api/auth/refresh-token",
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { token: newToken, refreshToken: newRefreshToken } =
        response.data.data;

      // Salva os novos tokens
      AuthStorage.setTokens(newToken, newRefreshToken);

      // Atualiza o header da requisição original
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      // Processa todas as requisições que estavam na fila
      processQueue(null, newToken);

      // Retenta a requisição original
      return api(originalRequest);
    } catch (refreshError) {
      // Se falhar ao renovar, limpa tudo e redireciona para login
      processQueue(refreshError, null);
      AuthStorage.clearTokens();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
