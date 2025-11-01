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
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: IUser | null;
  login: (token: string, user: IUser) => void;
  logout: () => void;
};
