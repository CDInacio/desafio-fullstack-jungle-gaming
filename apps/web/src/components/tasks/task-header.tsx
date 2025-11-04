import { Calendar, Edit, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTaskEdit } from "@/context/task-edit-context";

export function TaskHeader() {
  const { currentTask, toggleEditMode } = useTaskEdit();

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        {/* Ícone azul da task */}
        <div className="w-12 h-12 rounded-lg bg-sky-600 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {currentTask!.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Calendar className="h-4 w-4" />
            <span>
              Criada em{" "}
              {new Date(currentTask!.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={toggleEditMode}
          variant="outline"
          size="sm"
          className="bg-transparent border-zinc-700 hover:bg-sky-600/10 hover:text-sky-600 hover:border-sky-600/50 text-zinc-400 transition-colors"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-zinc-700 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 text-zinc-400 transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
