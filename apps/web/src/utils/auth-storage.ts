export const AuthStorage = {
  getToken: () => localStorage.getItem("token"),

  getRefreshToken: () => localStorage.getItem("refreshToken"),

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  setTokens: (token: string, refreshToken: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  },

  setUser: (user: any) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  clearTokens: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
};
