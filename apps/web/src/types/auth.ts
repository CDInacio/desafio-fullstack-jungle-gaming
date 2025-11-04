export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUser {
  id?: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthResponse {
  message: string;
  data: IData;
}

interface IData {
  id: string | undefined;
  email: string;
  username: string;
  token: string;
  refreshToken: string;
  expiresIn: string;
  user: IUser;
}

export type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: IUser | null;
  login: (token: string, user: IUser) => void;
  logout: () => void;
};
