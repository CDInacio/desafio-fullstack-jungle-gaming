import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { Clipboard, ExternalLink } from "lucide-react";
import type { ITask } from "@/types/task";
import { Link } from "@tanstack/react-router";

interface TaskTableProps {
  tasks: ITask[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  return (
    <div className="space-y-4">
      {/* Header da tabela com ícone */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center">
          <Clipboard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white"> Tarefas</h2>
          <p className="text-sm text-zinc-500">
            {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}{" "}
            encontrada(s)
          </p>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-semibold">
                Título
              </TableHead>
              <TableHead className="text-zinc-400 font-semibold">
                Descrição
              </TableHead>
              <TableHead className="text-zinc-400 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-zinc-400 font-semibold">
                Prioridade
              </TableHead>
              <TableHead className="text-zinc-400 font-semibold">
                Prazo
              </TableHead>
              <TableHead className="text-zinc-400 font-semibold">
                Criado por
              </TableHead>
              <TableHead className="text-zinc-400 font-semibold text-center">
                Atribuídos
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <Clipboard className="w-6 h-6 text-zinc-600" />
                    </div>
                    <p className="text-zinc-500">Nenhuma tarefa encontrada</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  {/* Título */}
                  <TableCell className="font-medium text-white">
                    <Link
                      to={`/task/${task.id}`}
                      className="hover:text-sky-600 transition-colors flex items-center gap-2 group"
                    >
                      {task.title}
                    </Link>
                  </TableCell>

                  {/* Descrição */}
                  <TableCell className="text-zinc-400 max-w-[250px]">
                    <div className="truncate">
                      {task.description || (
                        <span className="text-zinc-600 italic">
                          Sem descrição
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>

                  {/* Prioridade */}
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>

                  {/* Prazo */}
                  <TableCell className="text-zinc-400">
                    {task.deadline ? (
                      <span>
                        {new Date(task.deadline).toLocaleDateString("pt-BR")}
                      </span>
                    ) : (
                      <span className="text-zinc-600 italic">Sem prazo</span>
                    )}
                  </TableCell>

                  {/* Criado por */}
                  <TableCell className="text-zinc-400">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-sky-600 flex items-center justify-center text-xs text-white font-semibold">
                        {task.creator?.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span className="truncate max-w-[120px]">
                        {task.creator?.username || "Desconhecido"}
                      </span>
                    </div>
                  </TableCell>

                  {/* N. de atribuídos */}
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-600/20 text-sky-600 text-sm font-semibold">
                      {task.assignments?.length || 0}
                    </div>
                  </TableCell>

                  {/* Ação */}
                  <TableCell>
                    <Link
                      to={`/task/${task.id}`}
                      className="text-sky-600 hover:text-sky-500 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        {tasks.length > 0 && (
          <div className="border-t border-zinc-800 bg-zinc-900/50 px-6 py-3">
            <p className="text-sm text-zinc-500">
              Mostrando {tasks.length} de {tasks.length}{" "}
              {tasks.length === 1 ? "tarefa" : "tarefas"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
