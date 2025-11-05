// apps/web/src/routes/_authenticated/home.tsx - Versão Alternativa
import Layout from "@/components/layout";
import CenteredContainer from "@/components/centered-container";
import { useGetTasks, useCreateTask } from "@/hooks/use-tasks.hook";
import { useUsers } from "@/hooks/use-users.hook";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskTable } from "@/components/tasks/task-table";
import type { CreateTask } from "@/types/task";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { TaskTableSkeleton } from "@/components/ui/task-table-skeleton";
import { getPageNumbers } from "@/utils/get-page-numbers";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  return (
    <Layout>
      <CenteredContainer className="px-0 sm:px-0 md:px-0">
        <div className="flex flex-col sm:flex-row sm:justify-end mt-4 sm:mt-6 gap-3 mb-6">
          <TaskFormDialog users={users ?? []} onSubmit={handleCreateTask} />
        </div>

        {isLoading ? <TaskTableSkeleton /> : <TaskTable tasks={tasks} />}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 mb-6">
            <nav
              role="navigation"
              aria-label="pagination"
              className="mx-auto flex w-full justify-center"
            >
              <ul className="flex flex-row items-center gap-1">
                {/* Previous Button */}
                <li>
                  {pagination.hasPreviousPage ? (
                    <Link
                      to="/home"
                      search={{ page: currentPage - 1, size: itemsPerPage }}
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "default" }),
                        "gap-1 px-2.5 sm:pl-2.5"
                      )}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      <span className="hidden sm:block">Previous</span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "default" }),
                        "gap-1 px-2.5 sm:pl-2.5 pointer-events-none opacity-50 border-border bg-border text-white/65"
                      )}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      <span className="hidden sm:block ">Anterior</span>
                    </button>
                  )}
                </li>

                {getPageNumbers(pagination, currentPage).map((page, index) => (
                  <li key={index}>
                    {page === "ellipsis" ? (
                      <span className="flex  size-9 items-center justify-center">
                        <MoreHorizontalIcon className="size-4" />
                        <span className="sr-only">More pages</span>
                      </span>
                    ) : (
                      <Link
                        to="/home"
                        search={{ page: page as number, size: itemsPerPage }}
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className={cn(
                          "border-border bg-border text-white/65",
                          buttonVariants({
                            variant: currentPage === page ? "outline" : "ghost",
                            size: "icon",
                          })
                        )}
                      >
                        {page}
                      </Link>
                    )}
                  </li>
                ))}

                <li>
                  {pagination.hasNextPage ? (
                    <Link
                      to="/home"
                      search={{ page: currentPage + 1, size: itemsPerPage }}
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "default" }),
                        "gap-1 px-2.5 sm:pr-2.5 border-border bg-border text-white/65"
                      )}
                    >
                      <span className="hidden sm:block">Próximo</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "default" }),
                        "gap-1 px-2.5 sm:pr-2.5 pointer-events-none opacity-50"
                      )}
                    >
                      <span className="hidden sm:block">Next</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  )}
                </li>
              </ul>
            </nav>

            {/* Informações de paginação */}
            <div className="text-center mt-4 text-sm text-zinc-500">
              Mostrando {tasks.length} de {pagination.totalItems}{" "}
              {pagination.totalItems === 1 ? "tarefa" : "tarefas"}
            </div>
          </div>
        )}
      </CenteredContainer>
    </Layout>
  );
}
