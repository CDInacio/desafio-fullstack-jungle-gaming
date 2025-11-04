import Layout from "@/components/layout";
import CenteredContainer from "@/components/centered-container";
import { useGetTasks, useCreateTask } from "@/hooks/use-tasks.hook";
import { useUsers } from "@/hooks/use-users.hook";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskTable } from "@/components/tasks/task-table";
import type { CreateTask } from "@/types/task";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
});

const ITEMS_PER_PAGE = 5; // Mudei de 10 para 5

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: tasksResponse } = useGetTasks(currentPage, ITEMS_PER_PAGE);
  const { data: users } = useUsers();
  const { mutate: createTask } = useCreateTask();

  const handleCreateTask = (data: CreateTask) => {
    createTask(data);
  };

  const pagination = tasksResponse?.pagination;
  const tasks = tasksResponse?.tasks || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Gera os números das páginas para exibir
  const getPageNumbers = () => {
    if (!pagination) return [];

    const pages = [];
    const totalPages = pagination.totalPages;
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <Layout>
      <CenteredContainer className="px-0 sm:px-0 md:px-0">
        <div className="flex flex-col sm:flex-row sm:justify-end mt-4 sm:mt-6 gap-3 mb-6">
          <TaskFormDialog users={users ?? []} onSubmit={handleCreateTask} />
        </div>

        {tasks && <TaskTable tasks={tasks} />}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 mb-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      pagination.hasPreviousPage &&
                      handlePageChange(currentPage - 1)
                    }
                    className={
                      !pagination.hasPreviousPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      pagination.hasNextPage &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      !pagination.hasNextPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            {/* Informações de paginação */}
            <div className="text-center mt-4 text-sm text-zinc-500">
              Mostrando {tasks.length} de {pagination.totalItems}{" "}
              {pagination.totalItems === 1 ? "tarefa" : "tarefas"}
              {" · "}
              Página {pagination.currentPage} de {pagination.totalPages}
            </div>
          </div>
        )}
      </CenteredContainer>
    </Layout>
  );
}
