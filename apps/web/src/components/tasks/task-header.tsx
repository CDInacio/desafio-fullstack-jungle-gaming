import { Calendar, Edit, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTaskEdit } from "@/context/task-edit-context";
import { Skeleton } from "../ui/skeleton";
import { useDeleteTask } from "@/hooks/use-tasks.hook";
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

export function TaskHeader() {
  const { currentTask, toggleEditMode } = useTaskEdit();
  const { mutate: deleteTask } = useDeleteTask();

  const handleDeleteTask = () => {
    if (!currentTask) return;
    deleteTask(currentTask.id);
  };

  if (!currentTask) {
    return (
      <Skeleton className="h-16 bg-zinc-800/50 rounded-lg animate-pulse w-full" />
    );
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        {/* Ícone azul da task */}
        <div className="w-12 h-12 rounded-lg bg-sky-600 flex items-center justify-center shrink-0">
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
          className="bg-transparent cursor-pointer border-zinc-700 hover:bg-sky-600/10 hover:text-sky-600 hover:border-sky-600/50 text-zinc-400 transition-colors"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent cursor-pointer border-zinc-700 hover:bg-red-600/30 hover:text-red-500 hover:border-red-500/50 text-zinc-400 transition-colors focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Tem certeza que deseja excluir esta tarefa?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A tarefa será removida
                permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-zinc-500 cursor-pointer px-3 py-1.5 rounded-md transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTask}
                className="bg-red-600 cursor-pointer text-white px-3 py-1.5 rounded-md transition-colors duration-150 hover:bg-red-700 active:bg-red-800 focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50 disabled:pointer-events-none dark:bg-red-500 dark:hover:bg-red-600"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
