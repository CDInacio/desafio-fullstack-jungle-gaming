import React, { useState } from "react";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { IUser } from "@/types/auth";
import type { CreateTask, TaskPriority, TaskStatus } from "@/types/task";
import { AssignedUserInput } from "./assigned-user-input";
import { SelectLabel } from "@radix-ui/react-select";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("LOW");
  const [assignedUsers, setAssignedUsers] = useState<IUser[]>([]);

  const handleSubmit = () => {
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
      createdBy: "",
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Nova Tarefa</Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#2a2a2a]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-input text-2xl">
            Nova tarefa
          </AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos abaixo.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <Label htmlFor="title" className="text-input mb-2">
            Título
          </Label>
          <Input
            className="text-input bg-primary border-none focus:ring-input/40"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Label htmlFor="description" className="text-input mt-5 mb-2">
            Descrição
          </Label>
          <Textarea
            className="text-input bg-primary border-none focus:ring-input/40"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-3 mt-4">
            <Select onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger className="bg-primary border-none text-primary-foreground cursor-pointer w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-primary text-primary-foreground border-none shadow-lg rounded-lg">
                <SelectGroup>
                  <SelectLabel className="text-input/80 px-2">
                    Status
                  </SelectLabel>
                  {statusList.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select onValueChange={(v) => setPriority(v as TaskPriority)}>
              <SelectTrigger className="bg-primary border-none text-primary-foreground cursor-pointer w-full">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent className="bg-primary text-primary-foreground border-none shadow-lg rounded-lg">
                <SelectGroup>
                  <SelectLabel className="text-input/80 px-2">
                    Prioridade
                  </SelectLabel>
                  {prioritiesList.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <AssignedUserInput
            users={users}
            assignedUsers={assignedUsers}
            setAssignedUsers={setAssignedUsers}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Criar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
