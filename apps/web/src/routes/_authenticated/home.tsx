// apps/web/src/routes/_authenticated/home.tsx
import Layout from "@/components/layout";
import CenteredContainer from "@/components/centered-container";
import { useGetTasks, useCreateTask } from "@/hooks/use-tasks.hook";
import { useUsers } from "@/hooks/use-users.hook";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskTable } from "@/components/tasks/task-table";
import type { CreateTask } from "@/types/task";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { TaskTableSkeleton } from "@/components/ui/task-table-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type HomeSearch = {
  page?: number;
  size?: number;
};

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const size = Number(search?.size) || 5;
    return {
      page: Number(search?.page) || 1,
      size: size > 0 && size <= 100 ? size : 5,
    };
  },
});

function RouteComponent() {
  const { page, size } = useSearch({ from: "/_authenticated/home" });
  const currentPage = page || 1;
  const itemsPerPage = size || 5;

  const { data: taskData, isLoading } = useGetTasks(currentPage, itemsPerPage);
  const { data: users } = useUsers();
  const { mutate: createTask } = useCreateTask();

  const handleCreateTask = (data: CreateTask) => {
    createTask(data);
  };

  const pagination = taskData?.pagination;
  const tasks = taskData?.tasks || [];

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");

  // Aplica filtros
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchStatus =
        statusFilter === "all" ? true : task.status === statusFilter;
      const matchPriority =
        priorityFilter === "all" ? true : task.priority === priorityFilter;
      const matchAssigned =
        assignedFilter === "all"
          ? true
          : task.assignments?.some((a) => a.userId === assignedFilter);
      return matchStatus && matchPriority && matchAssigned;
    });
  }, [tasks, statusFilter, priorityFilter, assignedFilter]);

  return (
    <Layout>
      <CenteredContainer className="px-0 sm:px-0 md:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 sm:mt-6 gap-3 mb-6">
          <TaskFormDialog users={users ?? []} onSubmit={handleCreateTask} />

          <div className="flex flex-col sm:flex-row gap-2">
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="TODO">Todo</SelectItem>
                <SelectItem value="IN_PROGRESS">Em progresso</SelectItem>
                <SelectItem value="DONE">Concluído</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setPriorityFilter} value={priorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="LOW">Baixa</SelectItem>
                <SelectItem value="MEDIUM">Média</SelectItem>
                <SelectItem value="HIGH">Alta</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setAssignedFilter} value={assignedFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id!}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <TaskTableSkeleton />
        ) : (
          <TaskTable tasks={filteredTasks} />
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 mb-6 flex flex-col items-center gap-3 text-sm text-zinc-400">
            <div className="flex items-center gap-3">
              {pagination.hasPreviousPage ? (
                <Link
                  to="/home"
                  search={{ page: currentPage - 1, size: itemsPerPage }}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "border-border bg-border text-white/70 hover:text-white"
                  )}
                >
                  <ChevronLeftIcon />
                </Link>
              ) : (
                <button
                  disabled
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "opacity-50 cursor-not-allowed border-border bg-border text-white/40"
                  )}
                >
                  <ChevronLeftIcon />
                </button>
              )}

              <span className="text-zinc-400">
                Página {currentPage} de {pagination.totalPages}
              </span>

              {pagination.hasNextPage ? (
                <Link
                  to="/home"
                  search={{ page: currentPage + 1, size: itemsPerPage }}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "border-border bg-border text-white/70 hover:text-white"
                  )}
                >
                  <ChevronRightIcon />
                </Link>
              ) : (
                <button
                  disabled
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "opacity-50 cursor-not-allowed border-border bg-border text-white/40"
                  )}
                >
                  <ChevronRightIcon />
                </button>
              )}
            </div>

            <div className="text-center text-xs text-zinc-500">
              Mostrando {tasks.length} de {pagination.totalItems}{" "}
              {pagination.totalItems === 1 ? "tarefa" : "tarefas"}
            </div>
          </div>
        )}
      </CenteredContainer>
    </Layout>
  );
}
