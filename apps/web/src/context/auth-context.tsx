// src/contexts/auth-context.tsx
import type { IUser } from "@/types/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface AuthState {
  token: string | null;
  user: IUser | null;
  login: (token: string, userData: IUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    const token = localStorage.getItem("token");
    return token ? token : null;
  });
  const [user, setUser] = useState<IUser | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = (token: string, userData: IUser): void => {
    setToken(token);
    setUser(userData);
  };

  const logout = (): void => {
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
