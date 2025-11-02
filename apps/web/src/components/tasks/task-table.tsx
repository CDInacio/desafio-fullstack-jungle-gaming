// src/components/tasks/task-table.tsx
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
import type { ITask } from "@/types/task";
import { Link } from "@tanstack/react-router";

interface TaskTableProps {
  tasks: ITask[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  return (
    <Table className="bg-primary/40 backdrop-blur-md border border-border/20 rounded-xl overflow-hidden mt-8">
      <TableCaption className="text-input/60 py-3">
        Lista das suas tarefas recentes
      </TableCaption>

      <TableHeader className="bg-primary/60 border-b border-border/30">
        <TableRow>
          <TableHead className="text-input font-semibold">Título</TableHead>
          <TableHead className="text-input font-semibold">Descrição</TableHead>
          <TableHead className="text-input font-semibold">Status</TableHead>
          <TableHead className="text-right text-input font-semibold">
            Prioridade
          </TableHead>
          <TableHead className="text-right text-input font-semibold">
            Prazo
          </TableHead>
          <TableHead className="text-right text-input font-semibold">
            Criado por
          </TableHead>
          <TableHead className="text-right text-input font-semibold">
            N. att
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tasks.map((task) => (
          <TableRow
            key={task.id}
            className="hover:bg-accent/10 transition-colors border-b border-border/10"
          >
            <TableCell className="font-medium text-input/90 cursor-pointer">
              <Link to={`/task/${task.id}`}>{task.title}</Link>
            </TableCell>
            <TableCell className="text-input/70 truncate max-w-[250px]">
              {task.description}
            </TableCell>
            <TableCell>
              <StatusBadge status={task.status} />
            </TableCell>
            <TableCell className="text-right text-input/80">
              <PriorityBadge priority={task.priority} />
            </TableCell>
            <TableCell className="text-right text-input/60">
              {task.deadline ?? "Não definido"}
            </TableCell>
            <TableCell className="text-right text-input/70">
              {task.creator?.username}
            </TableCell>
            <TableCell className="text-right text-input/70">
              {task.assignments.length}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
