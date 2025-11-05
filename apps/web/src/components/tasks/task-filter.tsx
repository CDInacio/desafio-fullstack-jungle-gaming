// apps/web/src/components/tasks/task-filters.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Filter, X, Search } from "lucide-react";
import { useState } from "react";
import type { TaskStatus, TaskPriority } from "@/types/task";

export interface TaskFilters {
  search?: string;
  status?: TaskStatus | "ALL";
  priority?: TaskPriority | "ALL";
  assignedToMe?: boolean;
  createdByMe?: boolean;
}

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onClearFilters: () => void;
  currentUserId?: string;
}

export function TaskFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
  currentUserId,
}: TaskFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
  };

  const handleSearchSubmit = () => {
    onFiltersChange({ ...filters, search: localSearch });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "ALL" && value !== ""
  );

  return (
    <div className="space-y-4">
      {/* Barra de busca e toggle de filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Campo de busca */}
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Buscar por título ou descrição..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>
          <Button
            onClick={handleSearchSubmit}
            className="bg-sky-600 hover:bg-sky-700 text-white shrink-0"
          >
            Buscar
          </Button>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`${
              showFilters || hasActiveFilters
                ? "bg-sky-600/20 border-sky-600 text-sky-600"
                : "bg-transparent border-zinc-700 text-zinc-400"
            } hover:bg-sky-600/30 hover:border-sky-600 hover:text-sky-600 transition-colors`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-sky-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {Object.values(filters).filter((v) => v && v !== "ALL").length}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="bg-transparent border-zinc-700 text-zinc-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-500"
            >
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Painel de filtros expandido */}
      {showFilters && (
        <Card className="bg-zinc-800/50 border-zinc-700 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por Status */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-medium">Status</Label>
              <Select
                value={filters.status || "ALL"}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    status: value as TaskStatus | "ALL",
                  })
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="TODO">A fazer</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em progresso</SelectItem>
                  <SelectItem value="REVIEW">Em revisão</SelectItem>
                  <SelectItem value="DONE">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Prioridade */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-medium">
                Prioridade
              </Label>
              <Select
                value={filters.priority || "ALL"}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    priority: value as TaskPriority | "ALL",
                  })
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                  <SelectItem value="ALL">Todas</SelectItem>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Atribuição */}
            {currentUserId && (
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">
                  Atribuídas a mim
                </Label>
                <Select
                  value={filters.assignedToMe ? "YES" : "NO"}
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      assignedToMe: value === "YES",
                    })
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                    <SelectItem value="NO">Não</SelectItem>
                    <SelectItem value="YES">Sim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filtro por Criador */}
            {currentUserId && (
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">
                  Criadas por mim
                </Label>
                <Select
                  value={filters.createdByMe ? "YES" : "NO"}
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      createdByMe: value === "YES",
                    })
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                    <SelectItem value="NO">Não</SelectItem>
                    <SelectItem value="YES">Sim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Resumo dos filtros ativos */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-zinc-700">
              <div className="flex flex-wrap gap-2">
                <span className="text-zinc-400 text-sm">Filtros ativos:</span>
                {filters.search && (
                  <span className="bg-sky-600/20 text-sky-600 px-2 py-1 rounded text-xs">
                    Busca: "{filters.search}"
                  </span>
                )}
                {filters.status && filters.status !== "ALL" && (
                  <span className="bg-sky-600/20 text-sky-600 px-2 py-1 rounded text-xs">
                    Status: {filters.status}
                  </span>
                )}
                {filters.priority && filters.priority !== "ALL" && (
                  <span className="bg-sky-600/20 text-sky-600 px-2 py-1 rounded text-xs">
                    Prioridade: {filters.priority}
                  </span>
                )}
                {filters.assignedToMe && (
                  <span className="bg-sky-600/20 text-sky-600 px-2 py-1 rounded text-xs">
                    Atribuídas a mim
                  </span>
                )}
                {filters.createdByMe && (
                  <span className="bg-sky-600/20 text-sky-600 px-2 py-1 rounded text-xs">
                    Criadas por mim
                  </span>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
