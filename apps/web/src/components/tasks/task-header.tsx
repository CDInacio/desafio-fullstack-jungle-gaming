import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ITask } from "@/types/task";

interface TaskHeaderProps {
  task: ITask;
  onEditMode: (value: boolean) => void;
  isEditMode?: boolean;
}

export function TaskHeader({ task, onEditMode, isEditMode }: TaskHeaderProps) {
  const handleEditClick = () => {
    onEditMode(!isEditMode);
  };

  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {task.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Calendar className="h-4 w-4" />
          <span>
            Criada em{" "}
            {new Date(task.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleEditClick}
          variant="outline"
          size="sm"
          className="bg-transparent border-zinc-700 hover:bg-zinc-800 hover:text-input text-input cursor-pointer"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-red-400 hover:text-red-300 cursor-pointer"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
