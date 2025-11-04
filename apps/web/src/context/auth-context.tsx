import type { IUser } from "@/types/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthStorage } from "@/utils/auth-storage";

export interface AuthState {
  token: string | null;
  user: IUser | null;
  login: (token: string, refreshToken: string, userData: IUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    return AuthStorage.getToken();
  });

  const [user, setUser] = useState<IUser | null>(() => {
    return AuthStorage.getUser();
  });

  useEffect(() => {
    if (token) {
      AuthStorage.setTokens(token, AuthStorage.getRefreshToken() || "");
    } else {
      AuthStorage.clearTokens();
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      AuthStorage.setUser(user);
    }
  }, [user]);

  const login = (
    token: string,
    refreshToken: string,
    userData: IUser
  ): void => {
    console.log(userData);
    AuthStorage.setTokens(token, refreshToken);
    AuthStorage.setUser(userData);
    setToken(token);
    setUser(userData);
  };

  const logout = (): void => {
    AuthStorage.clearTokens();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
