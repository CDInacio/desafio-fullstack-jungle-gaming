import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type IRegister } from "@/types/auth";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRegister } from "@/hooks/use-users.hook";

export const Route = createFileRoute("/register")({
  component: RegisterComponent,
});

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "O nome de usuário deve ter pelo menos 2 caracteres.",
    }),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    }),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem.",
      });
    }
  });

function RegisterComponent() {
  const { mutate: register, isSuccess } = useRegister();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: IRegister) {
    register(data);

    if (isSuccess) form.reset();
  }

  return (
    <main className="flex items-center justify-center w-shcree h-screen">
      <Card className="w-full max-w-sm bg-foreground/50 border-none text-primary-foreground shadow-lg">
        <CardHeader>
          <CardTitle>Cadastre-se</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <div>
                        <Label htmlFor="username" className="mb-2">
                          Nome de usuário
                        </Label>
                        <Input id="username" type="text" required {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormMessage />
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
                        <Label htmlFor="password" className="mb-2">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <div>
                        <Label htmlFor="confirmPassword" className="mb-2">
                          Confirmar senha
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          required
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-4 bg-[#008eff] hover:bg-[#009dff] text-foreground cursor-pointer"
              >
                Cadastrar
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="text-sm">
            Já possui uma conta?{" "}
            <Link
              to="/login"
              className="text-sm underline-offset-4 hover:underline"
            >
              Entre aqui
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
