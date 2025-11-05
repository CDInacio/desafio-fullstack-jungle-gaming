import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ILogin } from "@/types/auth";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLogin } from "@/hooks/use-users.hook";
import * as z from "zod";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/home",
      });
    }
  },
  component: LoginComponent,
});

const formSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
});

type FormData = z.infer<typeof formSchema>;

function LoginComponent() {
  const { mutate: login } = useLogin();

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // General001!
  const onSubmit: SubmitHandler<FormData> = async (data: ILogin) => {
    login(data);
  };

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
                data-slot="button"
                type="submit"
                className="w-full mt-4 bg-[#008eff] hover:bg-[#009dff] text-foreground  cursor-pointer"
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
