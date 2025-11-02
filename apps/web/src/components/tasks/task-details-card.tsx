import React, { useState, useEffect } from "react";
import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge } from "@/components/priority-badge";
import { Badge } from "@/components/ui/badge";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { AssignedUser, ITask } from "@/types/task";
import type { TaskStatusKey } from "@/types/status-info";
import { ptBR } from "date-fns/locale";
import { AssignedUserInput } from "./assigned-user-input";
import { useUsers } from "@/hooks/use-users.hook";
import type { IUser } from "@/types/auth";

interface TaskDetailsCardProps {
  task: ITask;
  isEditMode?: boolean;
  onSetEditMode?: (value: boolean) => void;
  onSave?: (updatedTask: Partial<ITask>) => Promise<void> | void;
  statusConfig: Record<
    TaskStatusKey,
    {
      label: string;
      color: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  >;
}

interface EditableTaskFields {
  title: string;
  description: string;
  priority: string;
  status: TaskStatusKey;
  deadline: string;
  assignedUsers: IUser[];
}

export function TaskDetailsCard({
  task,
  isEditMode = false,
  statusConfig,
  onSetEditMode,
  onSave,
}: TaskDetailsCardProps) {
  const { data: users } = useUsers();

  const StatusIcon = statusConfig[task.status]?.icon;
  const statusInfo = statusConfig[task.status] || statusConfig.TODO;

  const [editedTask, setEditedTask] = useState<EditableTaskFields>({
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    status: task.status,
    deadline: task.deadline
      ? new Date(task.deadline).toISOString().split("T")[0]
      : "",
    assignedUsers: (task.assignedUsers || []).map((u) => ({
      id: u.id,
      username: (u as any).username ?? "",
      email: (u as any).email ?? "",
    })),
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setEditedTask({
        title: task.title,
        description: task.description ?? "",
        priority: task.priority,
        status: task.status,
        deadline: task.deadline
          ? new Date(task.deadline).toISOString().split("T")[0]
          : "",
        assignedUsers: (task.assignedUsers || []).map((u) => ({
          id: u.id,
          username: (u as any).username ?? "",
          email: (u as any).email ?? "",
        })),
      });
    }
  }, [isEditMode, task]);

  const handleChange = (field: keyof EditableTaskFields, value: string) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  // faz o diferencial entre o task original e o editado
  const getChangedFields = (): Partial<ITask> => {
    const changed: Partial<ITask> = {};

    if (editedTask.title !== task.title)
      changed.title = editedTask.title.trim();
    if (editedTask.description !== (task.description ?? ""))
      changed.description = editedTask.description.trim();
    if (editedTask.priority !== task.priority)
      changed.priority = editedTask.priority as any;
    if (editedTask.status !== task.status) changed.status = editedTask.status;
    if (
      editedTask.deadline !==
      (task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "")
    ) {
      changed.deadline = editedTask.deadline
        ? new Date(editedTask.deadline).toISOString()
        : null;
    }

    const originalAssignedIds = ((task.assignedUsers as IUser[]) || []).map(
      (user) => user.id
    );
    const editedAssignedIds = editedTask.assignedUsers.map((user) => user.id);

    if (
      JSON.stringify(originalAssignedIds.sort()) !==
      JSON.stringify(editedAssignedIds.sort())
    ) {
      changed.assignedUsers = editedTask.assignedUsers.map((user) => ({
        id: user.id!,
        username: user.username,
        email: user.email,
      })) as AssignedUser[];
    }

    return changed;
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      // const updatedFields = {
      //   title: editedTask.title.trim(),
      //   description: editedTask.description.trim(),
      //   priority: editedTask.priority as any,
      //   status: editedTask.status,
      //   deadline: editedTask.deadline
      //     ? new Date(editedTask.deadline).toISOString()
      //     : null,
      //   assignedUsers: editedTask.assignedUsers.map((user) => ({
      //     id: user.id!,
      //     username: user.username,
      //     email: user.email,
      //   })) as AssignedUser[],
      // } as Partial<ITask>;
      const updatedFields = getChangedFields();

      onSave?.(updatedFields);
      onSetEditMode?.(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      // Aqui você pode adicionar um toast de erro
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reseta o formulário
    setEditedTask({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      status: task.status,
      deadline: task.deadline
        ? new Date(task.deadline).toISOString().split("T")[0]
        : "",
      assignedUsers: (task.assignedUsers || []).map((u) => ({
        id: u.id,
        username: (u as any).username ?? "",
        email: (u as any).email ?? "",
      })),
    });
    onSetEditMode?.(false);
  };

  const hasChanges = () => {
    const originalAssignedIds = ((task.assignedUsers as IUser[]) || [])
      .map((u) => u.id)
      .sort();
    const editedAssignedIds = editedTask.assignedUsers.map((u) => u.id).sort();

    return (
      editedTask.title !== task.title ||
      editedTask.description !== (task.description ?? "") ||
      editedTask.priority !== task.priority ||
      editedTask.status !== task.status ||
      editedTask.deadline !==
        (task.deadline
          ? new Date(task.deadline).toISOString().split("T")[0]
          : "") ||
      JSON.stringify(originalAssignedIds) !== JSON.stringify(editedAssignedIds)
    );
  };

  return (
    <>
      {/* CARD PRINCIPAL */}
      <Card className="bg-primary border-zinc-800">
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-3">
            <PriorityBadge priority={task.priority} />
            <Badge variant="outline" className={statusInfo.color}>
              <StatusIcon className="h-3 w-3 mr-1.5" />
              {statusInfo.label}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 text-white">Descrição</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {task.description || "Sem descrição"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-zinc-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white mb-0.5">Prazo</p>
                <p className="text-sm text-zinc-400">
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString("pt-BR")
                    : "Sem prazo definido"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-zinc-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white mb-0.5">
                  Criado por
                </p>
                <p className="text-sm text-zinc-400 font-mono">
                  {task.creator?.username}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-zinc-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white mb-0.5">
                  Última atualização
                </p>
                <p className="text-sm text-zinc-400">
                  {new Date(task.updatedAt).toLocaleDateString("pt-BR")} às{" "}
                  {new Date(task.updatedAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={isEditMode}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <DialogContent className="sm:max-w-[600px] bg-primary border-zinc-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Editar tarefa</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Título <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                value={editedTask.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={"bg-foreground border-zinc-500 text-input"}
                placeholder="Digite o título da tarefa"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={editedTask.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={`min-h-[120px]  text-input bg-foreground border-zinc-500 `}
                placeholder="Descreva a tarefa em detalhes..."
              />

              <p className="text-xs text-zinc-500">
                {editedTask.description.length}/2000 caracteres
              </p>
            </div>

            {/* Prioridade e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-white">
                  Prioridade
                </Label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value) => handleChange("priority", value)}
                >
                  <SelectTrigger
                    id="priority"
                    className="bg-foreground text-input w-full"
                  >
                    <SelectValue className="text-input" />
                  </SelectTrigger>
                  <SelectContent className="bg-primary text-input border-zinc-500">
                    <SelectItem value="LOW">Baixa</SelectItem>
                    <SelectItem value="MEDIUM">Média</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-white">
                  Status
                </Label>
                <Select
                  value={editedTask.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger
                    id="status"
                    className="bg-foreground text-input w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-primary text-input border-zinc-500">
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Prazo */}
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-white">
                Prazo
              </Label>
              <ShadCalendar
                mode="single"
                locale={ptBR}
                onSelect={(date) =>
                  handleChange(
                    "deadline",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                selected={
                  editedTask.deadline
                    ? new Date(editedTask.deadline)
                    : undefined
                }
                className="rounded-lg border border-zinc-500 bg-foreground"
              />
              <p className="text-xs text-zinc-500">
                Deixe em branco para remover o prazo
              </p>
            </div>
            <AssignedUserInput
              users={users ?? []}
              assignedUsers={editedTask.assignedUsers}
              setAssignedUsers={(newUsers) => {
                setEditedTask((prev) => ({
                  ...prev,
                  assignedUsers:
                    typeof newUsers === "function"
                      ? newUsers(prev.assignedUsers)
                      : newUsers,
                }));
              }}
            />
          </div>

          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges()}>
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
