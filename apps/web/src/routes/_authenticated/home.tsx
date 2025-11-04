import Layout from "@/components/layout";
import CenteredContainer from "@/components/centered-container";
import { useGetTasks, useCreateTask } from "@/hooks/use-tasks.hook";
import { useUsers } from "@/hooks/use-users.hook";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskTable } from "@/components/tasks/task-table";
import type { CreateTask } from "@/types/task";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TaskTableSkeleton } from "@/components/ui/task-table-skeleton";
import { getPageNumbers } from "@/utils/get-page-numbers";

type HomeSearch = {
  page?: number;
  size?: number;
};

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
  // definindo os parâmetros que serão aceitos na rota
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const size = Number(search?.size) || 5;
    return {
      page: Number(search?.page) || 1,
      size: size > 0 && size <= 100 ? size : 5, // Valida entre 1 e 100
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
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Link
                    to="/home"
                    search={{ page: currentPage - 1, size: itemsPerPage }}
                    disabled={!pagination.hasPreviousPage}
                    onClick={(e) => {
                      if (!pagination.hasPreviousPage) e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <PaginationPrevious
                      className={
                        !pagination.hasPreviousPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </Link>
                </PaginationItem>

                {getPageNumbers(pagination, currentPage).map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <Link
                        to="/home"
                        search={{ page: page as number, size: itemsPerPage }}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
                          currentPage === page
                            ? "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        } h-9 w-9 cursor-pointer`}
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      >
                        {page}
                      </Link>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <Link
                    to="/home"
                    search={{ page: currentPage + 1, size: itemsPerPage }}
                    disabled={!pagination.hasNextPage}
                    onClick={(e) => {
                      if (!pagination.hasNextPage) e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <PaginationNext
                      className={
                        !pagination.hasNextPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </Link>
                </PaginationItem>
              </PaginationContent>
            </Pagination>

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
