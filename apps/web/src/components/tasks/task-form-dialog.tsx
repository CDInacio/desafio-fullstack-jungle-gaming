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
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Flag, Users } from "lucide-react";
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-white text-xl">
                  Nova tarefa
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-sm mt-1">
                  Preencha os campos abaixo para criar uma nova tarefa
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-6">
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
                className="text-white bg-zinc-800 border-zinc-700 focus:border-blue-600 focus:ring-blue-600/20"
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
                className="text-white bg-zinc-800 border-zinc-700 focus:border-blue-600 focus:ring-blue-600/20 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os detalhes da tarefa..."
                rows={4}
              />
            </div>

            {/* Prioridade e Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium flex items-center gap-2">
                  Prioridade
                </Label>
                <Select
                  onValueChange={(v) => setPriority(v as TaskPriority)}
                  defaultValue="LOW"
                >
                  <SelectTrigger className="bg-zinc-800 w-full border-zinc-700 text-white focus:border-blue-600 focus:ring-blue-600/20">
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
                  <SelectTrigger className="bg-zinc-800 w-full border-zinc-700 text-white focus:border-blue-600 focus:ring-blue-600/20">
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

          <DialogFooter className="mt-6 gap-2 sm:gap-0 pt-4 border-t border-zinc-800">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-transparent mr-3 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              disabled={!user?.id || !title.trim()}
            >
              <Plus className="w-4 h-4 " />
              Criar Tarefa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
