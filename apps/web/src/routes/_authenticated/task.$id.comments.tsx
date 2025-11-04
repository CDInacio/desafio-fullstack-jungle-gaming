import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useCreatTaskComment, useGetTask } from "@/hooks/use-tasks.hook";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import type { ITaskComment } from "@/types/task";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/task/$id/comments")({
  component: TaskCommentsComponent,
});

function TaskCommentsComponent() {
  const { user } = useAuth();
  const { id } = useParams({ strict: false });
  const { data: response } = useGetTask(id);
  const { mutate: createComment } = useCreatTaskComment();
  const [newComment, setNewComment] = useState("");

  const task = response?.data;
  const comments = task?.comments || [];
  const commentsCount = comments.length;

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const commentData: ITaskComment = {
      content: newComment,
      taskId: id,
      userId: user?.id,
    };
    createComment(commentData, {
      onSuccess: () => {
        setNewComment(""); // Limpa o textarea após sucesso
      },
    });
  };

  return (
    <div className="space-y-6">
      <Link to="/task/$id" params={{ id: id as string }}>
        <Button
          variant="ghost"
          className="text-zinc-400 hover:text-white mb-5 hover:bg-zinc-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a tarefa
        </Button>
      </Link>

      <Card className="bg-primary border-zinc-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-white text-2xl">Comentários</CardTitle>
              <p className="text-zinc-400 text-sm mt-1">
                {task?.title || "Tarefa"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Formulário para adicionar novo comentário */}
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            <label className="text-sm font-medium text-white mb-2 block">
              Adicionar comentário
            </label>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário aqui..."
              className="w-full bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 min-h-[120px] resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-zinc-500">
                {newComment.length}/1000 caracteres
              </span>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                Comentar
              </Button>
            </div>
          </div>

          {/* Seção de comentários existentes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Comentários anteriores
              </h3>
              <span className="text-xs text-zinc-500">
                {commentsCount}{" "}
                {commentsCount === 1 ? "comentário" : "comentários"}
              </span>
            </div>

            {/* Lista de comentários */}
            <div className="space-y-4">
              {commentsCount === 0 ? (
                /* Estado vazio */
                <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700 border-dashed text-center">
                  <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400 font-medium">
                    Nenhum comentário ainda
                  </p>
                  <p className="text-zinc-500 text-sm mt-1">
                    Seja o primeiro a comentar nesta tarefa
                  </p>
                </div>
              ) : (
                /* Lista de comentários */
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar do usuário */}
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {comment.user?.username?.charAt(0).toUpperCase() ||
                            "?"}
                        </span>
                      </div>

                      {/* Conteúdo do comentário */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-white">
                            {comment.user?.username || "Usuário desconhecido"}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {comment.user?.email}
                          </span>
                          <span className="text-xs text-zinc-500">•</span>
                          <span className="text-xs text-zinc-500">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300 whitespace-pre-wrap break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
