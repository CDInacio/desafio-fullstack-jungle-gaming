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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ITask } from "@/types/task";
import { useUsers } from "@/hooks/use-users.hook";

interface TaskAssignmentsCardProps {
  task: ITask;
}

export function TaskAssignmentsCard({ task }: TaskAssignmentsCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: users } = useUsers();
  const [isLoading, setIsLoading] = useState(false);

  const handleAssignUser = async () => {
    if (!selectedUserId) return;

    setIsLoading(true);
    try {
      const user = users?.find((u) => u.id === selectedUserId);
      if (!user) return;

      // Aqui você chamaria a API real
      console.log("Atribuindo usuário:", { taskId: task.id, user });

      // Fechar modal e resetar
      setOpen(false);
      setSelectedUserId(null);

      // toast.success("Pessoa atribuída com sucesso!");
    } catch (err) {
      console.error("Erro ao atribuir usuário:", err);
      // toast.error("Erro ao atribuir pessoa");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-primary border-zinc-800">
      <CardHeader>
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

            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Adicionar Pessoa
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Selecione um usuário para atribuir à tarefa.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 py-4 max-h-64 overflow-y-auto">
                {users?.map((user) => (
                  <Button
                    key={user.id}
                    variant={selectedUserId === user.id ? "default" : "outline"}
                    className="w-full justify-start text-white border-zinc-700 hover:bg-zinc-800"
                    onClick={() => setSelectedUserId(user.id ?? null)}
                  >
                    {user.username} -{" "}
                    <span className="text-zinc-400">{user.email}</span>
                  </Button>
                ))}
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
                  onClick={handleAssignUser}
                  disabled={isLoading || !selectedUserId}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? "Atribuindo..." : "Atribuir"}
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
              <div key={a.id} className="flex items-start gap-4">
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
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-4">
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
