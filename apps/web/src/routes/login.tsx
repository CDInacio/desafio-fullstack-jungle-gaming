import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ILogin } from "@/types/auth";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useLogin } from "@/hooks/use-users.hook";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const { mutate: login } = useLogin();
  const navigate = useNavigate();

  const form = useForm<ILogin>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: ILogin) {
    login(data, {
      onSuccess: () => {
        navigate({ to: "/home" as any });
      },
    });
    // toast.success("Login realizado com sucesso!", {
    //   description: "Voce será redicionado para a página inicial.",
    // });
    // console.log(data);
  }

  return (
    <main className="flex items-center justify-center w-shcree h-screen">
      <Card className="w-full max-w-sm bg-foreground/50 border-none text-primary-foreground shadow-lg">
        <CardHeader>
          <CardTitle>Entre na sua conta</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <div>
                        <Label htmlFor="email" className="mb-2">
                          Email
                        </Label>
                        <Input id="email" type="email" required {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <div>
                        <Label htmlFor="email" className="mb-2">
                          Senha
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-4 bg-white text-foreground hover:bg-white/90 cursor-pointer"
              >
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="text-sm">
            Não possui uma conta?{" "}
            <Link
              to="/register"
              className="text-sm underline-offset-4 hover:underline"
            >
              Registre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
