import { userService } from "@/services/user-service";
import type { IAuthResponse, ILogin, IRegister, IUser } from "@/types/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation<IAuthResponse, Error, ILogin>({
    mutationFn: userService.login,
    onError: (error) => {
      toast.error("Erro ao fazer login", { description: error.message });
    },
    onSuccess: (data) => {
      login(data.data.token, data.data.user);

      toast.success("Login realizado com sucesso!", {
        description: "Você será redirecionado para a página inicial.",
      });

      setTimeout(() => {
        navigate({ to: "/home" as any });
      }, 100);
    },
  });
}

export function useRegister() {
  return useMutation<IAuthResponse, Error, IRegister>({
    mutationFn: userService.register,
    onError: (error) => {
      toast.error("Erro ao registrar usuário", { description: error.message });
    },
    onSuccess: () => {
      toast.success("Usuário registrado com sucesso", {
        description: "Você já pode fazer login agora.",
      });
    },
  });
}

export function useProfile(id: string) {
  return useQuery<IUser>({
    queryKey: ["user-profile", id],
    queryFn: () => userService.getUser(id),
  });
}
