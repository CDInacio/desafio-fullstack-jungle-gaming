// src/contexts/auth-context.tsx
import type { IUser } from "@/types/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface AuthState {
  accessToken: string | null;
  user: IUser | null;
  login: (token: string, userData: IUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    const token = localStorage.getItem("accessToken");
    return token ? token : null;
  });

  const [user, setUser] = useState<IUser | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");
  }, [accessToken]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = (token: string, userData: IUser): void => {
    setAccessToken(token);
    setUser(userData);
  };

  const logout = (): void => {
    setAccessToken(null);
    setUser(null);
  };

  const isAuthenticated = !!accessToken && !!user;

  return (
    <AuthContext.Provider
      value={{ accessToken, user, login, logout, isAuthenticated }}
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
