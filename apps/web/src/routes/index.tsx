import CenteredContainer from "@/components/centered-container";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

const status = [
  { label: "A fazer", value: "TODO" },
  { label: "Em progresso", value: "IN_PROGRESS" },
  { label: "Review", value: "REVIEW" },
  { label: "Feito", value: "DONE" },
];

const priorities = [
  { label: "Baixa", value: "LOW" },
  { label: "Média", value: "MEDIUM" },
  { label: "Alta", value: "HIGH" },
  { label: "Urgente", value: "URGENT" },
];

function RouteComponent() {
  const { user } = useAuth();
  return (
    <Layout>
      <CenteredContainer className="text-input">
        <div className="flex flex-col">
          <p className="text-center mt-10 text-input/60">
            Você ainda não possui nenhuma tarefa criada.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-foreground cursor-pointer hover:bg-accent/70 mt-4 mx-auto"
              >
                Criar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#2a2a2a]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-input text-2xl">
                  Nova tarefa
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div>
                <Label htmlFor="title" className="text-input mb-2">
                  Título
                </Label>
                <Input
                  className="text-input bg-primary border-none focus:ring-input/40"
                  name="title"
                />
                <Label htmlFor="description" className="text-input mt-5 mb-2">
                  Descrição
                </Label>
                <Textarea
                  name="description"
                  className="text-input bg-primary border-none focus:ring-input/40"
                />
                <div className="flex gap-3 mt-5">
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="bg-primary border-none text-primary-foreground cursor-pointer w-full">
                        <SelectValue placeholder="Selecionar status" />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-muted-foreground rounded"
                        position="popper"
                        sideOffset={5}
                      >
                        <SelectGroup>
                          <SelectLabel className="text-primary">
                            Status
                          </SelectLabel>
                          {status.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="bg-primary border-none text-primary-foreground cursor-pointer w-full">
                        <SelectValue placeholder="Selecionar prioridade" />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-muted-foreground rounded"
                        position="popper"
                        sideOffset={5}
                      >
                        <SelectGroup>
                          <SelectLabel className="text-primary">
                            Prioridade
                          </SelectLabel>
                          {priorities.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction className="cursor-pointer">
                  Criar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CenteredContainer>
    </Layout>
  );
}
