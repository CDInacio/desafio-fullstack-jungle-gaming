import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { IUser } from "@/types/auth";
import type { CreateTask, TaskPriority, TaskStatus } from "@/types/task";
import { AssignedUserInput } from "./assigned-user-input";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

interface TaskFormDialogProps {
  users: IUser[];
  onSubmit: (data: CreateTask) => void;
}

const statusList = [
  { label: "A fazer", value: "TODO" },
  { label: "Em progresso", value: "IN_PROGRESS" },
  { label: "Review", value: "REVIEW" },
  { label: "Feito", value: "DONE" },
];

const prioritiesList = [
  { label: "Baixa", value: "LOW" },
  { label: "Média", value: "MEDIUM" },
  { label: "Alta", value: "HIGH" },
  { label: "Urgente", value: "URGENT" },
];

export function TaskFormDialog({ users, onSubmit }: TaskFormDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("LOW");
  const [assignedUsers, setAssignedUsers] = useState<IUser[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Você precisa estar logado para criar uma tarefa.");
      return;
    }

    onSubmit({
      title,
      description,
      status,
      priority,
      assignedUsers: assignedUsers.map((u) => ({
        id: u.id!,
        username: u.username,
        email: u.email,
      })),
      createdBy: user.id,
    });

    setTitle("");
    setDescription("");
    setStatus("TODO");
    setPriority("LOW");
    setAssignedUsers([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sky-600 hover:bg-sky-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-[600px] w-[95vw] max-w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-sky-600 flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-white text-lg sm:text-xl">
                  Nova tarefa
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs sm:text-sm mt-1">
                  Preencha os campos abaixo para criar uma nova tarefa
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
            {/* Título */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-white text-sm font-medium flex items-center gap-2"
              >
                Título
              </Label>
              <Input
                id="title"
                className="text-white bg-zinc-800 border-zinc-700 focus:border-sky-600 focus:ring-sky-600/20"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Implementar nova funcionalidade"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-white text-sm font-medium"
              >
                Descrição
              </Label>
              <Textarea
                id="description"
                className="text-white bg-zinc-800 border-zinc-700 focus:border-sky-600 focus:ring-sky-600/20 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os detalhes da tarefa..."
                rows={4}
              />
            </div>

            {/* Prioridade e Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium flex items-center gap-2">
                  Prioridade
                </Label>
                <Select
                  onValueChange={(v) => setPriority(v as TaskPriority)}
                  defaultValue="LOW"
                >
                  <SelectTrigger className="bg-zinc-800 w-full border-zinc-700 text-white focus:border-sky-600 focus:ring-sky-600/20">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                    <SelectGroup>
                      {prioritiesList.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">Status</Label>
                <Select
                  onValueChange={(v) => setStatus(v as TaskStatus)}
                  defaultValue="TODO"
                >
                  <SelectTrigger className="bg-zinc-800 w-full border-zinc-700 text-white focus:border-sky-600 focus:ring-sky-600/20">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                    <SelectGroup>
                      {statusList.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Atribuir usuários */}
            <div className="space-y-2">
              <AssignedUserInput
                users={users}
                assignedUsers={assignedUsers}
                setAssignedUsers={setAssignedUsers}
              />
            </div>
          </div>

          <DialogFooter className="mt-4 sm:mt-6 gap-2 flex-col sm:flex-row pt-4 border-t border-zinc-800">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-transparent w-full sm:w-auto sm:mr-3 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-50 w-full sm:w-auto"
              disabled={!user?.id || !title.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Criar Tarefa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
