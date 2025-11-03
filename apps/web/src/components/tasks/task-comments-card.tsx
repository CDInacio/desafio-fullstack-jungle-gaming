import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link, useParams } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export function TaskCommentsCard() {
  const { id } = useParams({ strict: false });

  return (
    <Link to={"/task/$id/comments"} params={{ id: id }}>
      <Card className="bg-primary border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comentários
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Discussões sobre esta tarefa
              </CardDescription>
            </div>
            <span className="text-sm text-blue-400">Ver todos →</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400 text-center py-12">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
