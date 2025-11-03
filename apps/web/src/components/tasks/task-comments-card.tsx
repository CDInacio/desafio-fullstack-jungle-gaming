import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link, useParams } from "@tanstack/react-router";
export function TaskCommentsCard() {
  const { id } = useParams({ strict: false });

  return (
    <Card className="bg-primary border-zinc-800">
      <Link to="/task/$id/comments" params={{ id: id }}>
        Ver todos os comentários
      </Link>
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
  );
}
