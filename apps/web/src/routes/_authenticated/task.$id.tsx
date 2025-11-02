import CenteredContainer from "@/components/centered-container";
import Layout from "@/components/layout";
import { useGetTask } from "@/hooks/use-tasks.hook";
import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import { PriorityBadge } from "@/components/priority-badge";

export const Route = createFileRoute("/_authenticated/task/$id")({
  component: RouteComponent,
});

const statusConfig = {
  TODO: {
    label: "A Fazer",
    color: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    icon: Circle,
  },
  IN_PROGRESS: {
    label: "Em Progresso",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Clock,
  },
  REVIEW: {
    label: "Em Revisão",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: AlertCircle,
  },
  DONE: {
    label: "Concluído",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle2,
  },
};

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data: task, isLoading } = useGetTask(id);
  console.log(task);
  if (isLoading) {
    return (
      <Layout>
        <CenteredContainer>
          <div className="flex items-center justify-center h-64">
            <p className="text-zinc-400">Carregando tarefa...</p>
          </div>
        </CenteredContainer>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <CenteredContainer>
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <AlertCircle className="h-12 w-12 text-zinc-500 mb-4" />
              <p className="text-zinc-400">Tarefa não encontrada</p>
            </CardContent>
          </Card>
        </CenteredContainer>
      </Layout>
    );
  }

  const StatusIcon = statusConfig[task.status]?.icon || Circle;
  const statusInfo = statusConfig[task.status] || statusConfig.TODO;

  return (
    <Layout>
      <CenteredContainer>
        <div className="space-y-6">
          {/* Header com título e ações */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {task.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Calendar className="h-4 w-4" />
                <span>
                  Criada em{" "}
                  {new Date(task.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-zinc-700 hover:bg-zinc-800 hover:text-input text-input cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                cursor-pointer Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-red-400 hover:text-red-300 cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>

          {/* Card principal com informações */}
          <Card className="bg-primary border-zinc-800">
            <CardContent className="pt-6 space-y-6">
              {/* Badges */}
              <div className="flex items-center gap-3">
                <PriorityBadge priority={task.priority} />
                <Badge variant="outline" className={statusInfo.color}>
                  <StatusIcon className="h-3 w-3 mr-1.5" />
                  {statusInfo.label}
                </Badge>
              </div>

              {/* Descrição */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-white">
                  Descrição
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Informações em grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Prazo */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white mb-0.5">
                      Prazo
                    </p>
                    <p className="text-sm text-zinc-400">
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString("pt-BR")
                        : "Sem prazo definido"}
                    </p>
                  </div>
                </div>

                {/* Criador */}
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white mb-0.5">
                      Criado por
                    </p>
                    <p className="text-sm text-zinc-400 font-mono text-xs">
                      {task.createdBy}
                    </p>
                  </div>
                </div>

                {/* Última atualização */}
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white mb-0.5">
                      Última atualização
                    </p>
                    <p className="text-sm text-zinc-400">
                      {new Date(task.updatedAt).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(task.updatedAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de atribuições */}
          <Card className="bg-primary border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Pessoas Atribuídas</CardTitle>
              <CardDescription className="text-zinc-400">
                Membros da equipe trabalhando nesta tarefa
              </CardDescription>
              <CardAction>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-200"
                >
                  Adicionar
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-medium">
                  U
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Nenhuma atribuição ainda
                  </p>
                  <p className="text-sm text-zinc-400">
                    Atribua pessoas para começar a colaboração
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de comentários */}
          <Card className="bg-primary border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Comentários</CardTitle>
              <CardDescription className="text-zinc-400">
                Discussões sobre esta tarefa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400 text-center py-12">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            </CardContent>
          </Card>
        </div>
      </CenteredContainer>
    </Layout>
  );
}
