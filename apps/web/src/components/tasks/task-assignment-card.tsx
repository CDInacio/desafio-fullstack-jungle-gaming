import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ITask } from "@/types/task";
import type { IUser } from "@/types/auth";
import { useUsers } from "@/hooks/use-users.hook";
import { AssignedUserInput } from "./assigned-user-input";
import { toast } from "sonner";
import { useUpdateTask } from "@/hooks/use-tasks.hook";
import { Users } from "lucide-react";

interface TaskAssignmentsCardProps {
  task: ITask;
}

export function TaskAssignmentsCard({ task }: TaskAssignmentsCardProps) {
  const [open, setOpen] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<IUser[]>([]);
  const { data: users } = useUsers();
  const { mutate: updateTask, isPending } = useUpdateTask();

  const handleAssignUsers = async () => {
    if (assignedUsers.length === 0) {
      toast.error("Selecione pelo menos um usuário");
      return;
    }

    try {
      // Combina usuários já atribuídos com os novos
      const currentAssignedUserIds =
        task.assignments?.map((a) => a.userId) || [];
      const newUserIds = assignedUsers.map((u) => u.id!);

      // Remove duplicatas
      const uniqueUserIds = Array.from(
        new Set([...currentAssignedUserIds, ...newUserIds])
      );

      // Busca os dados completos de todos os usuários
      const allAssignedUsers =
        users?.filter((u) => uniqueUserIds.includes(u.id!)) || [];

      // Atualiza a task com todos os usuários (anteriores + novos)
      updateTask({
        id: task.id,
        assignedUsers: allAssignedUsers.map((user) => ({
          id: user.id!,
          username: user.username,
          email: user.email,
        })),
      });

      toast.success(
        `${assignedUsers.length} pessoa(s) atribuída(s) com sucesso!`
      );

      setOpen(false);
      setAssignedUsers([]);
    } catch (err) {
      console.error("Erro ao atribuir usuários:", err);
      toast.error("Erro ao atribuir pessoas");
    }
  };

  const handleRemoveAssignment = async (userId: string) => {
    try {
      // Filtra o usuário a ser removido
      const updatedAssignedUsers =
        task.assignments
          ?.filter((a) => a.userId !== userId)
          .map((a) => ({
            id: a.userId,
            username: a.user?.username || "",
            email: a.user?.email || "",
          })) || [];

      // Atualiza a task removendo o usuário
      updateTask({
        id: task.id,
        assignedUsers: updatedAssignedUsers,
      });

      toast.success("Atribuição removida com sucesso!");
    } catch (err) {
      console.error("Erro ao remover atribuição:", err);
      toast.error("Erro ao remover atribuição");
    }
  };

  return (
    <Card className="bg-primary border-zinc-800">
      <CardHeader>
        <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <CardTitle className="text-white">Pessoas Atribuídas</CardTitle>
        <CardDescription className="text-zinc-400">
          Membros da equipe trabalhando nesta tarefa
        </CardDescription>
        <CardAction>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-200 hover:text-white cursor-pointer"
              >
                Adicionar
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[525px] bg-[#2a2a2a] border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-input text-xl">
                  Adicionar Pessoas
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Selecione os usuários para atribuir à tarefa.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <AssignedUserInput
                  users={users || []}
                  assignedUsers={assignedUsers}
                  setAssignedUsers={setAssignedUsers}
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-200"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleAssignUsers}
                  disabled={isPending || assignedUsers.length === 0}
                  className="bg-sky-600 hover:bg-sky-700 text-white"
                >
                  {isPending ? "Atribuindo..." : "Atribuir"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        {task.assignments && task.assignments.length > 0 ? (
          <div className="space-y-3">
            {task.assignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-medium flex-shrink-0">
                    {a.user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {a.user?.username || "Usuário desconhecido"}
                    </p>
                    <p className="text-sm text-zinc-400 truncate">
                      {a.user?.email || "Email não disponível"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => a.userId && handleRemoveAssignment(a.userId)}
                  disabled={isPending}
                  className="text-zinc-400 hover:text-red-400 hover:bg-red-950/30 h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-4 p-2">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-medium">
              U
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Nenhuma atribuição ainda
              </p>
              <p className="text-sm text-zinc-400">
                Atribua pessoas para começar a colaboração
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
