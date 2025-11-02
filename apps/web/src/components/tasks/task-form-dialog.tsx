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
        <Button>Nova Tarefa</Button>
      </DialogTrigger>

      <DialogContent className="bg-primary z-50 border-zinc-600 sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-input text-2xl">
              Nova tarefa
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Preencha os campos abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-input">
                Título
              </Label>
              <Input
                id="title"
                className="text-input bg-foreground border-zinc-600 focus:ring-input/40"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-input">
                Descrição
              </Label>
              <Textarea
                id="description"
                className="text-input bg-foreground border-zinc-600  focus:ring-input/40"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-input">Status</Label>
                <Select
                  onValueChange={(v) => setStatus(v as TaskStatus)}
                  defaultValue="TODO"
                >
                  <SelectTrigger className=" text-primary-foreground cursor-pointer bg-foreground ">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-primary text-primary-foreground shadow-lg rounded-lg">
                    <SelectGroup className="border-zinc-500 ">
                      <SelectLabel className="text-input/80 px-2">
                        Status
                      </SelectLabel>
                      {statusList.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-input">Prioridade</Label>
                <Select
                  onValueChange={(v) => setPriority(v as TaskPriority)}
                  defaultValue="LOW"
                >
                  <SelectTrigger className="bg-primary border-none text-primary-foreground cursor-pointer">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent className="bg-primary text-primary-foreground border-none shadow-lg rounded-lg">
                    <SelectGroup>
                      <SelectLabel className="text-input/80 px-2">
                        Prioridade
                      </SelectLabel>
                      {prioritiesList.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <AssignedUserInput
                users={users}
                assignedUsers={assignedUsers}
                setAssignedUsers={setAssignedUsers}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-200"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!user?.id}
            >
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
