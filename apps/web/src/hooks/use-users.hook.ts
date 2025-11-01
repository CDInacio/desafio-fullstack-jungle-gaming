import { userService } from "@/services/user-service";
import type { IAuthResponse, ILogin, IRegister, IUser } from "@/types/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogin() {
  return useMutation<IAuthResponse, Error, ILogin>({
    mutationFn: userService.login,
    onError: (error) => {
      toast.error("Erro ao fazer login", { description: error.message });
    },
  });
}

export function useRegister() {
  return useMutation<IAuthResponse, Error, IRegister>({
    mutationFn: userService.register,
    onError: (error) => {
      toast.error("Erro ao registrar usuário", { description: error.message });
    },
  });
}

export function useProfile(id: string) {
  return useQuery<IUser>({
    queryKey: ["user-profile", id],
    queryFn: () => userService.getUser(id),
  });
}
