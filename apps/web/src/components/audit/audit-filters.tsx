import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { AuditAction } from "@/types/audit";

interface AuditFiltersProps {
  action: string;
  entityType: string;
  onActionChange: (value: string) => void;
  onEntityTypeChange: (value: string) => void;
  onClear: () => void;
}

export function AuditFilters({
  action,
  entityType,
  onActionChange,
  onEntityTypeChange,
  onClear,
}: AuditFiltersProps) {
  const hasFilters = action !== "all" || entityType !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="w-full sm:w-48">
        <Select value={action} onValueChange={onActionChange}>
          <SelectTrigger className="bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Todas as ações" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as ações</SelectItem>
            <SelectItem value={AuditAction.CREATE}>Criação</SelectItem>
            <SelectItem value={AuditAction.UPDATE}>Atualização</SelectItem>
            <SelectItem value={AuditAction.DELETE}>Exclusão</SelectItem>
            <SelectItem value={AuditAction.ASSIGN}>Atribuição</SelectItem>
            <SelectItem value={AuditAction.COMMENT}>Comentário</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-48">
        <Select value={entityType} onValueChange={onEntityTypeChange}>
          <SelectTrigger className="bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="task">Tarefas</SelectItem>
            <SelectItem value="user">Usuários</SelectItem>
            <SelectItem value="comment">Comentários</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Botão Limpar Filtros */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4 mr-2" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
