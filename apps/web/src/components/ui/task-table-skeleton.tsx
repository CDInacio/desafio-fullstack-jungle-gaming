// src/components/tasks/task-table-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Clipboard } from "lucide-react";

export function TaskTableSkeleton() {
  // Número de linhas falsas que vão aparecer
  const rows = Array.from({ length: 5 });

  return (
    <div className="space-y-4">
      {/* Header da tabela com ícone */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-sky-600 flex items-center justify-center">
          <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Versão desktop */}
      <div className="hidden lg:block rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="divide-y divide-zinc-800">
          {/* Cabeçalho fake */}
          <div className="grid grid-cols-8 gap-4 px-6 py-3 bg-zinc-900">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-6" />
          </div>

          {/* Linhas falsas */}
          {rows.map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-8 gap-4 px-6 py-4 border-t border-zinc-800"
            >
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Versão mobile */}
      <div className="lg:hidden space-y-3">
        {rows.map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3"
          >
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
