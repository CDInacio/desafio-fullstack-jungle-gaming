import React, { useState, useEffect } from "react";
import { Calendar, Clock, Edit, FileText, Flag, User } from "lucide-react";
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
import type { ITask } from "@/types/task";
import type { TaskStatusKey } from "@/types/status-info";
import { ptBR } from "date-fns/locale";

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
}

export function TaskDetailsCard({
  task,
  isEditMode = false,
  statusConfig,
  onSetEditMode,
  onSave,
}: TaskDetailsCardProps) {
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
      });
    }
  }, [isEditMode, task]);

  const handleChange = (field: keyof EditableTaskFields, value: string) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  // compara apenas os campos relevantes
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

    return changed;
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      const updatedFields = getChangedFields();
      onSave?.(updatedFields);
      onSetEditMode?.(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedTask({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      status: task.status,
      deadline: task.deadline
        ? new Date(task.deadline).toISOString().split("T")[0]
        : "",
    });
    onSetEditMode?.(false);
  };

  const hasChanges = () => {
    return (
      editedTask.title !== task.title ||
      editedTask.description !== (task.description ?? "") ||
      editedTask.priority !== task.priority ||
      editedTask.status !== task.status ||
      editedTask.deadline !==
        (task.deadline
          ? new Date(task.deadline).toISOString().split("T")[0]
          : "")
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
        <DialogContent className="sm:max-w-[650px] bg-zinc-900 border-zinc-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center">
                <Edit className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-white text-xl">
                  Editar tarefa
                </DialogTitle>
                <p className="text-zinc-500 text-sm mt-1">
                  Atualize as informações da tarefa
                </p>
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
                value={editedTask.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white focus:border-sky-600 focus:ring-sky-600/20"
                placeholder="Digite o título da tarefa"
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
                value={editedTask.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="min-h-[120px] text-white bg-zinc-800 border-zinc-700 focus:border-sky-600 focus:ring-sky-600/20 resize-none"
                placeholder="Descreva a tarefa em detalhes..."
              />
              <p className="text-xs text-zinc-500">
                {editedTask.description.length}/2000 caracteres
              </p>
            </div>

            {/* Prioridade e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="priority"
                  className="text-white text-sm font-medium flex items-center gap-2"
                >
                  Prioridade
                </Label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value) => handleChange("priority", value)}
                >
                  <SelectTrigger
                    id="priority"
                    className="bg-zinc-800 w-full border-zinc-700 text-white focus:border-sky-600 focus:ring-sky-600/20"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                    <SelectItem value="LOW">Baixa</SelectItem>
                    <SelectItem value="MEDIUM">Média</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-white text-sm font-medium"
                >
                  Status
                </Label>
                <Select
                  value={editedTask.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger
                    id="status"
                    className="bg-zinc-800 w-full border-zinc-700 text-white focus:border-sky-600 focus:ring-sky-600/20"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 text-white border-zinc-700">
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
              <Label
                htmlFor="deadline"
                className="text-white text-sm font-medium flex items-center gap-2"
              >
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
                className="rounded-lg border border-zinc-700 bg-zinc-800 text-white"
              />
              <p className="text-xs text-zinc-500">
                Deixe em branco para remover o prazo
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2 sm:gap-0 pt-4 border-t border-zinc-800">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="bg-transparent mr-3 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges() || isSaving}
              className="bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
