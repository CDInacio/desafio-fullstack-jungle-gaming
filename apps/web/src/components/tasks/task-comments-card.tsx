import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link, useParams } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import type { ITask } from "@/types/task";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskCommentsCardProps {
  task?: ITask;
}

export function TaskCommentsCard({ task }: TaskCommentsCardProps) {
  const { id } = useParams({ strict: false });

  if (!task) {
    return null;
  }

  const comments = task.comments || [];
  const commentsCount = comments.length;
  const previewComments = comments.slice(0, 3);
  return (
    <Card className="bg-primary border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                Comentários
                {commentsCount > 0 && (
                  <span className="text-xs bg-blue-600/20 text-blue-600 px-2 py-1 rounded-full font-normal">
                    {commentsCount}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Discussões sobre esta tarefa
              </CardDescription>
            </div>
          </div>
          {commentsCount > 0 && (
            <Link
              to="/task/$id/comments"
              params={{ id: id as string }}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              Ver todos →
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {commentsCount === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
            <Link to="/task/$id/comments" params={{ id: id as string }}>
              <button className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Adicionar comentário
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {previewComments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-zinc-600/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="border border-gray-500 w-8 h-8   rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {comment.user?.username?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {comment.user?.username || "Usuário desconhecido"}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 line-clamp-2">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {commentsCount > 3 && (
              <Link
                to="/task/$id/comments"
                params={{ id: id as string }}
                className="block text-center py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Ver mais {commentsCount - 3} comentário(s)
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
